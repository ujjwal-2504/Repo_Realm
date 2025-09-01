const mongoose = require("mongoose");
const Activity = require("../models/activityModel");

const trackActivity = async (userId) => {
  const today = new Date().toISOString().split("T")[0].replaceAll("-", "/");

  await Activity.updateOne(
    { date: today },
    {
      $inc: { [`activities.${userId}`]: 1 },
    },
    { upsert: true }
  );
};

const getActivityByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const docs = await Activity.find({});

    // Convert to heat-map array
    const newDocs = docs.map((doc) => ({
      date: doc.date, // already in yyyy/mm/dd
      count: doc.activities[userId] || 0, // activity count
    }));

    res.status(200).json(newDocs);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { trackActivity, getActivityByUserId };
