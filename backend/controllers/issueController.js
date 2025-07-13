const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");
const User = require("../models/userModel");

const createIssue = async (req, res) => {
  const { title, description, priority, labels } = req.body;
  const { id } = req.params; // repo id

  try {
    // Validate required fields
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Valid repository ID is required" });
    }

    // Check if repository exists
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    // Check if user has access to the repository
    if (
      !repository.visibility &&
      (!req.user || req.user.userId !== repository.owner.toString())
    ) {
      return res
        .status(403)
        .json({ error: "Access denied to private repository" });
    }

    // Create the issue
    const issue = new Issue({
      title,
      description,
      repository: id,
      creator: req.user ? req.user.userId : null,
      priority: priority || "medium",
      labels: labels || [],
      status: "open",
    });

    const savedIssue = await issue.save();

    const populatedIssue = await Issue.findById(savedIssue._id)
      .populate("creator", "username email")
      .populate("repository", "name owner");

    res
      .status(201)
      .json({ message: "Issue created successfully!!", populatedIssue });
  } catch (error) {
    console.error("Error during Issue creation: ", error.message);
    res.status(500).send("Server Error", error.message);
  }
};

const updateIssue = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, labels, assignee } = req.body;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Valid issue ID is required" });
    }

    const issue = await Issue.findById(id).populate("repository");

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    // Check if user has permission to update the issue
    const canUpdate =
      req.user &&
      (req.user.userId === issue.creator?.toString() ||
        req.user.userId === issue.repository.owner.toString());

    if (!canUpdate) {
      return res.status(403).json({
        error:
          "Access denied. You can only update issues you created or own the repository",
      });
    }

    // Validate status if provided
    const validStatuses = ["open", "in_progress", "closed", "resolved"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    // Validate priority if provided
    const validPriorities = ["low", "medium", "high", "urgent"];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        error:
          "Invalid priority. Must be one of: " + validPriorities.join(", "),
      });
    }

    // Update fields if provided
    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) {
      issue.status = status;
      if (status === "closed" || status === "resolved") {
        issue.closedAt = new Date();
      } else {
        issue.closedAt = null; // Clear closedAt if reopening
      }
    }
    if (priority !== undefined) issue.priority = priority;
    if (labels !== undefined) issue.labels = labels;
    if (assignee !== undefined) {
      if (assignee && !mongoose.Types.ObjectId.isValid(assignee)) {
        return res.status(400).json({ error: "Invalid assignee ID" });
      }
      issue.assignee = assignee;
    }

    const updatedIssue = await issue.save();

    const populatedIssue = await Issue.findById(updatedIssue._id)
      .populate("creator", "username email")
      .populate("assignee", "username email")
      .populate("repository", "name owner");

    res.json({
      message: "Issue updated successfully",
      issue: populatedIssue,
    });
  } catch (error) {
    console.error("Error during Issue updation: ", error.message);
    res.status(500).send("Server Error", error.message);
  }
};

const deleteIssue = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Valid issue ID is required" });
    }

    const issue = await Issue.findById(id).populate("repository");

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    // Check if user has permission to delete the issue
    const canDelete =
      req.user &&
      (req.user.userId === issue.creator?.toString() ||
        req.user.userId === issue.repository.owner.toString());

    if (!canDelete) {
      return res
        .status(403)
        .json({
          error:
            "Access denied. You can only delete issues you created or own the repository",
        });
    }

    // Delete the issue
    await Issue.findByIdAndDelete(id);

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error("Error during Issue deletion: ", error.message);
    res.status(500).json({ error: "Server Error", message: error.message });
  }
};

const getAllIssues = async (req, res) => {
  const { id } = req.params; // repo id

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Valid repository ID is required" });
    }

    // Check if repository exists and user has access
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    // Check if user has access to the repository
    if (
      !repository.visibility &&
      (!req.user || req.user.userId !== repository.owner.toString())
    ) {
      return res
        .status(403)
        .json({ error: "Access denied to private repository" });
    }

    const issues = await Issue.find({})
      .populate("creator", "username email")
      .populate("assignee", "username email");

    res.status(200).json({ issues });
  } catch (error) {
    console.error("Error during Issue fetching: ", error.message);
    res.status(500).send("Server Error", error.message);
  }
};

const getIssueById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Valid issue ID is required" });
    }

    const issue = await Issue.findById(id)
      .populate("creator", "username email")
      .populate("assignee", "username email")
      .populate("repository", "name owner visibility");

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    // Check if user has access to the repository
    if (
      !issue.repository.visibility &&
      (!req.user || req.user.userId !== issue.repository.owner.toString())
    ) {
      return res
        .status(403)
        .json({ error: "Access denied to private repository" });
    }

    res.json(issue);
  } catch (error) {
    console.error("Error during Issue fetching: ", error.message);
    res.status(500).send("Server Error", error.message);
  }
};

module.exports = {
  createIssue,
  deleteIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
};
