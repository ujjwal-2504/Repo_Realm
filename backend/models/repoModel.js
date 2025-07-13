const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const RepositorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    content: [
      {
        type: String,
      },
    ],
    visibility: {
      type: Boolean,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
    language: [
      {
        type: String,
        enum: [
          "JavaScript",
          "Python",
          "Java",
          "C++",
          "TypeScript",
          "Go",
          "Rust",
          "C",
          "Other",
        ],
      },
    ],
    stars: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    starCount: {
      type: Number,
      default: 0,
    },
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

RepositorySchema.index({ owner: 1, name: 1 }, { unique: true });
RepositorySchema.index({ visibility: 1 });
RepositorySchema.index({ starCount: -1 }); // for popular repos
RepositorySchema.index({ createdAt: -1 }); // for recent repos

const Repository = model("Repository", RepositorySchema);

module.exports = Repository;
