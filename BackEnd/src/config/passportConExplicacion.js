import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from 'passport-github2';
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";import fetch from "node-fetch"; 
import jwt from "jsonwebtoken";



// ============================================================================
// ESTRATEGIA LOCAL: Autenticación tradicional con email y contraseña
// ============================================================================
// Esta estrategia maneja el login cuando el usuario ingresa sus credenciales
// directamente en nuestro formulario (no OAuth)
/*passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    // 1. Buscar usuario en la base de datos por email
    const user = await Usuario.findOne({ where: { email } });
    if (!user) return done(null, false, { message: 'Usuario no encontrado' });
    
    // 2. Comparar la contraseña ingresada con el hash almacenado
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return done(null, false, { message: 'Contraseña incorrecta' });
    
    // 3. Si todo está bien, devolver el usuario
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));*/

// ============================================================================
// ESTRATEGIA GOOGLE OAUTH: Autenticación usando cuentas de Google
// ============================================================================
// Esta estrategia maneja el flujo OAuth 2.0 con Google:
// 1. Usuario hace clic en "Login con Google"
// 2. Se redirige a Google para autenticación
// 3. Google valida las credenciales del usuario
// 4. Google redirige de vuelta a nuestra app con un código
// 5. Passport intercambia el código por tokens de acceso
// 6. Passport usa los tokens para obtener el perfil del usuario
// 7. Ejecutamos la función callback de abajo con los datos del perfil

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = null;

        // 1. Ver si passport ya trae el email
        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        } else {
          // 2. Si no, consultamos manualmente a la API de GitHub
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${accessToken}`,
              "User-Agent": "node.js",
            },
          });
          const emails = await res.json();

          if (Array.isArray(emails)) {
            const primaryEmail = emails.find((e) => e.primary && e.verified);
            email = primaryEmail
              ? primaryEmail.email
              : emails.length > 0
              ? emails[0].email
              : null;
          }
        }

        if (!email) {
          return done(new Error("No se pudo obtener el email de GitHub"), null);
        }

        // 3. Buscar usuario por email
        let usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
          // crear nuevo si no existe
          usuario = await Usuario.create({
            nombre: profile.displayName || profile.username || "Github User",
            email,
            proveedor: "github",
            proveedorId: profile.id,
          });
        } else {
          // actualizar proveedor si ya existía
          usuario.proveedor = "github";
          usuario.proveedorId = profile.id;
          await usuario.save();
        }

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    }
  )
);
// ============================================================================
// ESTRATEGIA DE GITHUB OAUTH 2.0
// ============================================================================
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessTokenGitHub, refreshTokenGitHub, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No se pudo obtener el email de GitHub"), null);
        }

        // Buscar usuario existente
        let usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
          // Crear usuario si no existe
          usuario = await Usuario.create({
            nombre: profile.displayName || profile.username || "Github User",
            email,
            proveedor: "github",
            proveedorId: profile.id,
          });
        } else {
          // Actualizar proveedor si ya existía
          usuario.proveedor = "github";
          usuario.proveedorId = profile.id;
          await usuario.save();
        }

        // Generar JWT de tu app (no los de GitHub)
        const accessToken = jwt.sign(
          { id: usuario.id, email: usuario.email },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
          { id: usuario.id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "7d" }
        );

        // Pasamos usuario + tokens al callback
        return done(null, { usuario, accessToken, refreshToken });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// ============================================================================
// NOTA IMPORTANTE SOBRE JWT vs SESIONES
// ============================================================================
// En aplicaciones tradicionales, Passport requiere serialización/deserialización
// de usuarios para mantener sesiones. Sin embargo, en nuestro proyecto usamos JWT
// (JSON Web Tokens), que son "stateless" (sin estado).
//
// Con JWT:
// - No necesitamos guardar sesiones en el servidor
// - Toda la información del usuario va en el token
// - No necesitamos serializeUser/deserializeUser
// - El frontend guarda el token y lo envía en cada request
//
// Esto hace nuestra aplicación más escalable y simple de mantener.

export default passport;