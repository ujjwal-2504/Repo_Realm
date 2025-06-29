const fs = require("fs").promises;
const path = require("path");

async function addFiles(files) {
  const repoPath = path.resolve(process.cwd(), ".repoRealm");
  const stagedPath = path.join(repoPath, "staged");

  if (files.length === 0) {
    console.log("Give file names along with add command");
    return;
  }

  try {
    await fs.mkdir(stagedPath, { recursive: true });

    for (filePath of files) {
      const fileName = path.basename(filePath);
      await fs.copyFile(filePath, path.join(stagedPath, fileName));
    }
    console.log(`Files added to the staged area: ${files.join(", ")} `);
  } catch (error) {
    console.error("Error in adding file ", error);
  }
}

module.exports = { addFiles };
