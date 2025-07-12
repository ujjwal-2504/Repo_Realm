const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");
const User = require("../models/userModel");

const createRepository = async (req, res) => {
  const { userId, name, issues, content, description, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required" });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User Id" });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingRepo = await Repository.findOne({ name, owner: userId });
    if (existingRepo) {
      return res
        .status(400)
        .json({ error: "Repository name already exists for this user" });
    }

    const newRepository = new Repository({
      name,
      owner: userId,
      content: content || "",
      description: description || "",
      visibility: visibility || false,
      issues: issues || [],
    });

    const result = await newRepository.save();

    if (!result) {
      throw new Error("Repository not created");
    }

    return res
      .status(201)
      .json({ message: "Repository created", repositoryId: result._id });
  } catch (error) {
    console.error("Error during Repository creation: ", error.message);
    res.status(500).send("Server Error");
  }
};

const getAllRepositories = async (req, res) => {
  try {
    const allRepos = await Repository.find({})
      .populate("owner", "username email")
      .populate("issues");

    res.json(allRepos);
  } catch (error) {
    console.error("Error during fetching repositories: ", error.message);
    res.status(500).send("Server Error");
  }
};

const fetchRepositoryById = async (req, res) => {
  const repoId = req.params.id;

  try {
    const repo = await Repository.findById(repoId)
      .populate("owner")
      .populate("issues");

    if (!repo) {
      return res.status(404).json({ error: "No repository found" });
    }

    res.json(repo);
  } catch (error) {
    console.error("Error during fetching repository: ", error.message);
    res.status(500).send("Server Error");
  }
};

const fetchRepositoryByName = async (req, res) => {
  const repoName = req.params.name;

  try {
    const repo = await Repository.findOne({ name: repoName })
      .populate("owner")
      .populate("issues");

    if (!repo) {
      res.status(404).json({ error: "Repository not found!" });
    }

    res.json(repo);
  } catch (error) {
    console.error("Error during fetching repositories: ", error.message);
    res.status(500).send("Server Error");
  }
};

const fetchRepositoryForCurrentUser = async (req, res) => {
  const { userId } = req.user;

  try {
    const repositories = await Repository.find({ owner: userId });

    if (repositories.length === 0) {
      return res
        .status(404)
        .json({ error: "User's Repositories not found!!", repositories: [] });
    }

    res.json({ message: "Repositories found", repositories });
  } catch (error) {
    console.error("Error during fetching repositories: ", error.message);
    res.status(500).send("Server Error");
  }
};

const updateRepositoryById = async (req, res) => {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repo = await Repository.findById(id);

    if (!repo) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repo.content.push(content);
    repo.description = description;

    const updatedRepo = await repo.save();

    res.json({
      message: "Repository updated successfully!!",
      updatedRepo,
    });
  } catch (error) {
    console.error("Error during updating repository: ", error.message);
    res.status(500).send("Server Error");
  }
};

const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.visibility = !repository.visibility;

    const updatedRepo = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!!",
      updatedRepo,
    });
  } catch (error) {
    console.error(
      "Error during repository visibility toggle : ",
      error.message
    );
    res.status(500).send("Server Error");
  }
};

const deleteRepositoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const repository = await Repository.findByIdAndDelete(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json({ message: "Repository deleted successfully!!" });
  } catch (error) {
    console.error("Error during deletion of repository : ", error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoryForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
