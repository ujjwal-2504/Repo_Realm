import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = new createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ childern }) => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      setCurrentUser(userId);
    }
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}> {childern} </AuthContext.Provider>
  );
};

export default AuthContext;
