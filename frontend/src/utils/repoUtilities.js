import axios from "axios";
import envConfig from "../config/envConfig";

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
      // You might want to redirect to login or refresh token here
    } else if (error.response?.status === 404) {
      console.error("Repository not found");
    } else if (error.response?.status === 403) {
      console.error("Access denied to this repository");
    }

    throw error; // Re-throw so calling component can handle it
  }
};

export { toggleStar };
