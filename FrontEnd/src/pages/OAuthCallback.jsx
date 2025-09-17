import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Leer query params
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    // Leer también los datos del usuario si los envías
    const usuarioParam = params.get("usuario");
    const usuario = usuarioParam ? JSON.parse(decodeURIComponent(usuarioParam)) : null;

    if (accessToken && refreshToken && usuario) {
      // Guardar en contexto y localStorage
      login(usuario, { accessToken, refreshToken });
      // Redirigir al perfil
      navigate("/perfil");
    } else {
      // Si algo falla, volver al login
      navigate("/login");
    }
  }, [login, navigate]);

  return <p>Redirigiendo...</p>;
}
