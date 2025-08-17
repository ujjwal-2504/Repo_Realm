import axios from "axios";
import envConfig from "./envConfig";

const fetchUserProfile = async (token, userId) => {
  try {
    const response = await axios.get(
      `${envConfig.baseUrl}/userProfile/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data.user;
  } catch (error) {
    console.error("Error while fetching user profile: ", error);
    return [];
  }
};

export { fetchUserProfile };
