const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();
const { jwtSecretKey } = require("../env_import/envConfig");
const {
  validatePassword,
  validateEmail,
} = require("../utils/validateCredentials");
const User = require("../models/userModel");
const Repository = require("../models/repoModel");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Signup
const signup = async (req, res) => {
  const { name, username, email, password } = req.body;

  // Input validation
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include lowercase, uppercase, special character and number",
    });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Check existing user
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create user document
    const newUser = new User({
      name,
      username,
      email,
      password: hashed,
    });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, jwtSecretKey, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, userId: newUser._id });
  } catch (error) {
    console.error("Error during signup:", error);

    res.status(500).json({ message: "Server Error" });
  }
};

// Login
const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Invalid password format" });
    }

    // Find user by email or username
    const query = validateEmail(usernameOrEmail)
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail };
    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    // Sign token
    const token = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: "7d" });
    res.json({
      token,
      userId: user._id,
      username: user.username,
      name: user.name,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  const currentId = req.params.id;
  const { userId } = req.user;

  try {
    const idToFetch = currentId === "self" ? userId : currentId;

    if (!mongoose.Types.ObjectId.isValid(idToFetch)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(idToFetch)
      .populate("followedUsers", "name username")
      .populate("myFollowers", "name username")
      .populate("repositories", "name owner description visibility")
      .populate("starredRepos", "name owner description visibility");

    if (!user) return res.status(404).json({ message: "User not found" });
    res
      .status(200)
      .json({ message: "User profile retrieved successfully", user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Toggle Follow User -> Follow/Unfollow user
const toggleFollowUser = async (req, res) => {
  const targetUserId = req.params.id;
  const { userId: currentUserId } = req.user;

  try {
    // Prevent self-following
    if (currentUserId === targetUserId) {
      return res.status(403).json({
        success: false,
        error: "You cannot follow yourself",
      });
    }

    // Find both users in a single Promise.all for better performance
    const [targetUser, currentUser] = await Promise.all([
      User.findById(targetUserId),
      User.findById(currentUserId),
    ]);

    // Check if target user exists
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${targetUserId} not found`,
      });
    }

    // Check if current user exists (shouldn't happen if auth is working properly)
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        error: "Current user not found",
      });
    }

    // Check if already following
    const isCurrentlyFollowing = currentUser.followedUsers.some(
      (userId) => userId.toString() === targetUserId.toString()
    );

    let action;

    if (isCurrentlyFollowing) {
      // Unfollow: Remove target user from current user's followedUsers
      currentUser.followedUsers = currentUser.followedUsers.filter(
        (userId) => userId.toString() !== targetUserId.toString()
      );

      // Remove current user from target user's myFollowers
      targetUser.myFollowers = targetUser.myFollowers.filter(
        (userId) => userId.toString() !== currentUserId.toString()
      );

      action = "unfollowed";
    } else {
      // Follow: Add target user to current user's followedUsers
      currentUser.followedUsers.push(targetUserId);

      // Add current user to target user's myFollowers
      targetUser.myFollowers.push(currentUserId);

      action = "followed";
    }

    // Save both users
    await Promise.all([currentUser.save(), targetUser.save()]);

    res.json({
      success: true,
      message: `${currentUser.username} ${action} ${targetUser.username}`,
      data: {
        action,
        targetUser: {
          id: targetUser._id,
          username: targetUser.username,
          followersCount: targetUser.myFollowers.length,
        },
        currentUser: {
          id: currentUser._id,
          username: currentUser.username,
          followingCount: currentUser.followedUsers.length,
        },
      },
    });
  } catch (error) {
    console.error("Error toggling follow status:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const currentId = req.params.id;
  const { email, password } = req.body;

  let updateFields = {};
  if (email) updateFields.email = email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateFields.password = await bcrypt.hash(password, salt);
  }

  try {
    const updated = await User.findByIdAndUpdate(
      currentId,
      { $set: updateFields },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated", user: updated });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete user profile
const deleteUserProfile = async (req, res) => {
  const currentId = req.params.id;

  try {
    const deleted = await User.findByIdAndDelete(currentId);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getStarredRepositoriesOfUser = async (req, res) => {
  const { userId } = req.user;
  const id = req.params.id;

  try {
    const repo = await Repository.find({ stars: id })
      .populate("owner", "username email")
      .populate("issues")
      .populate("collaborators", "username email");

    if (repo.length === 0) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json(repo);
  } catch (error) {
    console.error(
      "Error during fetching star repositories of user: ",
      id,
      " : ",
      error.message
    );
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getStarredRepositoriesOfUser,
  toggleFollowUser,
};
