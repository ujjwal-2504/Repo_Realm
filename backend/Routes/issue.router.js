const express = require("express");
const issueController = require("../controllers/issueController");

const issueRouter = express.Router();

issueRouter.post("/create", issueController.createIssue);
issueRouter.put("/update/:id", issueController.updateIssue);
issueRouter.delete("/delete/:id", issueController.deleteIssue);
issueRouter.get("/all", issueController.getAllIssues);
issueRouter.get("/:id", issueController.getIssueById);

module.exports = issueRouter;
