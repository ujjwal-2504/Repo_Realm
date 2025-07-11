const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { mongoDbUri, jwtSecretKey } = require("../env_import/envConfig");

let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(mongoDbUri);
    await client.connect();
  }
}

const getAllUsers = (req, res) => {
  res.send("All users fetched!");
};

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    await connectClient();
    const db = client.db("repoRealm");
    const usersCollection = db.collection("users");

    const userExist = await usersCollection.findOne({
      $or: [{ username }, { email }],
    });

    if (userExist) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(4);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      starredRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign({ id: result.insertedId }, jwtSecretKey, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error during signup: ", error.message);
    res.status(500).send("Server Error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("repoRealm");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      email,
    });

    //user not found
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, jwtSecretKey, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id });
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).send("Server Error!");
  }
};

const getUserProfile = (req, res) => {
  res.send("Profile feached!");
};

const updateUserProfile = (req, res) => {
  res.send("Profile updated!");
};

const deleteUserProfile = (req, res) => {
  res.send("Profile deleted!");
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  signup,
  login,
};
