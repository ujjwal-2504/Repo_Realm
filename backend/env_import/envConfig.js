require("dotenv").config();

const envConfig = {
  appwriteEndpointUrl: String(process.env.APPWRITE_ENDPOINT_URL),
  projectId: String(process.env.PROJECT_ID),
  bucketId: String(process.env.BUCKET_ID),
  appwriteApiKey: String(process.env.APPWRITE_API_KEY),
  appwriteDatabaseId: String(process.env.APPWRITE_DATABASE_ID),
  appwriteCollectionId: String(process.env.APPWRITE_COLLECTION_ID),
  mongoDbUri: String(process.env.MONGODB_URI),
  port: String(process.env.PORT),
};

module.exports = { envConfig };
