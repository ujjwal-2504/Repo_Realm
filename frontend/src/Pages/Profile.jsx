import React, { useState, useEffect } from "react";
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
import RepositoryCard from "../components/cards/RepositoryCard";
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
  // bio: "Passionate developer building amazing things with code",
  // location: "San Francisco, CA",
  // website: "https://user001.dev",
  // joinedDate: "2023-01-15",
  // avatarUrl:
  //   "https://static.vecteezy.com/system/resources/previews/005/005/788/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg",
};

// Mock contribution data for the activity graph
// const generateContributionData = () => {
//   const data = [];
//   const today = new Date();
//   for (let i = 364; i >= 0; i--) {
//     const date = new Date(today);
//     date.setDate(date.getDate() - i);
//     data.push({
//       date: date.toISOString().split("T")[0],
//       count: Math.floor(Math.random() * 5),
//     });
//   }
//   return data;
// };

// const ContributionGraph = ({ data }) => {
//   const getColor = (count) => {
//     if (count === 0) return "#0D1117";
//     if (count === 1) return "#0E4429";
//     if (count === 2) return "#006D32";
//     if (count === 3) return "#26A641";
//     return "#39D353";
//   };

//   const weeks = [];
//   for (let i = 0; i < data.length; i += 7) {
//     weeks.push(data.slice(i, i + 7));
//   }

//   return (
//     <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4">
//       <h3 className="text-sm font-medium mb-3 text-[#F0F6FC]">
//         Contribution Activity
//       </h3>
//       <div className="flex gap-1 overflow-x-auto">
//         {weeks.map((week, weekIndex) => (
//           <div key={weekIndex} className="flex flex-col gap-1">
//             {week.map((day, dayIndex) => (
//               <div
//                 key={dayIndex}
//                 className="w-2.5 h-2.5 rounded-sm"
//                 style={{ backgroundColor: getColor(day.count) }}
//                 title={`${day.count} contributions on ${day.date}`}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//       <div className="flex items-center justify-between mt-3 text-xs text-[#7D8590]">
//         <span>Less</span>
//         <div className="flex gap-1">
//           <div className="w-2.5 h-2.5 rounded-sm bg-[#0D1117]"></div>
//           <div className="w-2.5 h-2.5 rounded-sm bg-[#0E4429]"></div>
//           <div className="w-2.5 h-2.5 rounded-sm bg-[#006D32]"></div>
//           <div className="w-2.5 h-2.5 rounded-sm bg-[#26A641]"></div>
//           <div className="w-2.5 h-2.5 rounded-sm bg-[#39D353]"></div>
//         </div>
//         <span>More</span>
//       </div>
//     </div>
//   );
// };

function Profile() {
  const [userData, setUserData] = useState(defaultUserData);
  const [contributionData, setContributionData] = useState([]);
  const [activeTab, setActiveTab] = useState("repositories");
  const [isFollowing, setIsFollowing] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [refreshRepos, setRefreshRepos] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const { userId } = useParams();
  const { currentUser } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadUserProfile = async () => {
      const userProfile = await fetchUserProfile(token, userId);
      if (userProfile) setUserData(userProfile);
    };

    loadUserProfile();
    // setContributionData(generateContributionData());
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadUserRepositories = async () => {
      let userRepos;

      if (userId === "self") {
        userRepos = await fetchUserRepositories(token);
        setIsOwner(true);
      } else userRepos = await fetchRepositoryByUserId(userId);

      setRepositories(userRepos);
    };

    loadUserRepositories();
  }, [refreshRepos]);

  const mockRepositories = [
    {
      name: "awesome-project",
      description: "A really awesome project built with React and Node.js",
      language: "JavaScript",
      stars: 42,
      forks: 12,
      visibility: "Public",
      updatedAt: "2 days ago",
    },
    {
      name: "machine-learning-toolkit",
      description: "Collection of ML algorithms and utilities",
      language: "Python",
      stars: 128,
      forks: 31,
      visibility: "Public",
      updatedAt: "1 week ago",
    },
    {
      name: "portfolio-website",
      description: "Personal portfolio built with Next.js and Tailwind CSS",
      language: "TypeScript",
      stars: 15,
      forks: 3,
      visibility: "Public",
      updatedAt: "3 days ago",
    },
  ];

  const stats = {
    repositories: repositories.length,
    followers: userData.myFollowers.length,
    following: userData.followedUsers.length,
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Info */}
          <ProfileInfoCard
            userData={userData}
            stats={stats}
            isFollowing={isFollowing}
            setIsFollowing={setIsFollowing}
          />

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="border-b border-[#30363D] mb-6">
              <nav className="flex gap-8">
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
                    <Package className="w-4 h-4" />
                    Followers
                    <span className="bg-[#30363D] text-xs px-2 py-1 rounded-full">
                      0
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
                    <Package className="w-4 h-4" />
                    Following
                    <span className="bg-[#30363D] text-xs px-2 py-1 rounded-full">
                      0
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

            {/* Contribution Graph */}
            {/* <ContributionGraph data={contributionData} /> */}

            {/* Content based on active tab */}
            <div className="mt-6">
              {activeTab === "repositories" && (
                // <div>
                //   <div className="flex items-center justify-between mb-4">
                //     <h2 className="text-xl font-semibold">Repositories</h2>
                //   </div>
                //   {repositories.length > 0 ? (
                //     <div className="grid gap-4">
                //       {repositories.map((repo) => (
                //         <RepositoryCard
                //           key={repo._id}
                //           repo={repo}
                //           isOwner={isOwner}
                //           currentUser={currentUser}
                //           refreshRepos={refreshRepos}
                //           setRefreshRepos={setRefreshRepos}
                //         />
                //       ))}
                //     </div>
                //   ) : (
                //     <div className="text-center py-12 text-[#7D8590]">
                //       <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
                //       <p>No repositories yet</p>
                //     </div>
                //   )}
                // </div>
                <SearchArea
                  queryOption="repository"
                  searchArray={repositories}
                  isOwner={isOwner}
                  refreshRepos={refreshRepos}
                  setRefreshRepos={setRefreshRepos}
                />
              )}

              {activeTab === "followers" && (
                <div className="text-center py-12 text-[#7D8590]">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No followers yet</p>
                </div>
              )}

              {activeTab === "following" && (
                <div className="text-center py-12 text-[#7D8590]">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No following</p>
                </div>
              )}

              {activeTab === "stars" && (
                <div className="text-center py-12 text-[#7D8590]">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No starred repositories yet</p>
                </div>
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
