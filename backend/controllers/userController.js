const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ReturnDocument } = require("mongodb");
require("dotenv").config();
const { mongoDbUri, jwtSecretKey } = require("../env_import/envConfig");
const {
  validatePassword,
  validateEmail,
} = require("../utils/validateCredentials");
var ObjectId = require("mongodb").ObjectId;

let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(mongoDbUri);
    await client.connect();
  }
}

const getAllUsers = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("repoRealm");
    const usersCollection = db.collection("users");

    const user = await usersCollection.find({}).toArray();
    res.json(user);
  } catch (error) {
    console.error("Error during fetching: ", error.message);
    res.status(500).send("Server Error", error.message);
  }
};

const signup = async (req, res) => {
  const { name, username, email, password } = req.body;

  // Input validation
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one special character and one number",
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
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

    const newUser = {
      name,
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      myFollowers: [],
      starredRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign({ id: result.insertedId }, jwtSecretKey, {
      expiresIn: "7d",
    });

    res.json({ token, userId: result.insertedId });
  } catch (error) {
    console.error("Error during signup: ", error.message);
    res.status(500).send("Server Error", error.message);
  }
};

const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one special character and one number",
      });
    }

    await connectClient();
    const db = client.db("repoRealm");
    const usersCollection = db.collection("users");

    let user;

    if (validateEmail(usernameOrEmail)) {
      user = await usersCollection.findOne({
        email: usernameOrEmail,
      });
    } else {
      user = await usersCollection.findOne({
        username: usernameOrEmail,
      });
    }

    //user not found
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, jwtSecretKey, {
      expiresIn: "7d",
    });

    res.json({
      token,
      userId: user._id,
      username: user.username,
      name: user.name,
    });
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).send("Server Error!");
  }
};

const getUserProfile = async (req, res) => {
  const currentId = req.params.id;

  try {
    await connectClient();
    const db = client.db("repoRealm");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(currentId),
    });

    //user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.send(user);
  } catch (error) {
    console.error("Error during fetching: ", error.message);
    res.status(500).send("Server Error", error.message);
  }
};

const updateUserProfile = async (req, res) => {
  const currentId = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("repoRealm");
    const usersCollection = db.collection("users");

    let updateFields = { email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(currentId) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.send(result);
  } catch (error) {
    console.error("Error during fetching: ", error.message);
    res.status(500).send("Server Error", error.message);
  }
};

const deleteUserProfile = async (req, res) => {
  const currentId = req.params.id;

  try {
    await connectClient();
    const db = client.db("repoRealm");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currentId),
    });

    if (!result.deleteCount == 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User Profile Deleted" });
  } catch (error) {
    console.error("Error during fetching: ", error.message);
    res.status(500).send("Server Error", error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  signup,
  login,
};
