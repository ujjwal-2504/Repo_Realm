const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ActivitySchema = new Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  activities: {
    type: Schema.Types.Mixed, // Allows dynamic object structure
    default: {},
  },
});

// Index for efficient date range queries
ActivitySchema.index({ date: 1 });

const Activity = model("Activity", ActivitySchema);
module.exports = Activity;
