const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".repoRealm");
  const stagedPath = path.join(repoPath, "staged");
  const commitPath = path.join(repoPath, "commits");

  try {
    // Check if staged directory exists
    try {
      await fs.access(stagedPath);
    } catch (error) {
      console.log("No staged files found. Use 'add' command first.");
      return;
    }

    // Check if there are files to commit
    const files = await fs.readdir(stagedPath);
    if (files.length === 0) {
      console.log("No files staged for commit.");
      return;
    }

    const commitId = uuidv4();
    const commitDir = path.join(commitPath, commitId);
    await fs.mkdir(commitDir, { recursive: true });

    // Copy each staged file to the commit directory
    for (const file of files) {
      await fs.copyFile(
        path.join(stagedPath, file),
        path.join(commitDir, file)
      );
    }

    // Create commit metadata
    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify(
        {
          message,
          date: new Date().toISOString(),
          files: files,
          commitId: commitId,
        },
        null,
        2
      )
    );

    // Clear the staging area after successful commit
    await clearStagingArea(stagedPath, files);

    console.log(`Commit: ${commitId} created with message: "${message}"`);
    console.log(`Files committed: ${files.join(", ")}`);
  } catch (error) {
    console.log("Error in committing files:", error);
  }
}

// Helper function - removes ALL files in staged directory
async function clearStagingArea(stagedPath) {
  try {
    const files = await fs.readdir(stagedPath);
    for (const file of files) {
      const filePath = path.join(stagedPath, file);
      const stat = await fs.stat(filePath);
      // checks if each item is actually a file before deleting
      if (stat.isFile()) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.log("Warning: Could not clear staging area:", error);
  }
}

module.exports = { commitRepo };
