import passport from "passport";
import { Strategy as GitHubStrategy } from 'passport-github2';
import Usuario from "../models/Usuario.js";
import fetch from "node-fetch"; 

import { generateTokens } from "../controllers/auth.controller.js"; // Importa la función


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
        
        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        } else {
          // Consultar el email
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
          console.error("❌ Error: No se pudo obtener el email de GitHub.");
          return done(new Error("No se pudo obtener el email de GitHub"), null);
        }

        let usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
          usuario = await Usuario.create({
            nombre: profile.displayName || profile.username || "Github User",
            email,
            proveedor: "github",
            proveedorId: profile.id,
          });
          console.log("✅ Usuario creado:", usuario.toJSON());
        } else {
          usuario.proveedor = "github";
          usuario.proveedorId = profile.id;
          await usuario.save();
          console.log("✅ Usuario encontrado y actualizado:", usuario.toJSON());
        }

        // Genera los tokens a partir de la función reutilizable
        const tokens = generateTokens(usuario);

        // Pasa los tokens y el objeto de usuario al siguiente middleware
        console.log("✅ Proceso de autenticación de Passport finalizado. Datos a devolver:", { ...tokens, usuario: usuario.toJSON() });
        return done(null, { ...tokens, usuario: usuario.toJSON() });
      } catch (error) {
        console.error("❌ Error en la estrategia de Passport:", error);
        return done(error);
      }
    }
  )
);

export default passport;