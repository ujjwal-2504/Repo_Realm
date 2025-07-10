const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post("/create", repoController.createRepository);
repoRouter.get("/all", repoController.getAllRepositories);
repoRouter.get("/id/:id", repoController.fetchRepositoryById);
repoRouter.get("/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/userId/:userId", repoController.fetchRepositoryForCurrentUser);
repoRouter.put("/update/:id", repoController.updateRepositoryById);
repoRouter.patch("/toggle/:id", repoController.toggleVisibilityById);
repoRouter.delete("/delete/:id", repoController.deleteRepositoryById);

module.exports = repoRouter;
