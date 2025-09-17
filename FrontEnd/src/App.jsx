import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Importa el nuevo componente para manejar los callbacks
import OAuthCallback from "./pages/OAuthCallback";

// Middleware simple para rutas protegidas
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId="241025979521-4gdp0r3gf0cbaia9v5b148l01vp56ohn.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Ruta principal, ahora es el Home */}
            <Route path="/" element={<Home />} />
            
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* NUEVA RUTA: Maneja el callback de GitHub */}
            <Route path="/oauth/callback" element={<OAuthCallback />} />

            {/* Ruta protegida: perfil */}
            <Route path="/profile" element={<PrivateRoute> <Profile /> </PrivateRoute>} />

            {/* Redirige a Home si la ruta no existe */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}