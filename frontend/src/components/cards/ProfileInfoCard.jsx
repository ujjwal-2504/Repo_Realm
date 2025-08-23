import { useState, useEffect } from "react";
import {
  MapPin,
  ExternalLink,
  Calendar,
  Users,
  UserPlus,
  Mail,
  Pencil,
} from "lucide-react";
import { useAuth } from "../../AuthContext";
import { toggleFollowUser } from "../../config/user_config";

const ProfileInfoCard = ({
  userData,
  stats,
  refreshUserData,
  setRefreshUserData,
}) => {
  const { currentUser } = useAuth();

  const token = localStorage.getItem("token");

  // Loading state for follow toggle
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  const checkIsFollowing = () => {
    // Check if currentUser's ID is in the myFollowers array of Targeted User
    return (
      userData.myFollowers.length > 0 &&
      userData.myFollowers.some(
        (user) => user._id.toString() === currentUser.userId.toString()
      )
    );
  };

  const [isFollowing, setIsFollowing] = useState(checkIsFollowing());

  // FIXED: Add useEffect to sync isFollowing state with userData changes
  useEffect(() => {
    setIsFollowing(checkIsFollowing());
  }, [userData.myFollowers, currentUser.userId]);

  const handelFollow = async () => {
    // Prevent multiple simultaneous requests
    if (isTogglingFollow) return;

    setIsTogglingFollow(true);

    try {
      const response = await toggleFollowUser(
        token,
        userData._id,
        refreshUserData,
        setRefreshUserData
      );
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsTogglingFollow(false);
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-8">
        {/* Profile Picture and Basic Info */}
        <div className="mb-6">
          <img
            src="https://static.vecteezy.com/system/resources/previews/005/005/788/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"
            alt={`${userData.username}'s avatar`}
            className="w-64 h-64 rounded-full border-4 border-[#30363D] mb-4"
          />
          <h1 className="text-2xl font-bold mb-1">{userData.name}</h1>
          <p className="text-xl text-[#7D8590] mb-3">{userData.username}</p>

          <div className="flex gap-2 mb-4">
            {userData._id === currentUser.userId ? (
              <button className=" flex items-center justify-center gap-2 p-2 bg-[#21262D] border border-[#30363D] rounded-lg hover:border-[#58A6FF] transition-colors w-64">
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => handelFollow()}
                disabled={isTogglingFollow}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors w-64 justify-center ${
                  isFollowing
                    ? "bg-[#21262D] border border-[#30363D] hover:border-[#F85149] hover:bg-[#DA3633]/10 text-[#F0F6FC]"
                    : "bg-[#238636] hover:bg-[#2EA043] text-white"
                } ${isTogglingFollow ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <UserPlus className="w-4 h-4" />
                {isTogglingFollow
                  ? "Loading..."
                  : isFollowing
                  ? "Following"
                  : "Follow"}
              </button>
            )}
          </div>

          {userData.bio && (
            <p className="text-[#F0F6FC] mb-4">{userData.bio}</p>
          )}

          {/* Additional Info */}
          <div className="space-y-2 text-sm text-gray-200">
            {userData.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{userData.email}</span>
              </div>
            )}
            {userData.website && (
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <a
                  href={userData.website}
                  className="text-[#58A6FF] hover:underline"
                >
                  {userData.website}
                </a>
              </div>
            )}
            {/* <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                Joined{" "}
                {new Date(userData.joinedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            </div> */}
          </div>

          {/* Follow Stats */}
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="font-medium text-[#F0F6FC]">
                {stats.followers.length}
              </span>
              <span className="text-[#7D8590]">followers</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-[#F0F6FC]">
                {stats.following.length}
              </span>
              <span className="text-[#7D8590]">following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
