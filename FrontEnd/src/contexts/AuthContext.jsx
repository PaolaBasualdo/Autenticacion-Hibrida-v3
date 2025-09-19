// src/contexts/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import API from "../api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Recupera la sesión guardada en localStorage al montar la app
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = localStorage.getItem("refreshToken");

    if (storedUser && storedAccess && storedRefresh) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
    }
  }, []); // ✅ Solo corre al montar

  // Login: guarda usuario y tokens en estado y localStorage
  const login = (userData, tokens) => {
    setUser(userData);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  };

  // Logout: limpia estado y localStorage
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.clear();
  };

  // Refrescar token de acceso usando refresh token
  const refreshAccessToken = async () => {
    try {
      const res = await API.post("/auth/refresh", { token: refreshToken });
      const newAccess = res.data.data.accessToken;
      setAccessToken(newAccess);
      localStorage.setItem("accessToken", newAccess);
      return newAccess;
    } catch (err) {
      logout();
      throw new Error("No se pudo refrescar el token");
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        refreshAccessToken,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};