import { useAuth } from "../AuthContext";

export function useLogout() {
  const { setCurrentUser } = useAuth();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setCurrentUser(null);
  };

  return logout;
}
