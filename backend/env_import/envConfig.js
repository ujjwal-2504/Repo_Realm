require("dotenv").config();

const envConfig = {
  appwriteEndpointUrl: String(process.env.APPWRITE_ENDPOINT_URL),
  projectId: String(process.env.PROJECT_ID),
  bucketId: String(process.env.BUCKET_ID),
  appwriteApiKey: String(process.env.APPWRITE_API_KEY),
};

module.exports = { envConfig };
