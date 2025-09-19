import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Fade,
  IconButton,
  Divider,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google,
  GitHub,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // --- Login local ---
  const handleLocalLogin = async () => {
    try {
      setLoading(true);
      setError("");

      // 1️⃣ Hacer login y obtener tokens
      const res = await API.post("/auth/login", { email, password });
      const tokens = res.data.data; // { accessToken, refreshToken }
      console.log("🔑 Tokens login local:", tokens);
      // 2️⃣ Guardar tokens primero para que el interceptor funcione
      login({}, tokens);

      // 3️⃣ Pedir perfil del usuario ya con el token en headers
      const profile = await API.get("/usuarios/perfil");
      login(profile.data, tokens);

      // 4️⃣ Redirigir al home ifAyuthenticated
      navigate("/home");
    } catch (err) {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  // --- Login con Google ---
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // 1. Enviar el access_token de Google a tu backend y recibir tus JWT
        const res = await API.post("/auth/google", {
          access_token: tokenResponse.access_token,
        });

        // El backend devuelve los tokens y la info del usuario en res.data.data
        const { accessToken, refreshToken, usuario } = res.data.data;
        // 👀 Log temporal para verificar tokens y usuario
console.log("Tokens del backend:", { accessToken, refreshToken, usuario });
        

        // 2. Usar la función 'login' para guardar los tokens y el usuario en el contexto
        //    Esto es clave: el interceptor ahora tendrá el token disponible.
        login(usuario, { accessToken, refreshToken });
        

        // 3. Redirigir al perfil del usuario
        //    Ya no necesitas una petición adicional a /usuarios/perfil.
        //    Tu backend ya te devolvió el objeto 'usuario' en la respuesta del login.
        navigate("/perfil"); // O la ruta a la que quieras redirigir.
      } catch (err) {
        console.error(err);
        setError("No se pudo iniciar sesión con Google. Intenta de nuevo.");
      }
    },
    onError: () => setError("Error en el login con Google"),
  });
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Fade in={true} timeout={800}>
        <Container component="main" maxWidth="sm">
          <Paper
            elevation={10}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(10px)",
              position: "relative",
            }}
          >
            <IconButton
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                color: "primary.main",
              }}
              onClick={() => navigate("/")}
            >
              <ArrowBack />
            </IconButton>

            <Typography component="h1" variant="h4" gutterBottom>
              Iniciar Sesión
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Correo electrónico"
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Contraseña"
              margin="normal"
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleLocalLogin}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            <Divider sx={{ my: 2 }}>O</Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => googleLogin()}
              sx={{
                py: 1.5,
                mt: 2,
                borderRadius: 2,
                borderColor: "#4285F4", // Azul Google
                color: "#4285F4",
                "&:hover": { backgroundColor: "rgba(66,133,244,0.04)" },
              }}
            >
              Iniciar sesión con Google
            </Button>

            <Button
              component="a"
              href="http://localhost:3000/api/auth/github"
              target="_self" // fuerza que sea un link real, no manejado por React Router
              fullWidth
              variant="outlined"
              startIcon={<GitHub />}
              sx={{
                py: 1.5,
                mt: 2,
                borderRadius: 2,
                borderColor: "#333",
                color: "#333",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              Iniciar sesión con GitHub
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              ¿No tenés cuenta?{" "}
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#667eea",
                  fontWeight: "bold",
                }}
              >
                Registrate
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
}
