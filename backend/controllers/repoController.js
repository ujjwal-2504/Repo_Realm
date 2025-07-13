const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");
const User = require("../models/userModel");

const createRepository = async (req, res) => {
  const { userId, name, issues, content, description, visibility, language } =
    req.body;

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

    // Check if repository name already exists for this user
    const existingRepo = await Repository.findOne({ name, owner: userId });
    if (existingRepo) {
      return res
        .status(400)
        .json({ error: "Repository name already exists for this user" });
    }

    const newRepository = new Repository({
      name,
      owner: userId,
      content: content || [],
      description: description || "",
      visibility: visibility || false,
      issues: issues || [],
      language: language || [],
      // stars array defaults to empty (defined in schema)
      // starCount defaults to 0 (defined in schema)
      // collaborators defaults to empty array
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
    // Only return public repositories for security
    const allRepos = await Repository.find({ visibility: true })
      .populate("owner", "username email")
      .populate("issues")
      .populate("collaborators", "username email")
      .sort({ starCount: -1 }); // Sort by popularity

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
      .populate("owner", "username email")
      .populate("issues")
      .populate("collaborators", "username email");

    if (!repo) {
      return res.status(404).json({ error: "No repository found" });
    }

    // Check if user can access this repository
    const userId = req.user?.userId;
    if (!repo.visibility && repo.owner._id.toString() !== userId) {
      // Check if user is a collaborator
      const isCollaborator = repo.collaborators.some(
        (collaborator) => collaborator._id.toString() === userId
      );

      if (!isCollaborator) {
        return res
          .status(403)
          .json({ error: "Access denied to private repository" });
      }
    }

    res.json(repo);
  } catch (error) {
    console.error("Error during fetching repository: ", error.message);
    res.status(500).send("Server Error");
  }
};

const fetchRepositoryByName = async (req, res) => {
  const { repoName } = req.params;
  const { owner } = req.query; // Get owner from query params

  try {
    let query = { name: repoName };

    // If owner is specified, find repo by specific owner
    if (owner) {
      const ownerUser = await User.findOne({ username: owner });
      if (!ownerUser) {
        return res.status(404).json({ error: "Owner not found" });
      }
      query.owner = ownerUser._id;
    }

    const repo = await Repository.findOne(query)
      .populate("owner", "username email")
      .populate("issues")
      .populate("collaborators", "username email");

    if (!repo) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Check access permissions
    const userId = req.user?.userId;
    if (!repo.visibility && repo.owner._id.toString() !== userId) {
      const isCollaborator = repo.collaborators.some(
        (collaborator) => collaborator._id.toString() === userId
      );

      if (!isCollaborator) {
        return res
          .status(403)
          .json({ error: "Access denied to private repository" });
      }
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
    const repositories = await Repository.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    })
      .populate("owner", "username email")
      .populate("collaborators", "username email")
      .sort({ updatedAt: -1 }); // Sort by recently updated

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
  const { content, description, language } = req.body;
  const { userId } = req.user;

  try {
    const repo = await Repository.findById(id);

    if (!repo) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Check if user is owner or collaborator
    const isOwner = repo.owner.toString() === userId;
    const isCollaborator = repo.collaborators.includes(userId);

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({
        error:
          "Access denied. You're not authorized to update this repository.",
      });
    }

    // Update fields if provided
    if (content) {
      // Validate content is string before pushing
      if (typeof content === "string") {
        repo.content.push(content);
      } else {
        return res.status(400).json({ error: "Content must be a string" });
      }
    }

    if (description !== undefined) {
      repo.description = description;
    }

    if (language && Array.isArray(language)) {
      repo.language = language;
    }

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
  const { userId } = req.user;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Only owner can toggle visibility
    if (repository.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Only repository owner can change visibility" });
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
  const { userId } = req.user;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Only owner can delete repository
    if (repository.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Only repository owner can delete this repository" });
    }

    await Repository.findByIdAndDelete(id);

    res.json({ message: "Repository deleted successfully!!" });
  } catch (error) {
    console.error("Error during deletion of repository : ", error.message);
    res.status(500).send("Server Error");
  }
};

// New function to add/remove collaborators
const manageCollaborators = async (req, res) => {
  const { id } = req.params;
  const { collaboratorId, action } = req.body; // action: 'add' or 'remove'
  const { userId } = req.user;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Only owner can manage collaborators
    if (repository.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Only repository owner can manage collaborators" });
    }

    if (!mongoose.Types.ObjectId.isValid(collaboratorId)) {
      return res.status(400).json({ error: "Invalid collaborator ID" });
    }

    // Check if collaborator exists
    const collaborator = await User.findById(collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ error: "Collaborator not found" });
    }

    if (action === "add") {
      if (!repository.collaborators.includes(collaboratorId)) {
        repository.collaborators.push(collaboratorId);
      }
    } else if (action === "remove") {
      repository.collaborators = repository.collaborators.filter(
        (id) => id.toString() !== collaboratorId
      );
    } else {
      return res
        .status(400)
        .json({ error: "Invalid action. Use 'add' or 'remove'" });
    }

    const updatedRepo = await repository.save();

    res.json({
      message: `Collaborator ${action}ed successfully!`,
      updatedRepo,
    });
  } catch (error) {
    console.error("Error during collaborator management: ", error.message);
    res.status(500).send("Server Error");
  }
};

// New function to star/unstar repository
const toggleStar = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Check if repository is accessible
    if (!repository.visibility && repository.owner.toString() !== userId) {
      const isCollaborator = repository.collaborators.includes(userId);
      if (!isCollaborator) {
        return res
          .status(403)
          .json({ error: "Access denied to private repository" });
      }
    }

    // Check if user already starred this repository
    const hasStarred = repository.stars.includes(userId);

    if (hasStarred) {
      // Remove star
      repository.stars = repository.stars.filter(
        (starUserId) => starUserId.toString() !== userId
      );
      repository.starCount = repository.starCount - 1;
    } else {
      // Add star
      repository.stars.push(userId);
      repository.starCount = repository.starCount + 1;
    }

    const updatedRepo = await repository.save();

    res.json({
      message: hasStarred
        ? "Repository unstarred successfully!"
        : "Repository starred successfully!",
      starCount: updatedRepo.starCount,
      hasStarred: !hasStarred,
    });
  } catch (error) {
    console.error("Error during star toggle: ", error.message);
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
  manageCollaborators,
  toggleStar,
};
