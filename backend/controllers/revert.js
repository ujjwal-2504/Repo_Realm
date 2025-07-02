const fs = require("fs");
const path = require("path");
const { promisify } = require("util"); // this allows to check exsiting things

// wrapped under promisify so that it can read only those directory which exists.
// if directory doesn't exist then this will give error.
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(commitId) {
  const repoPath = path.resolve(process.cwd(), ".repoRealm");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitId);
    const files = await readdir(commitDir);

    // if files found then move them in the parent directory
    const parentDir = path.resolve(".");
    for (const file of files) {
      if (file === "commit.json") continue;
      await copyFile(path.join(commitDir, file), path.join(parentDir, file));
    }

    console.log(`\n Commit ${commitId} reverted successfully 🎉!`);
  } catch (error) {
    console.error("Unable to Revert: ", error.message);
  }
}

module.exports = { revertRepo };
