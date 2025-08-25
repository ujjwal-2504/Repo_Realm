import { useEffect, useState } from "react";
import { Eye, EyeOff, Github } from "lucide-react";
import envConfig from "../../config/envConfig";
import { useAuth } from "../../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import validateCredentials from "../../utils/validateCredentials";
import axios from "axios";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import ContinueWithOptions from "./ContinueWithOptions";

export default function Login() {
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setCurrentUser(null);
  }, []);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handelLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setUsernameOrEmail(`${usernameOrEmail}`.trim());
      setPassword(`${password}`.trim());

      if (!validateCredentials.validatePassword(password)) {
        alert("Invalid username or email or password");
        setUsernameOrEmail("");
        setPassword("");
        setLoading(false);
        return;
      }
      const res = await axios.post(`${envConfig.baseUrl}/login`, {
        usernameOrEmail: usernameOrEmail,
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
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) setCurrentUser(JSON.parse(userInfo));
      setLoading(false);
      navigate("/");
      // navigate("/testing");
    } catch (error) {
      console.error(error.message);
      console.log("Error during Login: ", error.response.data);
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
              Login to Repo Realm!
            </h1>
          </div>

          {/* Login Form */}
          <div className="bg-[#0D1117] rounded-lg border border-gray-700 p-6 shadow-sm">
            <div className="space-y-4">
              {/* Username or Email */}
              <div>
                <label
                  htmlFor="usernameOrEmail"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Username or email address
                </label>
                <input
                  type="text"
                  id="usernameOrEmail"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username or email"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <Link
                    to="#"
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-3 py-2 pr-10 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
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
              </div>

              {/* Submit Button */}
              <button
                onClick={handelLogin}
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                {loading ? "Loading..." : "Login"}
              </button>

              <div className="flex items-center justify-center space-x-4 ">
                <span className="text-sm text-gray-300">
                  Don't have an account?
                </span>
                <Link
                  to={"/signup"}
                  className=" text-blue-400 hover:text-blue-300 font-medium text-sm"
                >
                  SignUp
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
