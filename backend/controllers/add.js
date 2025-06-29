const fs = require("fs").promises;
const path = require("path");

async function addFiles(filePath) {
  const repoPath = path.resolve(process.cwd(), ".repoRealm");
  const stagedPath = path.join(repoPath, "staged");

  try {
    await fs.mkdir(stagedPath, { recursive: true });
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagedPath, fileName));
    console.log(`File ${fileName} is added to the staging area.`);
  } catch (error) {
    console.error("Error in adding file ", error);
  }
}

module.exports = { addFiles };
