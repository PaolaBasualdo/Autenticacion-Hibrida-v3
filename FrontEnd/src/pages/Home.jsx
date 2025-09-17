// src/pages/Home.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  Shield as ShieldIcon,
  Lock as LockIcon,
  People as UsersIcon,
  CheckCircle as CheckCircleIcon,
  ArrowRightAlt as ArrowRightIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

// Texto con degradado
const GradientText = ({ children }) => (
  <span
    style={{
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold',
    }}
  >
    {children}
  </span>
);

// Botón con efecto de brillo
const GlowButton = (props) => (
  <Button
    {...props}
    sx={{
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      color: 'white',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 6px 20px 6px rgba(255, 105, 135, .3)',
      },
      ...props.sx,
    }}
  >
    {props.children}
  </Button>
);

// Tarjeta con degradado
const GradientCard = ({ children, sx }) => (
  <Card
    sx={{
      border: 'none',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.15))',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0,0,0,0.12)',
      ...sx,
    }}
  >
    {children}
  </Card>
);

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    { icon: ShieldIcon, title: 'Seguridad Avanzada', desc: 'Autenticación JWT, validación de formularios y gestión segura de sesiones.' },
    { icon: UsersIcon, title: 'Login Social', desc: 'Integración con Google, Facebook y otros proveedores OAuth populares.' },
    { icon: LockIcon, title: 'Rutas Protegidas', desc: 'Control de acceso automático y redirects inteligentes según el estado de autenticación.' },
  ];

  const flowSteps = [
    { icon: UsersIcon, title: 'Registro/Login', desc: 'Formularios intuitivos con validación' },
    { icon: ShieldIcon, title: 'Verificación', desc: 'Validación de credenciales segura' },
    { icon: CheckCircleIcon, title: 'Autenticación', desc: 'Generación de tokens JWT' },
    { icon: LockIcon, title: 'Acceso', desc: 'Navegación a áreas protegidas' },
  ];

  return (
    <>
      <Header />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <main>
          {/* Hero */}
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Container maxWidth="lg">
              {isAuthenticated ? (
                <Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                    ¡Bienvenido de vuelta, <GradientText>{user?.name}</GradientText>!
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    Tu sesión está activa y segura. Accede a tu panel de control.
                  </Typography>
                  <GlowButton component={RouterLink} to="/profile" size="large">
                    Ver Perfil
                    <ArrowRightIcon sx={{ ml: 1 }} />
                  </GlowButton>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                    Autenticación <GradientText>Segura y Simple</GradientText>
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    Sistema completo de autenticación con login clásico y opciones sociales.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <GlowButton component={RouterLink} to="/login" size="large">
                      Comenzar Ahora
                      <ArrowRightIcon sx={{ ml: 1 }} />
                    </GlowButton>
                    <Button
                      component="a"
                      href="#features"
                      variant="outlined"
                      size="large"
                      sx={{ color: '#000', borderColor: 'rgba(0,0,0,0.12)' }}
                    >
                      Ver Características
                    </Button>
                  </Box>
                </Box>
              )}
            </Container>
          </Box>

          {/* Características */}
          <Box id="features" sx={{ py: 8 }}>
            <Container maxWidth="lg">
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
                Características Principales
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 6, textAlign: 'center' }}>
                Todo lo que necesitas para un sistema de autenticación completo
              </Typography>

              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', mb: 8 }}>
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <GradientCard key={index} sx={{ width: 280 }}>
                      <CardContent sx={{ textAlign: 'center', p: 4 }}>
                        <Box sx={{
                          height: 64,
                          width: 64,
                          mx: 'auto',
                          mb: 3,
                          borderRadius: '50%',
                          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Icon sx={{ height: 32, width: 32, color: 'white' }} />
                        </Box>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.desc}
                        </Typography>
                      </CardContent>
                    </GradientCard>
                  );
                })}
              </Box>

              {/* Flujo de autenticación */}
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
                Flujo de Autenticación
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Proceso optimizado desde el registro hasta el acceso a áreas protegidas
              </Typography>

              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                {flowSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Box key={index} sx={{ width: 220, textAlign: 'center' }}>
                      <Box sx={{
                        height: 48,
                        width: 48,
                        mx: 'auto',
                        mb: 2,
                        borderRadius: '50%',
                        bgcolor: 'rgb(102, 126, 234, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon sx={{ height: 24, width: 24, color: '#1976d2' }} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.desc}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Container>
          </Box>

          {/* CTA */}
          {!isAuthenticated && (
            <Box sx={{ py: 8, background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white', textAlign: 'center' }}>
              <Container maxWidth="lg">
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                  ¿Listo para comenzar?
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
                  Crea tu cuenta en segundos y experimenta un sistema de autenticación moderno y seguro.
                </Typography>
                <GlowButton component={RouterLink} to="/register" size="large">
                  Crear Cuenta Gratis
                  <ArrowRightIcon sx={{ ml: 1 }} />
                </GlowButton>
              </Container>
            </Box>
          )}
        </main>
      </Box>
    </>
  );
};

export default Home;
