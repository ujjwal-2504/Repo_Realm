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

const fetchStarredRepositoriesOfUser = async (token, userId) => {
  try {
    const response = await axios.get(
      `${envConfig.baseUrl}/userStarredRepositories/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error while fetching star repositories of user: ",
      userId,
      " : ",
      error
    );
    return [];
  }
};

const toggleFollowUser = async (
  token,
  userId,
  refreshUserData,
  setRefreshUserData
) => {
  try {
    const response = await axios.patch(
      `${envConfig.baseUrl}/toggleFollowUser/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setRefreshUserData(!refreshUserData);
  } catch (error) {
    console.error(
      "Error while toggling the follow user: ",
      userId,
      " : ",
      error
    );
    return [];
  }
};

const getActivityByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${envConfig.baseUrl}/user/activity/${userId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error while fetching the activity of the user: ",
      userId,
      " : ",
      error
    );
  }
};

export {
  fetchUserProfile,
  fetchStarredRepositoriesOfUser,
  toggleFollowUser,
  getActivityByUserId,
};
