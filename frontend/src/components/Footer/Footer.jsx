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

function Footer() {
  return (
    <footer className="bg-[#141921] border-t border-gray-700 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center space-x-6 text-sm text-gray-400">
          <a href="#" className="hover:text-gray-300">
            Terms
          </a>
          <a href="#" className="hover:text-gray-300">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-300">
            Security
          </a>
          <a href="#" className="hover:text-gray-300">
            Contact Repo Realm
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
