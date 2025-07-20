import React, { useState } from "react";
import { Lock, Globe, Info, Loader2 } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useAuth } from "../AuthContext";
import envConfig from "../config/envConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRepositoryPage({}) {
  // const [selectedLanguages, setSelectedLanguages] = useState([]);
  // const languages = ["JavaScript","Python","Java","C++","TypeScript","Go","Rust","C","Other",];
  // const { userId, name, issues, content, description, visibility, language } =
  //   req.body;
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handelSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const repoVisibility = visibility === "public" ? true : false;

      const res = await axios.post(
        `${envConfig.baseUrl}/repo/create`,
        {
          name,
          description,
          visibility: repoVisibility,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log(res);
      // res.data.repositoryId
      // next step redirect user to repo/repositoryId
      navigate("/");
      resetForm();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  function resetForm() {
    setName("");
    setDescription("");
    setVisibility("public");
  }

  return (
    <div className="min-h-screen bg-[#010409] text-white">
      <Header />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create a new repository
          </h1>
          <p className="text-gray-400">
            A repository contains all project files, including the revision
            history.
          </p>
        </div>

        {/* Create Repository Form */}
        <form onSubmit={handelSubmit} className="space-y-8">
          {/* Owner and Repository Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Owner * {"(username)"}
              </label>
              <div className="flex items-center space-x-3 p-3 border border-gray-600 rounded-lg bg-[#0D1117]">
                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                <span className="text-white">{currentUser.username}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Repository name *
              </label>
              <input
                type="text"
                placeholder="my-awesome-project"
                required
                className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              placeholder="A short description of your repository..."
              rows={3}
              className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Languages */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Primary Languages{" "}
              <span className="text-gray-500">(optional)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {languages.map((language) => (
                <label
                  key={language}
                  className="flex items-center space-x-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    value={language}
                    className="w-4 h-4 text-blue-500 bg-gray-800 border border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {language}
                  </span>
                </label>
              ))}
            </div>
          </div> */}

          {/* Visibility */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              Visibility
              <Info className="w-4 h-4 text-gray-500 ml-2" />
            </h3>

            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 text-blue-500 bg-gray-800 border border-gray-600 focus:ring-blue-500 focus:ring-2 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-white group-hover:text-blue-300 transition-colors">
                      Public
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Anyone on the internet can see this repository. You choose
                    who can commit.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 text-blue-500 bg-gray-800 border border-gray-600 focus:ring-blue-500 focus:ring-2 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-white group-hover:text-blue-300 transition-colors">
                      Private
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    You choose who can see and commit to this repository.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-500">
              You are creating a {visibility} repository in your personal
              account.
            </p>

            {!loading ? (
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                >
                  Create repository
                </button>
              </div>
            ) : (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400 mr-10" />
            )}
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default CreateRepositoryPage;
