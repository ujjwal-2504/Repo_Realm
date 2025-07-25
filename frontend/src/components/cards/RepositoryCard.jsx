import React, { useState } from "react";
import {
  Search,
  Star,
  Eye,
  GitFork,
  Calendar,
  Users,
  Code,
  Book,
  Plus,
  Filter,
  Loader2,
} from "lucide-react";
import { toggleStar } from "../../utils/repoUtilities";

function RepositoryCard({
  repo,
  isOwner = false,
  currentUser,
  refreshRepos,
  setRefreshRepos,
}) {
  // Loading state for star toggle
  const [isTogglingStar, setIsTogglingStar] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "bg-yellow-500",
      Python: "bg-blue-500",
      TypeScript: "bg-blue-400",
      CSS: "bg-pink-500",
      HTML: "bg-orange-500",
      Java: "bg-red-500",
      "C++": "bg-purple-500",
      Docker: "bg-blue-600",
      Go: "bg-cyan-500",
      Vue: "bg-green-500",
      "Jupyter Notebook": "bg-orange-400",
    };
    return colors[language] || "bg-gray-500";
  };

  const isStarred = () => {
    // Check if currentUser's ID is in the stars array
    return (
      repo.stars && repo.stars.some((starId) => starId === currentUser.userId)
    );
  };

  const handleStarToggle = async () => {
    // Prevent multiple simultaneous requests
    if (isTogglingStar) return;

    setIsTogglingStar(true);

    try {
      await toggleStar(repo._id, refreshRepos, setRefreshRepos);
    } catch (error) {
      console.error("Error toggling star:", error);
      // You could add a toast notification here for user feedback
    } finally {
      setIsTogglingStar(false);
    }
  };

  return (
    <div className="bg-[#141921] border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Book className="w-4 h-4 text-blue-400" />
          <h3 className="font-medium text-blue-400 hover:text-blue-300 cursor-pointer">
            {isOwner ? repo.name : `${repo.owner?.username}/${repo.name}`}
          </h3>
          {repo.visibility ? (
            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-600">
              Public
            </span>
          ) : (
            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-600">
              Private
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1 text-gray-400">
          <button
            onClick={handleStarToggle}
            disabled={isTogglingStar}
            className={`hover:text-yellow-400 transition-colors flex items-center justify-center w-6 h-6 ${
              isTogglingStar
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
            title={
              isTogglingStar
                ? "Processing..."
                : isStarred()
                ? "Unstar repository"
                : "Star repository"
            }
          >
            {isTogglingStar ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            ) : isStarred() ? (
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            ) : (
              <Star className="w-4 h-4 hover:text-yellow-400" />
            )}
          </button>
          <span className="text-sm">{repo.stars ? repo.stars.length : 0}</span>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-3">
        {repo.description || "No description available"}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {repo.language && repo.language.length > 0 && (
            <div className="flex items-center space-x-1">
              <div
                className={`w-3 h-3 rounded-full ${getLanguageColor(
                  repo.language[0]
                )}`}
              ></div>
              <span className="text-sm text-gray-300">{repo.language[0]}</span>
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500">
          Updated {formatDate(repo.updatedAt)}
        </span>
      </div>
    </div>
  );
}

export default RepositoryCard;
