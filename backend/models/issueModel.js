const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const IssueSchema = new Schema({
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
    enum: ["open", "closed"],
    default: "open",
  },
  repository: {
    type: Schema.Types.ObjectId,
    ref: "Repository",
    required: true,
  },
});

const Issue = model("Issue", IssueSchema);
export default Issue;
