const envConfig = require("../env_import/envConfig");
const sdk = require("node-appwrite");

// Initialize Appwrite client
const client = new sdk.Client();
client
  .setEndpoint(envConfig.appwriteEndpointUrl)
  .setProject(envConfig.projectId)
  .setKey(envConfig.appwriteApiKey);

// Initialize storage
const storage = new sdk.Storage(client);

//Initialize database
const databases = new sdk.Databases(client);

module.exports = { client, storage, databases };
