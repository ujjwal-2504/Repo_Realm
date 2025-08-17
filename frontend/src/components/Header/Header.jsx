import React from "react";
import { CircleUserRound, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import ProfileMenu from "./ProfileMenu";

function Header({ path }) {
  const { currentUser } = useAuth();

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

          <ProfileMenu />
        </div>
      </header>
    </div>
  );
}

export default Header;
