import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  ExternalLink,
  Calendar,
  Users,
  Star,
  GitFork,
  Book,
  Package,
  Settings,
  UserPlus,
  Mail,
} from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import ProfileInfoCard from "../components/cards/ProfileInfoCard";
import { fetchUserProfile } from "../config/user_config";
import SearchArea from "../components/SearchArea";
import {
  fetchUserRepositories,
  fetchRepositoryByUserId,
} from "../config/repository_config";
import { useNavigate } from "react-router-dom";
import StarredRepositories from "../components/StarredRepositories";
import UserCard from "../components/cards/UserCard";
import HeatMapProfile from "../components/HeatMap";

// default data
const defaultUserData = {
  _id: "000",
  username: "no-username",
  email: "no-email",
  repositories: [],
  followedUsers: [],
  starredRepos: [],
  name: "User000",
  myFollowers: [],
};

function Profile() {
  const [userData, setUserData] = useState(defaultUserData);
  const [activeTab, setActiveTab] = useState("contributions");
  const [repositories, setRepositories] = useState([]);
  const [refreshRepos, setRefreshRepos] = useState(true);
  const [refreshUserData, setRefreshUserData] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const { userId } = useParams();
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser.userId === userId) navigate("/profile/self");

    const currentUrlTab = new URLSearchParams(window.location.search).get(
      "tab"
    );

    if (
      ["followers", "following", "stars", "repositories"].includes(
        currentUrlTab
      )
    ) {
      setActiveTab(currentUrlTab);
    } else {
      setActiveTab("contributions");
    }
  }, [userId, currentUser.userId, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadUserProfile = async () => {
      const userProfile = await fetchUserProfile(token, userId);
      if (userProfile) {
        setUserData(userProfile);
      }
    };

    loadUserProfile();
  }, [refreshUserData, userId]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadUserRepositories = async () => {
      let userRepos;

      if (userId === "self") {
        userRepos = await fetchUserRepositories(token);
        setIsOwner(true);
      } else {
        userRepos = await fetchRepositoryByUserId(userId);
      }

      setRepositories(userRepos || []);
    };

    loadUserRepositories();
  }, [refreshRepos, userId]);

  // FIXED: Use useMemo to derive stats instead of separate state
  const stats = useMemo(
    () => ({
      repositories: repositories.length,
      followers: userData.myFollowers ? userData.myFollowers : [],
      following: userData.followedUsers ? userData.followedUsers : [],
    }),
    [repositories.length, userData.myFollowers, userData.followedUsers]
  );

  return (
    <div className="min-h-screen bg-[#010409] text-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Info */}
          <ProfileInfoCard
            userData={userData}
            stats={stats} // FIXED: Pass stats object directly
            refreshUserData={refreshUserData}
            setRefreshUserData={setRefreshUserData}
          />

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="border-b border-[#30363D] mb-6">
              <nav className="flex gap-8">
                <button
                  onClick={() => setActiveTab("contributions")}
                  className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === "contributions"
                      ? "border-[#F78166] text-[#F0F6FC]"
                      : "border-transparent text-[#7D8590] hover:text-[#F0F6FC]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Book className="w-4 h-4" />
                    Contributions
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("repositories")}
                  className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === "repositories"
                      ? "border-[#F78166] text-[#F0F6FC]"
                      : "border-transparent text-[#7D8590] hover:text-[#F0F6FC]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Book className="w-4 h-4" />
                    Repositories
                    <span className="bg-[#30363D] text-xs px-2 py-1 rounded-full">
                      {stats.repositories}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("followers")}
                  className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === "followers"
                      ? "border-[#F78166] text-[#F0F6FC]"
                      : "border-transparent text-[#7D8590] hover:text-[#F0F6FC]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Followers
                    <span className="bg-[#30363D] text-xs px-2 py-1 rounded-full">
                      {stats.followers.length}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === "following"
                      ? "border-[#F78166] text-[#F0F6FC]"
                      : "border-transparent text-[#7D8590] hover:text-[#F0F6FC]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Following
                    <span className="bg-[#30363D] text-xs px-2 py-1 rounded-full">
                      {stats.following.length}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("stars")}
                  className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === "stars"
                      ? "border-[#F78166] text-[#F0F6FC]"
                      : "border-transparent text-[#7D8590] hover:text-[#F0F6FC]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Stars
                  </div>
                </button>
              </nav>
            </div>

            {/* Content based on active tab */}
            <div className="mt-6">
              {activeTab === "contributions" && (
                <HeatMapProfile
                  userId={userId === "self" ? currentUser.userId : userId}
                />
              )}

              {activeTab === "repositories" && (
                <SearchArea
                  queryOption="repository"
                  searchArray={repositories}
                  isOwner={isOwner}
                  refreshRepos={refreshRepos}
                  setRefreshRepos={setRefreshRepos}
                  Message={false}
                />
              )}

              {activeTab === "followers" && (
                <div className="text-center text-[#7D8590] mt-12">
                  {stats.followers.length === 0 ? (
                    <>
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No Followers Yet</p>
                    </>
                  ) : (
                    <SearchArea
                      queryOption="user"
                      searchArray={stats.followers}
                    />
                  )}
                </div>
              )}

              {activeTab === "following" && (
                <div className="text-center text-[#7D8590] mt-12">
                  {stats.following.length === 0 ? (
                    <>
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Zero Following</p>
                    </>
                  ) : (
                    <SearchArea
                      queryOption="user"
                      searchArray={stats.following}
                    />
                  )}
                </div>
              )}

              {activeTab === "stars" && (
                <StarredRepositories
                  userId={userId === "self" ? currentUser.userId : userId}
                  isOwner={isOwner}
                  refreshRepos={refreshRepos}
                  setRefreshRepos={setRefreshRepos}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
