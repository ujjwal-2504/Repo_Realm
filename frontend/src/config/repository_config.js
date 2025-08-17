import envConfig from "./envConfig";
import axios from "axios";

const fetchUserRepositories = async (token) => {
  try {
    const response = await axios.get(`${envConfig.baseUrl}/repo/user/repos`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.repositories) return response.data.repositories;
  } catch (error) {
    console.error("Error while fetching the repositories: ", error);
    return [];
  }
};

// featching all repositories from database
const fetchSuggestedRepositories = async () => {
  try {
    const response = await axios.get(`${envConfig.baseUrl}/repo/all`);

    if (response.data && Array.isArray(response.data)) return response.data;
  } catch (error) {
    console.error("Error while fetching the repositories: ", error);
    return [];
  }
};

// featching repositories by userId
const fetchRepositoryByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${envConfig.baseUrl}/repo/user/${userId}`
    );

    console.log(response);

    // if (response.data && Array.isArray(response.data)) return response.data;
    return [];
  } catch (error) {
    console.error("Error while fetching the repositories: ", error);
    return [];
  }
};

const toggleStar = async (repoId, refreshRepos, setRefreshRepos) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No authentication token found");
    return;
  }

  try {
    const response = await axios.post(
      `${envConfig.baseUrl}/repo/star/${repoId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data) {
      // Trigger refresh to update the UI
      setRefreshRepos(!refreshRepos);
    }
  } catch (error) {
    console.error(
      "Error while toggling star on repository:",
      error.response?.data || error.message
    );

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.error("Authentication failed - please log in again");
    } else if (error.response?.status === 404) {
      console.error("Repository not found");
    } else if (error.response?.status === 403) {
      console.error("Access denied to this repository");
    }

    throw error; // Re-throw so calling component can handle it
  }
};

export {
  fetchSuggestedRepositories,
  fetchUserRepositories,
  fetchRepositoryByUserId,
  toggleStar,
};
