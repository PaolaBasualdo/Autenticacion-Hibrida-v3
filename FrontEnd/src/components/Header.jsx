// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Person as PersonIcon,
  Shield as ShieldIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext'; // revisá que exista este archivo

// Icono del logo con degradado
const LogoIcon = styled(Box)(() => ({
  height: 32,
  width: 32,
  borderRadius: 8,
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// Texto del logo con degradado
const LogoText = styled(Typography)(() => ({
  fontSize: '1.25rem',
  fontWeight: 700,
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: 50,
        backgroundColor: '#ffffffcc', // color claro con transparencia
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #ddd',
      }}
    >
      <Toolbar sx={{ height: 64, mx: 'auto', maxWidth: '1280px', width: '100%' }}>
        {/* Lado izquierdo: Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: '8px',
            }}
          >
            <LogoIcon>
              <ShieldIcon sx={{ height: 16, width: 16, color: '#fff' }} />
            </LogoIcon>
            <LogoText>AuthApp</LogoText>
          </Link>
        </Box>

        {/* Lado derecho */}
        <Box>
          {isAuthenticated ? (
            <>
              <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
                {user?.avatar ? (
                  <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
                ) : (
                  <Avatar sx={{ width: 40, height: 40, bgcolor: '#FF8E53' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                )}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    width: 224,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user?.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  <PersonIcon sx={{ mr: 1.5 }} />
                  Perfil
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1.5 }} />
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                to="/login"
                variant="text"
                sx={{ color: '#333' }}
              >
                Iniciar Sesión
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  color: '#fff',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px 6px rgba(255, 105, 135, .3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Registrarse
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
