import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Fade
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  PersonAdd,
  Email,
  Lock
} from "@mui/icons-material";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { data } = await API.post("/auth/register", { nombre, email, password });
      console.log("Tokens recibidos en registro:", data.data);
      alert(data.message || "Registro exitoso! Por favor inicia sesión.");

      // Navegar a login usando React Router
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error en registro";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/"); // navegar al inicio con React Router
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2
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
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              position: "relative"
            }}
          >
            <IconButton
              onClick={handleGoBack}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                color: "primary.main"
              }}
            >
              <ArrowBack />
            </IconButton>

            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2
              }}
            >
              <PersonAdd sx={{ fontSize: 40, color: "white" }} />
            </Box>

            <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
              Crear Cuenta
            </Typography>
            
            <Typography variant="body2" align="center" sx={{ mb: 3, color: "text.secondary" }}>
              Completa tus datos para registrarte en nuestra plataforma
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" sx={{ mt: 1, width: "100%" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="nombre"
                label="Nombre completo"
                name="nombre"
                autoComplete="name"
                autoFocus
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                onClick={handleRegister}
                disabled={loading}
                size="large"
                sx={{
                  mt: 1,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)"
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Registrarse"}
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                onClick={handleGoBack}
                size="large"
                startIcon={<ArrowBack />}
                sx={{ py: 1.5, borderRadius: 2, borderWidth: 2, "&:hover": { borderWidth: 2 } }}
              >
                Volver al Inicio
              </Button>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
}
