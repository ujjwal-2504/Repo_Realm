import { useState, useEffect } from "react";
import { useNavigate, useRoutes, useLocation } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./Pages/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepositoryPage from "./Pages/CreateRepositoryPage";

import { useAuth } from "./AuthContext";

// Route definitions with metadata
const ROUTES = [
  { path: "/", component: Dashboard, requiresAuth: true },
  {
    path: "/login",
    component: Login,
    requiresAuth: false,
    redirectIfAuth: "/",
  },
  {
    path: "/signup",
    component: Signup,
    requiresAuth: false,
    redirectIfAuth: "/",
  },
  { path: "/profile/:userId", component: Profile, requiresAuth: false }, // Public access
  { path: "/repo/create", component: CreateRepositoryPage, requiresAuth: true },
  {
    path: "/repo/:repoId",
    component: () => <div>Repo Details</div>,
    requiresAuth: false,
  },
  {
    path: "/settings",
    component: () => <div>Settings</div>,
    requiresAuth: true,
  },
  { path: "/testing", component: () => <div>Yo man</div>, requiresAuth: true },
];

function Routes() {
  const { currentUser, setCurrentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      const userInfo = localStorage.getItem("userInfo");
      const token = localStorage.getItem("token");

      if (userInfo && token && currentUser === null) {
        try {
          setCurrentUser(JSON.parse(userInfo));
        } catch (error) {
          console.error("Error parsing user info:", error);
          localStorage.removeItem("userInfo");
          localStorage.removeItem("token");
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, [currentUser, setCurrentUser]);

  useEffect(() => {
    if (isLoading) return;

    // Find matching route
    const currentRoute = ROUTES.find((route) => {
      if (route.path.includes(":")) {
        // Handle dynamic routes
        const routePattern = route.path.replace(/:[^/]+/g, "[^/]+");
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(location.pathname);
      }
      return route.path === location.pathname;
    });

    if (currentRoute) {
      // Check authentication requirements
      if (currentRoute.requiresAuth && !currentUser) {
        navigate("/login");
      } else if (currentRoute.redirectIfAuth && currentUser) {
        navigate(currentRoute.redirectIfAuth);
      }
    } else {
      // Handle unknown routes
      if (!currentUser) {
        navigate("/login");
      } else {
        navigate("/"); // or 404 page
      }
    }
  }, [currentUser, isLoading, navigate, location.pathname]);

  const LoadingPage = () => (
    <div className="min-h-screen bg-[#010409] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );

  // Generate routes from configuration
  const routeElements = ROUTES.map(({ path, component: Component }) => ({
    path,
    element: isLoading ? <LoadingPage /> : <Component />,
  }));

  // Add catch-all route
  routeElements.push({
    path: "*",
    element: isLoading ? <LoadingPage /> : <div>404 - Page Not Found</div>,
  });

  let elements = useRoutes(routeElements);
  return elements;
}

export default Routes;
