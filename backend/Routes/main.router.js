const express = require("express");

const mainRouter = express.Router();

mainRouter.get("/", (req, res) => {
  res.send("Hello");
});

module.exports = mainRouter;
