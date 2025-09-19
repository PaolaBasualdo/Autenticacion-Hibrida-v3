import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const usuarioParam = params.get("usuario");
    
    // Si no hay datos, no hagas nada y detén la ejecución del efecto.
    // Esto evita el bucle de redirección.
    if (!accessToken || !refreshToken || !usuarioParam) {
      console.log("No hay datos en la URL. No se hará nada.");
      return; 
    }

    let usuario = null;
    try {
      usuario = JSON.parse(decodeURIComponent(usuarioParam));
      console.log("Usuario parseado:", usuario);
    } catch (error) {
      console.error("Error al parsear el objeto de usuario:", error);
      navigate("/login");
      return;
    }

    console.log("✅ Autenticación exitosa. Redirigiendo a /perfil");
    login(usuario, { accessToken, refreshToken });
    navigate("/perfil");

  }, [login, navigate]);

  return <p>Redirigiendo...</p>;
}
