import { createContext, useContext, useEffect, useState } from "react";
import { getToken, getUserData, logoutService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (token) {
      const userData = getUserData();
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);
  const loginAuth = (userData) => {
    setUser(JSON.parse(userData));
  };

  const logoutAuth = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        loginAuth,
        logoutAuth,
        isAuthenticated: user !== null,
        isAdmin: user?.role === "admin",
        isPatient: user?.role === "patient",
        isReceptionist: user?.role === "receptionist",
        isDoctor: user?.role === "doctor",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be with in authProvider");
  }
  return context;
};
