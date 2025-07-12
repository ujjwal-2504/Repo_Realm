const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");
const User = require("../models/userModel");

const createIssue = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params; // repo id

  if (!title || !description || !id) {
    return res.status(400).json({ error: "All fields are requied" });
  }

  try {
    const issue = new Issue({
      title,
      description,
      repository: id,
    });

    await issue.save();
    res.status(201).json({ message: "Issue created successfully!!", issue });
  } catch (error) {
    console.error("Error during Issue creation: ", error.message);
    res.status(500).send("Server Error");
  }
};

const updateIssue = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (!title || !description || !id || !status) {
    return res.status(400).json({ error: "All fields are requied" });
  }

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();

    res.json({ message: "Issue updated successfully!!", issue });
  } catch (error) {
    console.error("Error during Issue updation: ", error.message);
    res.status(500).send("Server Error");
  }
};

const deleteIssue = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json({ message: "Issue deleted successfully!!" });
  } catch (error) {
    console.error("Error during Issue updation: ", error.message);
    res.status(500).send("Server Error");
  }
};

const getAllIssues = async (req, res) => {
  const { id } = req.params; // repo id

  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }

  try {
    const issues = await Issue.find({ repository: id });

    if (issues.length == 0) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.status(200).json({ issues });
  } catch (error) {
    console.error("Error during Issue fetching: ", error.message);
    res.status(500).send("Server Error");
  }
};

const getIssueById = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(issue);
  } catch (error) {
    console.error("Error during Issue fetching: ", error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createIssue,
  deleteIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
};
