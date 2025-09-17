// src/scripts/syncDatabase.js
// syncDB.js (versión para un solo modelo)

import dotenv from "dotenv";
import sequelize from "../config/database.js";
import Usuario from '../models/Usuario.js';

dotenv.config();

const syncDB = async () => {
  try {
    console.log("🔄 Sincronizando modelo de Usuario...");

    await sequelize.authenticate();
    console.log("✅ Conexión a DB establecida");

    // Sincronizar solo el modelo Usuario. El método .sync() también se puede
    // llamar directamente en el modelo para este propósito.
    await Usuario.sync({ alter: true });
    console.log("✅ Modelo 'Usuario' sincronizado exitosamente");

    console.log("🎉 Sincronización de un solo modelo completada");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante la sincronización:", error);
    process.exit(1);
  }
};

syncDB();
//node src/scripts/syncDB.js