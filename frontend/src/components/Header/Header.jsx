import React from "react";
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
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-[#0d1117] border-b border-gray-700 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/">
          <div className="flex items-center space-x-4">
            <Github className="w-8 h-8 text-white" />
            <span className="text-xl font-semibold text-white">Repo Realm</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
