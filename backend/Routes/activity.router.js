const express = require("express");
const { getActivityByUserId } = require("../controllers/activityController");

const activityRouter = express.Router();

activityRouter.get("/user/activity/:userId", getActivityByUserId);

module.exports = activityRouter;
