import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Search, Calendar, Users, Code, Book, Plus } from "lucide-react";
import RepositoryCard from "./cards/RepositoryCard";

function SearchArea({
  queryOption,
  searchArray,
  isOwner = false,
  refreshRepos,
  setRefreshRepos,
  Message = "Explore Repositories",
}) {
  const { currentUser } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholder, setPlaceHolder] = useState("Search...");

  // Initialize search results when component mounts or searchArray changes
  useEffect(() => {
    setSearchResults(searchArray || []);
  }, [searchArray]);

  // To search repositories
  useEffect(() => {
    if (!searchArray) return;

    if (searchQuery === "") {
      setSearchResults(searchArray);
    } else {
      // Filter/search
      if (queryOption === "repository") {
        const filteredRepos = searchArray.filter(
          (repo) =>
            repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredRepos);
      } else if (queryOption === "user") {
        const filteredUsers = searchArray.filter(
          (user) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username?.toLowerCase().includes(searchQuery.toLowerCase()) // Fixed: was 'repo.username'
        );
        setSearchResults(filteredUsers);
      }
    }
  }, [searchQuery, searchArray, queryOption]);

  // Update placeholder based on queryOption
  useEffect(() => {
    if (queryOption === "repository") {
      setPlaceHolder("Search repositories...");
    } else if (queryOption === "user") {
      setPlaceHolder("Search users...");
    } else {
      setPlaceHolder("Search...");
    }
  }, [queryOption]);

  const renderSearchResults = () => {
    if (searchResults.length > 0 && queryOption === "repository") {
      return searchResults.map((repo) => (
        <RepositoryCard
          key={repo._id}
          repo={repo}
          isOwner={isOwner}
          currentUser={currentUser}
          refreshRepos={refreshRepos}
          setRefreshRepos={setRefreshRepos}
        />
      ));
    } else if (searchResults.length > 0 && queryOption === "user") {
      return searchResults.map((user) => (
        <div
          key={user._id}
          className="p-4 bg-[#0D1117] border border-gray-700 rounded-md"
        >
          <p className="text-white">{user.name}</p>
          <p className="text-gray-400 text-sm">@{user.username}</p>
        </div>
      ));
    } else {
      return (
        <div className="text-center py-4 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">{`No ${queryOption}s found`}</p>
          {searchArray.length != 0 && (
            <p className="text-sm mt-2">Try adjusting your search query</p>
          )}
        </div>
      );
    }
  };

  return (
    <section>
      <div className="dashboard-column w-full px-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Search className="w-5 h-5 mr-2" />
              {Message}
            </h2>
          </div>

          {/* Search and Filter Controls */}
          <div className="space-y-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={placeholder}
                disabled={searchArray.length === 0}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400`}
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-3">{renderSearchResults()}</div>
        </div>
      </div>
    </section>
  );
}

export default SearchArea;
