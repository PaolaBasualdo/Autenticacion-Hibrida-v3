// src/contexts/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import API from "../api";
import Cookies from "js-cookie"; // npm install js-cookie

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Recuperar sesión guardada en localStorage al iniciar la app
  useEffect(() => {
    // 1️⃣ Intentar desde localStorage
    const storedUser = localStorage.getItem("user");
    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = localStorage.getItem("refreshToken");

    if (storedUser && storedAccess && storedRefresh) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      return;
    }

    // 2️⃣ Intentar desde cookie (GitHub OAuth)
    const cookieAccess = Cookies.get("accessToken");
    if (cookieAccess && !user) {
      setAccessToken(cookieAccess);
      // Opcional: podés hacer fetch al backend para obtener info del usuario
      (async () => {
        try {
          const res = await API.get("/usuarios/perfil", {
            headers: { Authorization: `Bearer ${cookieAccess}` },
          });
          setUser(res.data.data);
        } catch (err) {
          console.error("No se pudo obtener perfil desde cookie", err);
        }
      })();
    }
  }, []); // ✅ solo corre al montar

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
    Cookies.remove("accessToken"); // limpiar cookie de GitHub
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
