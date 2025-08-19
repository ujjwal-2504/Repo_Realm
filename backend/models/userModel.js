const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    repositories: {
      type: [{ type: Schema.Types.ObjectId, ref: "Repository" }],
      default: [],
    },
    followedUsers: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    myFollowers: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    starredRepos: {
      type: [{ type: Schema.Types.ObjectId, ref: "Repository" }],
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const User = model("User", UserSchema);

module.exports = User;
