const { storage } = require("../config/appwrite_config");
const { envConfig } = require("../env_import/envConfig");

async function debugStorage() {
  await storageDebug();
}

async function storageDebug() {
  try {
    console.log("=== DEBUG: Storage File Analysis ===\n");

    // List all files in storage
    const fileList = await storage.listFiles(envConfig.bucketId);

    console.log(`Total files in storage: ${fileList.files.length}\n`);

    // Focus on commit.json files
    const commitJsonFiles = fileList.files.filter(
      (file) => file.name.includes("commit.json") || file.$id.includes("commit")
    );

    console.log("=== COMMIT.JSON FILES ===");
    commitJsonFiles.forEach((file) => {
      console.log(`File ID: ${file.$id}`);
      console.log(`File Name: ${file.name}`);
      console.log(`File Size: ${file.sizeOriginal} bytes`);
      console.log(`Created: ${file.$createdAt}`);
      console.log(`MIME Type: ${file.mimeType}`);
      console.log("---");
    });

    // Try to download the specific commit.json file
    const targetFileId = "324a174b_commit.json";
    console.log(`\n=== DOWNLOADING ${targetFileId} ===`);

    try {
      const fileData = await storage.getFileDownload(
        envConfig.bucketId,
        targetFileId
      );

      console.log("Download successful!");
      console.log("Data type:", typeof fileData);
      console.log("Data constructor:", fileData.constructor.name);

      // Try different ways to read the data
      if (fileData instanceof ArrayBuffer) {
        const text = new TextDecoder().decode(fileData);
        console.log("Content as text:", text);
        console.log("Content length:", text.length);
      } else if (typeof fileData === "string") {
        console.log("Content as string:", fileData);
        console.log("Content length:", fileData.length);
      } else {
        console.log("Raw data:", fileData);
      }
    } catch (downloadError) {
      console.error("Download failed:", downloadError.message);
    }
  } catch (error) {
    console.error("Debug failed:", error.message);
  }
}

module.exports = { debugStorage };
