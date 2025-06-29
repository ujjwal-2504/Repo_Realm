const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".repoRealm");
  const commitsPath = path.join(repoPath, "commits");
  const configPath = path.join(repoPath, "config.json");

  try {
    // Check if .repoRealm folder already exists
    await fs.access(repoPath);
    console.log("Repository is already initialized!");
    return; // Exit early if already exists
  } catch (error) {
    // Folder doesn't exist, proceed with initialization
    try {
      await fs.mkdir(repoPath, { recursive: true });
      await fs.mkdir(commitsPath, { recursive: true });
      await fs.writeFile(
        configPath,
        JSON.stringify({ bucket: "process.env.S3" })
      );

      console.log("Repository initialized!");
    } catch (initError) {
      console.error("Error initializing the repository", initError);
    }
  }
}

module.exports = { initRepo };
