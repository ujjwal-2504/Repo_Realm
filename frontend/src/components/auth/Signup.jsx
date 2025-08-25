import { useState } from "react";
import { Eye, EyeOff, Github } from "lucide-react";
import envConfig from "../../config/envConfig";
import { useAuth } from "../../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import validateCredentials from "../../utils/validateCredentials";
import axios from "axios";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ContinueWithOptions from "./ContinueWithOptions";

export default function Signup() {
  const { setCurrentUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handelSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!validateCredentials.validatePassword(password)) {
        alert("Invalid password format");
        setPassword("");
        setLoading(false);
        return;
      }

      const res = await axios.post(`${envConfig.baseUrl}/signup`, {
        email: email,
        name: name,
        username: username,
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          name: res.data.name || "name not found",
          username: res.data.username || "username not found",
          userId: res.data.userId,
        })
      );

      setCurrentUser(JSON.parse(localStorage.getItem("userInfo")));
      setLoading(false);

      navigate("/");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">
              Welcome to Repo Realm!
            </h1>
            <p className="text-gray-400 text-sm">Let's begin the adventure</p>
          </div>

          {/* Signup Form */}
          <div className="bg-[#0D1117] rounded-lg border border-gray-700 p-6 shadow-sm">
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Your name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-3 py-2 pr-10 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Make sure it's at least 8 characters including a number and a
                  lowercase and uppercase letter and a special character.
                </p>
              </div>

              {/* Human Verification */}
              {/* <div className="bg-gray-750 border border-gray-600 rounded-md p-4">
                <p className="text-sm text-gray-300 mb-3">
                  Verify your account
                </p>
                <div className="bg-gray-700 border border-gray-600 rounded-md p-4 text-center">
                  <div className="w-6 h-6 border-2 border-gray-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-400">
                    Please complete the captcha to verify you're human
                  </p>
                </div>
              </div> */}

              {/* Terms */}
              <div className="text-xs text-gray-400 leading-relaxed">
                By creating an account, you agree to the{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Terms of Service
                </a>
                . For more information about Repo Realm's privacy practices, see
                the{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Repo Realm Privacy Statement
                </a>
                . We'll occasionally send you account-related emails.
              </div>

              {/* Submit Button */}
              <button
                onClick={handelSignup}
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                {loading ? "Loading..." : "Create account"}
              </button>

              <div className="flex items-center justify-center space-x-4 ">
                <span className="text-sm text-gray-300">
                  Already have an account?
                </span>
                <Link
                  to={"/login"}
                  className=" text-blue-400 hover:text-blue-300 font-medium text-sm"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <ContinueWithOptions />
        </div>
      </main>

      <Footer />
    </div>
  );
}
