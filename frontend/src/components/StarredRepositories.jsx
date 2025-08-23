import { useEffect, useState } from "react";
import { fetchStarredRepositoriesOfUser } from "../config/user_config";
import SearchArea from "./SearchArea";
import { Star } from "lucide-react";

function StarredRepositories({ userId, isOwner }) {
  const [repositories, setRepositories] = useState([]);
  const [refreshRepos, setRefreshRepos] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadStarredRepositories = async () => {
      const repos = await fetchStarredRepositoriesOfUser(token, userId);
      if (repos) setRepositories(repos);
    };

    loadStarredRepositories();
  }, [refreshRepos]);

  return repositories.length === 0 ? (
    <div className="text-center text-[#7D8590] mt-12">
      <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>No starred repositories yet</p>
    </div>
  ) : (
    <SearchArea
      queryOption="repository"
      searchArray={repositories}
      isOwner={isOwner}
      refreshRepos={refreshRepos}
      setRefreshRepos={setRefreshRepos}
      Message={false}
    />
  );
}

export default StarredRepositories;
