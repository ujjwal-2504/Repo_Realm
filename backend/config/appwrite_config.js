const { Client, Storage } = require("node-appwrite");
const { envConfig } = require("../env_import/envConfig");

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(envConfig.appwriteEndpointUrl)
  .setProject(envConfig.projectId)
  .setKey(envConfig.appwriteApiKey);

// Initialize storage
const storage = new Storage(client);

module.exports = { client, storage };
