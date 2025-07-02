const fs = require("fs").promises;
const path = require("path");
const { storage, databases } = require("../config/appwrite_config");
const { envConfig } = require("../env_import/envConfig");
const { InputFile } = require("node-appwrite/file");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".repoRealm");
  const commitsPath = path.join(repoPath, "commits");

  try {
    console.log("Fetching commit metadata from database...");

    // Step 1: Get all file metadata from database
    const response = await databases.listDocuments(
      envConfig.appwriteDatabaseId,
      envConfig.appwriteCollectionId
    );

    if (response.documents.length === 0) {
      console.log("No commits found in remote repository.");
      return;
    }

    console.log(
      `Found ${response.documents.length} files in remote repository.`
    );

    // Step 2: Group files by commit ID
    const commitGroups = {};
    response.documents.forEach((doc) => {
      const commitId = doc.fullCommitId;
      if (!commitGroups[commitId]) {
        commitGroups[commitId] = [];
      }
      commitGroups[commitId].push(doc);
    });

    const commitCount = Object.keys(commitGroups).length;
    console.log(
      `Organized into ${commitCount} commit(s). Starting download...`
    );

    // Step 3: Process each commit
    for (const [commitId, files] of Object.entries(commitGroups)) {
      console.log(`\nProcessing commit: ${commitId}`);

      // Create commit directory
      const commitDir = path.join(commitsPath, commitId);
      await fs.mkdir(commitDir, { recursive: true });

      // Step 4: Download each file in the commit
      for (const fileDoc of files) {
        try {
          console.log(`  Downloading: ${fileDoc.fileName}`);

          // Download file from storage
          const fileData = await storage.getFileDownload(
            envConfig.bucketId,
            fileDoc.fileId
          );

          // Save to local path
          const localFilePath = path.join(commitDir, fileDoc.fileName);

          // Convert the response to proper format for Node.js fs.writeFile
          let buffer;
          if (fileData instanceof ArrayBuffer) {
            buffer = Buffer.from(fileData);
          } else if (fileData instanceof Uint8Array) {
            buffer = Buffer.from(fileData);
          } else if (Buffer.isBuffer(fileData)) {
            buffer = fileData;
          } else if (typeof fileData === "string") {
            buffer = Buffer.from(fileData, "utf8");
          } else if (typeof fileData === "object" && fileData !== null) {
            // Handle JavaScript objects (like JSON files) - NEW FIX!
            const jsonString = JSON.stringify(fileData, null, 2);
            buffer = Buffer.from(jsonString, "utf8");
          } else {
            // Fallback for other types
            buffer = Buffer.from(String(fileData), "utf8");
          }

          await fs.writeFile(localFilePath, buffer);
          console.log(`  ✓ Saved: ${fileDoc.fileName}`);
        } catch (fileError) {
          console.error(
            `  ✗ Failed to download ${fileDoc.fileName}:`,
            fileError.message
          );
        }
      }

      console.log(`✓ Commit ${commitId.substring(0, 8)} completed`);
    }

    console.log(
      `\n🎉 Successfully pulled ${commitCount} commit(s) to local repository!`
    );
  } catch (error) {
    console.error("Error pulling repository:", error.message);
  }
}

module.exports = { pullRepo };
