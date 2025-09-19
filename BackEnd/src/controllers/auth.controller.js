import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

// Generar tokens
export const generateTokens = (usuario) => {
  const accessToken = jwt.sign(
    { id: usuario.id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: usuario.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

// Registro local
// Registro local
export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    let usuario = await Usuario.findOne({ where: { email } });

    if (usuario) {
      if (!usuario.password) {
        // Caso: el usuario existe pero fue creado con un proveedor social
        usuario.password = password; // se encripta en el hook del modelo
        usuario.proveedor = "local";
        if (nombre && !usuario.nombre) usuario.nombre = nombre; // por si vino vacío en Google
        await usuario.save();

        const tokens = generateTokens(usuario);
        return res.status(200).json({
          success: true,
          message: "Usuario convertido a local exitosamente",
          data: tokens
        });
      } else {
        // Ya existe con contraseña → error
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado con una contraseña"
        });
      }
    }

    // Caso: no existe → crear usuario nuevo
    usuario = await Usuario.create({
      nombre,
      email,
      password,
      proveedor: "local"
    });

    const tokens = generateTokens(usuario);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: tokens
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al registrar usuario" });
  }
};


// Login local
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(401).json({ success: false, message: "Credenciales incorrectas" });

    const isValid = await usuario.validarPassword(password);
    if (!isValid) return res.status(401).json({ success: false, message: "Credenciales incorrectas" });

    // Actualizamos el proveedor solo si es distinto
    if (usuario.proveedor !== "local") {
      usuario.proveedor = "local";
      await usuario.save();
    }

    const tokens = generateTokens(usuario);
    res.json({ success: true, message: "Login exitoso", data: tokens });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error en login" });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ success: false, message: "Token no proporcionado" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) return res.status(401).json({ success: false, message: "Usuario no encontrado" });

    const tokens = generateTokens(usuario);
    res.json({ success: true, message: "Token refrescado", data: tokens });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
};
