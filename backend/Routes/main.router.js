const express = require("express");
const userRouter = require("./user.router");
const repoRouter = require("./repo.router");
const issueRouter = require("./issue.router");
const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use("/repo", repoRouter);
mainRouter.use("/issue", issueRouter);

mainRouter.get("/", (req, res) => {
  res.send("Hello");
});

module.exports = mainRouter;
