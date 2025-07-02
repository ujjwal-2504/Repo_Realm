const fs = require("fs").promises;
const path = require("path");
const { storage, databases } = require("../config/appwrite_config");
const { envConfig } = require("../env_import/envConfig");
const { InputFile } = require("node-appwrite/file");

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".repoRealm");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // Check if commits directory exists
    try {
      await fs.access(commitsPath);
    } catch (error) {
      console.log("No commits found. Create a commit first.");
      return;
    }

    const commitDirs = await fs.readdir(commitsPath);

    if (commitDirs.length === 0) {
      console.log("No commits to push.");
      return;
    }

    console.log(`Pushing ${commitDirs.length} commit(s) to remote...`);

    for (const commitDir of commitDirs) {
      const commitDirPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitDirPath);

      console.log(`Processing commit: ${commitDir}`);

      for (const file of files) {
        const filePath = path.join(commitDirPath, file);

        // Skip if it's a directory
        const stat = await fs.stat(filePath);
        if (!stat.isFile()) continue;

        try {
          // Create unique file ID for Appwrite (max 36 chars, valid chars only)
          const commitHash = commitDir.substring(0, 8); // First 8 chars of commit
          const fileName = file.replace(/[^a-zA-Z0-9._-]/g, "_");
          const fileId = `${commitHash}_${fileName}`.substring(0, 36);

          const inputFile = InputFile.fromPath(filePath, file);

          // Upload to Appwrite Storage
          const result = await storage.createFile(
            envConfig.bucketId,
            fileId,
            inputFile,
            undefined // permissions (keep default)
          );
          console.log(`✓ Uploaded: ${file} (ID: ${result.$id})`);

          // Save file metadata to database
          try {
            await databases.createDocument(
              envConfig.appwriteDatabaseId,
              envConfig.appwriteCollectionId,
              "unique()", // Let Appwrite generate document ID
              {
                fileId: result.$id,
                fullCommitId: commitDir,
                originalPath: `commits/${commitDir}/${file}`,
                fileName: file,
                commitTimestamp: new Date().toISOString(),
              }
            );
            console.log(`✓ Metadata saved for: ${file}`);
          } catch (metadataError) {
            console.error(
              `✗ Failed to save metadata for ${file}:`,
              metadataError.message
            );
          }
        } catch (uploadError) {
          console.error(`✗ Failed to upload ${file}:`, uploadError.message);
        }
      }
    }
  } catch (error) {
    console.error("Error pushing files: ", error);
  }
}

module.exports = { pushRepo };
