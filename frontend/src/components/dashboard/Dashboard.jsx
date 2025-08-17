import { useState, useEffect } from "react";
import { Search, Calendar, Users, Code, Book, Plus } from "lucide-react";
import RepositoryCard from "../cards/RepositoryCard";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {
  fetchSuggestedRepositories,
  fetchUserRepositories,
} from "../../config/repository_config";

function Dashboard() {
  const { currentUser } = useAuth();
  const [userRepositories, setUserRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [queryOption, setQueryOption] = useState("suggestedRepositories");
  const [refreshRepos, setRefreshRepos] = useState(true);
  // const [loading, setLoading] = useState(true);

  // fetching user's repos from database
  useEffect(() => {
    const loadRepositories = async () => {
      const token = localStorage.getItem("token");

      // Fetch user's repositories
      const userRepos = await fetchUserRepositories(token);
      if (userRepos) setUserRepositories(userRepos);

      // Fetch suggested repositories (all repositories)
      const suggestedRepos = await fetchSuggestedRepositories();
      if (suggestedRepos) setSuggestedRepositories(suggestedRepos);
    };

    loadRepositories();
  }, [refreshRepos]);

  // To search repositories
  useEffect(() => {
    if (searchQuery === "") {
      if (queryOption === "suggestedRepositories")
        setSearchResults(suggestedRepositories);
      else if (queryOption === "userRepositories")
        setSearchResults(userRepositories);
    } else {
      // Filter/search in all repositories
      if (queryOption === "suggestedRepositories") {
        const filteredRepos = suggestedRepositories.filter(
          (repo) =>
            repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredRepos);
      }
      // Filter/search in current user's repositories
      else if (queryOption === "userRepositories") {
        const filteredRepos = userRepositories.filter(
          (repo) =>
            repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredRepos);
      }
    }
  }, [searchQuery, userRepositories, suggestedRepositories, queryOption]);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-950 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
  //         <p className="mt-4 text-gray-400">Loading your dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#010409] text-white">
      <Header />
      <div className="flex h-screen">
        {/* Column 1: User's Repositories */}
        <div className=" dashboard-column w-1/4 border-r border-gray-800 p-6 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Your Repositories
              </h2>
              <Link
                to="/repo/create"
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </Link>
            </div>

            <div className="space-y-3">
              {userRepositories.length > 0 ? (
                userRepositories.map((repo) => (
                  <RepositoryCard
                    key={repo._id}
                    repo={repo}
                    isOwner={true}
                    currentUser={currentUser}
                    refreshRepos={refreshRepos}
                    setRefreshRepos={setRefreshRepos}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No repositories yet</p>
                  <p className="text-sm mt-2">
                    Create your first repository to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Suggested Repositories with Search */}
        <div className="dashboard-column w-1/2 border-r border-gray-800 p-6 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Explore Repositories
              </h2>
            </div>

            {/* Search and Filter Controls */}
            <div className="space-y-3 mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setQueryOption("suggestedRepositories")}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    queryOption === "suggestedRepositories"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  All Repositories
                </button>
                <button
                  onClick={() => setQueryOption("userRepositories")}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    queryOption === "userRepositories"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Your Repositories
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${
                    queryOption === "suggestedRepositories" ? "all" : "your"
                  } repositories...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="space-y-3">
              {searchResults.length > 0 ? (
                searchResults.map((repo) => (
                  <RepositoryCard
                    key={repo._id}
                    repo={repo}
                    isOwner={queryOption === "userRepositories"}
                    currentUser={currentUser}
                    refreshRepos={refreshRepos}
                    setRefreshRepos={setRefreshRepos}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No repositories found</p>
                  <p className="text-sm mt-2">
                    Try adjusting your search query
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: News Updates */}
        <div className=" dashboard-column w-1/4 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                <div className="bg-[#0D1117] border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-white">Tech Conference</p>
                      <p className="text-sm text-gray-400">Dec 15, 2025</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0D1117] border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-white">Developer Meetup</p>
                      <p className="text-sm text-gray-400">Jan 24, 2026</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0D1117] border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-white">React Summit</p>
                      <p className="text-sm text-gray-400">Jan 30, 2026</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0D1117] border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-white">Hackathon</p>
                      <p className="text-sm text-gray-400">Feb 05, 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub News */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Developer News
              </h3>
              <div className="space-y-3">
                <div className="bg-[#0D1117] border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="font-medium text-white text-sm">
                      New GitHub Features
                    </p>
                    <p className="text-xs text-gray-400">
                      Enhanced code review tools now available
                    </p>
                    <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                  </div>
                </div>
                <div className="bg-[#0D1117] border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                  <div className="border-l-4 border-green-500 pl-3">
                    <p className="font-medium text-white text-sm">
                      React 19 Released
                    </p>
                    <p className="text-xs text-gray-400">
                      Major performance improvements and new features
                    </p>
                    <p className="text-xs text-gray-500 mt-2">5 hours ago</p>
                  </div>
                </div>
                <div className="bg-[#0D1117] border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                  <div className="border-l-4 border-purple-500 pl-3">
                    <p className="font-medium text-white text-sm">
                      AI Code Assistant
                    </p>
                    <p className="text-xs text-gray-400">
                      New intelligent code suggestions available
                    </p>
                    <p className="text-xs text-gray-500 mt-2">1 day ago</p>
                  </div>
                </div>
                <div className="bg-[#0D1117] border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                  <div className="border-l-4 border-orange-500 pl-3">
                    <p className="font-medium text-white text-sm">
                      Security Updates
                    </p>
                    <p className="text-xs text-gray-400">
                      Important security patches released
                    </p>
                    <p className="text-xs text-gray-500 mt-2">2 days ago</p>
                  </div>
                </div>
                <div className="bg-[#0D1117] border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                  <div className="border-l-4 border-red-500 pl-3">
                    <p className="font-medium text-white text-sm">
                      Breaking Changes
                    </p>
                    <p className="text-xs text-gray-400">
                      Important API updates for developers
                    </p>
                    <p className="text-xs text-gray-500 mt-2">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
