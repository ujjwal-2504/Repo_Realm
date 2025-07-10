const { initRepo } = require("./init.js");
const { addFiles } = require("./add.js");
const { revertRepo } = require("./revert.js");
const { pushRepo } = require("./push.js");
const { commitRepo } = require("./commit.js");
const { pullRepo } = require("./pull.js");
const { debugStorage } = require("./debugStorage.js");

module.exports = {
  initRepo,
  addFiles,
  revertRepo,
  pushRepo,
  commitRepo,
  pullRepo,
  debugStorage,
};
