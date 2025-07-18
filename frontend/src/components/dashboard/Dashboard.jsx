import { useState, useEffect } from "react";
import axios from "axios";
import envConfig from "../../config/envConfig";

function Dashboard() {
  const [userRepositories, setUserRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]); // all repositories
  const [searchResults, setSearchResults] = useState([]);
  const [queryOption, setQueryOption] = useState("suggestedRepositories");

  // fetching user's repos from database
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserRepositories = async () => {
      try {
        const response = await axios.get(
          `${envConfig.baseUrl}/repo/user/repos`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.repositories)
          setUserRepositories(response.data.repositories);
      } catch (error) {
        console.error("Error while fetching the repositories: ", error);
      }
    };

    // featching all repositories from database
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await axios.get(`${envConfig.baseUrl}/repo/all`);

        if (response.data && Array.isArray(response.data))
          setSuggestedRepositories(response.data);
      } catch (error) {
        console.error("Error while fetching the repositories: ", error);
      }
    };

    fetchUserRepositories();
    fetchSuggestedRepositories();
  }, []);

  // to search repositories
  useEffect(() => {
    if (searchQuery == "") {
      if (queryOption === "suggestedRepositories")
        setSearchResults(suggestedRepositories);
      else if (queryOption === "userRepositories")
        setSearchResults(userRepositories);
    } else {
      // filter/search in all repositories
      if (queryOption === "suggestedRepositories") {
        const filteredRepos = suggestedRepositories.filter((repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredRepos);
      }
      // filter/search in current user's repositories
      else if (queryOption === "userRepositories") {
        const filteredRepos = userRepositories.filter((repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredRepos);
      }
    }
  }, [searchQuery, userRepositories, suggestedRepositories]);

  useEffect(() => {}, []);

  return (
    <section>
      {/* user's repositories */}
      <aside></aside>

      {/* suggested repositories */}
      <main></main>

      {/* dummy events data  */}
      <aside>
        <h3>Upcomming Events</h3>
        <ul>
          <li>
            <p>Tech Conference - Dec 15</p>
          </li>
          <li>
            <p>Developer Meetup - Jan 24</p>
          </li>
          <li>
            <p>React Summit - Jan 30</p>
          </li>
          <li>
            <p>Hackathon - Feb 05</p>
          </li>
        </ul>
      </aside>
    </section>
  );
}

export default Dashboard;
