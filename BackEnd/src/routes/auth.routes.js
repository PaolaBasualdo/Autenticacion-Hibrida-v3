// ============================================================================
// RUTAS DE AUTENTICACIÓN
// ============================================================================
// Este archivo maneja todas las rutas relacionadas con autenticación:
// - Registro e inicio de sesión local (email/password)
// - Autenticación OAuth con Google


import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login } from "../controllers/auth.controller.js";

import axios from 'axios'; // Asegúrate de importar axios
import Usuario from '../models/Usuario.js'; // Asegúrate de importar el modelo Usuario


const router = Router();

// ============================================================================
// RUTAS DE AUTENTICACIÓN LOCAL (tradicional)
// ============================================================================
// Estas rutas manejan el registro e inicio de sesión con email y contraseña

router.post("/register", register); // Crea usuario nuevo + devuelve token JWT
router.post("/login", login);       // Valida credenciales + devuelve token JWT

// ============================================================================
// RUTAS DE AUTENTICACIÓN CON GOOGLE OAUTH 2.0
// ============================================================================
// Flujo completo de autenticación con Google:
// 1. Usuario hace clic en "Login con Google" en el frontend
// 2. Frontend redirige a: GET /api/auth/google
// 3. Passport redirige al usuario a Google para autenticación
// 4. Usuario autoriza la aplicación en Google
// 5. Google redirige a: GET /api/auth/google/callback
// 6. Passport procesa la respuesta y obtiene datos del usuario
// 7. Nuestra app genera un JWT y lo devuelve

// RUTA 1: Iniciar autenticación con Google
router.post("/google", async (req, res) => {
    try {
        const { access_token } = req.body;

        if (!access_token) {
            return res.status(400).json({ success: false, error: "No se proporcionó el token de Google" });
        }

        // Paso 1: Usamos el token para obtener el perfil del usuario de Google
        // Esto verifica si el token es válido y nos da los datos del usuario de forma segura.
        const { data: googleProfile } = await axios.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        // Paso 2: Buscamos al usuario en nuestra base de datos.
        // Verificamos si ya existe un usuario registrado con el ID de Google.
        let usuario = await Usuario.findOne({
            where: {
                proveedorId: googleProfile.id,
                proveedor: 'google',
            },
        });

        if (!usuario) {
            // Si el usuario no existe, lo creamos con los datos que nos dio Google.
            usuario = await Usuario.create({
                nombre: googleProfile.name,
                email: googleProfile.email,
                proveedor: 'google',
                proveedorId: googleProfile.id,
            });
        }

        // Paso 3: Generamos nuestros propios JWT para la sesión de la aplicación.
        // Estos tokens son los que el frontend guardará y usará para acceder a rutas protegidas.
        const accessToken = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Token de corta duración
        );

        const refreshToken = jwt.sign(
            { id: usuario.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' } // Token de larga duración
        );

        // Paso 4: Devolvemos una respuesta exitosa al frontend con los tokens y el usuario.
        res.json({
            success: true,
            message: 'Login con Google exitoso',
            data: { accessToken, refreshToken, usuario },
        });

    } catch (err) {
        console.error("❌ Error en el login con Google:", err);
        // Devolvemos un error 500 para indicar que algo salió mal en el servidor.
        res.status(500).json({ success: false, error: 'Error interno del servidor. Por favor, intente de nuevo más tarde.' });
    }
});

// Cuando el usuario visita esta ruta, Passport automáticamente lo redirige a Google
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] // Permisos que solicitamos a Google
  })
);

// RUTA 2: Callback de Google - Aquí regresa el usuario después de autenticarse
// Google redirige aquí con un código de autorización que Passport procesa automáticamente
router.get('/google/callback',
  // Passport procesa la respuesta de Google y ejecuta la estrategia GoogleStrategy
  passport.authenticate('google', { 
    session: false // No usar sesiones porque usamos JWT
  }),
  (req, res) => {
    try {
      // En este punto, req.user contiene los datos del usuario devueltos por la estrategia
      // (ya sea un usuario existente o uno recién creado)
      
      // Generar token JWT con la información del usuario
      const token = jwt.sign(
        { 
          id: req.user.id, 
          email: req.user.email 
        }, 
        process.env.JWT_SECRET,                    // Clave secreta para firmar el token
        { 
          expiresIn: process.env.JWT_EXPIRES_IN || '24h' // Token válido por 24 horas
        }
      );
      
      // Devolver respuesta JSON con el token y datos básicos del usuario
      res.json({ 
        success: true,
        message: 'Autenticación con Google exitosa',
        token,           // JWT que el frontend debe guardar y usar en requests futuros
        user: {
          id: req.user.id,
          nombre: req.user.nombre,
          email: req.user.email,
          proveedor: req.user.proveedor  // 'google' para identificar el tipo de cuenta
        }
      });
    } catch (error) {
      console.error('Error generando token JWT:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor al generar token' 
      });
    }
  }
);

// ... (Tus imports y rutas existentes)

// ============================================================================
// RUTAS DE AUTENTICACIÓN CON GITHUB OAUTH 2.0
// ============================================================================
// RUTA 1: Iniciar autenticación con GitHub




// RUTA 1: Iniciar autenticación con GitHub
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"], // pedimos el email
  })
);

// RUTA 2: Callback de GitHub
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const { usuario, accessToken, refreshToken } = req.user;

    // Enviar usuario + tokens al frontend vía query params
    res.redirect(
      `${process.env.FRONTEND_URL}/oauth/callback?accessToken=${encodeURIComponent(
        accessToken
      )}&refreshToken=${encodeURIComponent(
        refreshToken
      )}&usuario=${encodeURIComponent(JSON.stringify(usuario))}`
    );
  }
);
// ============================================================================
// EXPORTAR RUTAS
// ============================================================================
// Estas rutas tenemos que tenerlas en /api/auth en el archivo principal index.js
// URLs finales disponibles:
// - POST /api/auth/register (registro local)
// - POST /api/auth/login (login local)  
// - GET /api/auth/google (iniciar login con Google)
// - GET /api/auth/google/callback (callback de Google)

export default router;
