import { useState } from "react";
import { Eye, EyeOff, Github } from "lucide-react";
import envConfig from "../../config/envConfig";
import { useAuth } from "../../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import validateCredentials from "../../utils/validateCredentials";
import axios from "axios";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

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
    <div className="min-h-screen bg-gray-900 flex flex-col">
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
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
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
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 pr-10 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-900 px-2 text-gray-400">or</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-750">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-750">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.085.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.125-2.604 7.441-6.194 7.441-1.211 0-2.357-.629-2.74-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"
                  />
                </svg>
                Continue with Microsoft
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
