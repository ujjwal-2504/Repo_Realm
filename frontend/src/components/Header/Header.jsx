import React, { useState } from "react";
import { CircleUserRound, Github, Star, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

import LogoutConfirmationDialog from "../auth/LogoutConfirmationDialog";
import { useLogout } from "../../utils/useLogout";

function Header({ path }) {
  const { currentUser } = useAuth();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true); // Open the confirmation dialog
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    logout();

    navigate("/login");
  };

  return currentUser === null ? (
    <header className="bg-[#0d1117] border-b border-gray-700 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/">
          <div className="flex items-center space-x-4">
            <Github className="w-8 h-8 text-white" />
            <span className="ml-4 text-xl font-semibold text-white">
              Repo Realm
            </span>
          </div>
        </Link>
      </div>
    </header>
  ) : (
    <div>
      <header className="bg-[#0d1117] border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between px-7">
          <Link to="/">
            <div className="flex items-center">
              <Github className="w-8 h-8 text-white" />
              <span className="ml-4 text-xl font-semibold text-white">
                Repo Realm
              </span>
            </div>
          </Link>

          <div className="flex gap-20 font-semibold">
            <Link
              to="/profile/self"
              className="flex items-center gap-0.5 hover:underline text-gray-400 hover:text-white"
            >
              <CircleUserRound className="" /> Profile
            </Link>

            <Link
              to="/profile/self?tab=stars"
              className="flex items-center gap-0.5 hover:underline text-gray-400 hover:text-white"
            >
              <Star className="text-amber-400 hover:fill-current hover:text-amber-300" />{" "}
              Your Stars
            </Link>

            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-0.5 hover:underline  cursor-pointer text-gray-400 hover:text-red-400"
            >
              <LogOut className="" />
              Logout
            </button>

            <LogoutConfirmationDialog
              open={logoutDialogOpen}
              onClose={handleLogoutCancel}
              onConfirm={handleLogoutConfirm}
            />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
