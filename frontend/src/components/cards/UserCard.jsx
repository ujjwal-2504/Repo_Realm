import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";

function UserCard({ user }) {
  const { currentUser } = useAuth();
  const [redirectId, setRedirectId] = useState(user._id);

  if (redirectId === currentUser.userId) setRedirectId("self");

  return (
    <Link to={`/profile/${redirectId}?tab=contributions`}>
      <div className="p-4 bg-[#0D1117] border border-gray-700 rounded-md cursor-pointer hover:bg-gray-800">
        <p className="text-white">{user.name}</p>
        <p className="text-gray-400 text-sm">@{user.username}</p>
      </div>
    </Link>
  );
}

export default UserCard;
