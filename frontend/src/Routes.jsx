import { useState, useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./Pages/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepositoryPage from "./Pages/CreateRepositoryPage";

import { useAuth } from "./AuthContext";

function Routes() {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");

    if (currentUser === null) {
      setCurrentUser(JSON.parse(userInfo));
    }
    // const userIdFromStorage = currentUser.userId;

    if (
      currentUser === null &&
      !["/login", "/signup"].includes(window.location.pathname)
    ) {
      navigate("/login");
    }

    if (
      currentUser &&
      ["/login", "/signup"].includes(window.location.pathname)
    ) {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  let elements = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile/:userId",
      element: <Profile />,
    },
    {
      path: "/repo/create/",
      element: <CreateRepositoryPage />,
    },
    {
      path: "/testing",
      element: <div>Yo man</div>,
    },
  ]);

  return elements;
}

export default Routes;
