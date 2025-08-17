import React from "react";
import {
  MapPin,
  ExternalLink,
  Calendar,
  Users,
  UserPlus,
  Mail,
} from "lucide-react";

const ProfileInfoCard = ({ userData, stats, isFollowing, setIsFollowing }) => {
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
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? "bg-[#21262D] border border-[#30363D] hover:border-[#F85149] hover:bg-[#DA3633]/10 text-[#F0F6FC]"
                  : "bg-[#238636] hover:bg-[#2EA043] text-white"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              {isFollowing ? "Following" : "Follow"}
            </button>
            <button className="p-2 bg-[#21262D] border border-[#30363D] rounded-lg hover:border-[#58A6FF] transition-colors">
              <Mail className="w-4 h-4" />
            </button>
          </div>

          {userData.bio && (
            <p className="text-[#F0F6FC] mb-4">{userData.bio}</p>
          )}

          {/* Additional Info */}
          <div className="space-y-2 text-sm text-[#7D8590]">
            {userData.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{userData.location}</span>
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
                {stats.followers}
              </span>
              <span className="text-[#7D8590]">followers</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-[#F0F6FC]">
                {stats.following}
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
