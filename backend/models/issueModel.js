const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const IssueSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "closed", "resolved"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    labels: [
      {
        type: String,
        trim: true,
        maxlength: 50,
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow anonymous issue creation
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    closedAt: {
      type: Date,
      required: false,
    },
    repository: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
  },
  { timestamps: true }
);

const Issue = model("Issue", IssueSchema);
module.exports = Issue;
