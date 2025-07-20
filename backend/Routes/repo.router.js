const express = require("express");
const repoController = require("../controllers/repoController");
const { authUser } = require("../middleware/authMiddleware");

const repoRouter = express.Router();

// Create repository
repoRouter.post("/create", authUser, repoController.createRepository);

// Get all public repositories
repoRouter.get("/all", repoController.getAllRepositories);

// Get current user's repositories
repoRouter.get(
  "/user/repos",
  authUser,
  repoController.fetchRepositoryForCurrentUser
);

// Star/unstar repository
repoRouter.post("/star/:id", authUser, repoController.toggleStar);

// Manage collaborators
repoRouter.post("/collaborators/:id", repoController.manageCollaborators);

// Get repository by name with optional owner query parameter
// Usage: GET /repo/name/my-repo?owner=username
repoRouter.get("/name/:repoName", repoController.fetchRepositoryByName);

// Update repository
repoRouter.put("/update/:id", repoController.updateRepositoryById);

// Toggle visibility
repoRouter.patch("/toggle/:id", repoController.toggleVisibilityById);

// Delete repository
repoRouter.delete("/delete/:id", repoController.deleteRepositoryById);

// Get repository by ID (should be last to avoid conflicts)
repoRouter.get("/:id", repoController.fetchRepositoryById);

module.exports = repoRouter;
