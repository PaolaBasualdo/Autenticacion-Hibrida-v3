<h2 align="center"\>INSTITUTO SUPERIOR SANTA ROSA DE CALAMUCHITA\</h2\>
<h1 align="center"\>
💻 Hackaton 2025 - Sistema de Autenticación Híbrido - Grupo 4
</h1\>
<h3 align="center"\>
Full-Stack JS: Registro Local + Social (OAuth 2.0)
</h3\>

<p align="center">
  <a href="https://github.com/PaolaBasualdo/Hackaton-FullStack-Auth">
    <img src="https://img.shields.io/badge/GitHub-Repo-blue?logo=github" alt="GitHub Repo"/>
  </a>
  <img src="https://img.shields.io/badge/STATUS-IN%20DESARROLLO-yellow" alt="Status"/>
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/React-18+-blue?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/JWT-Security-orange" alt="JWT"/>
</p>
-----

## 📌 Tabla de Contenidos

  - [Descripción del proyecto](#descripción-del-proyecto)
  - [Arquitectura y Flujo Técnico](#arquitectura-y-flujo-técnico)
      - [Flujo de Autenticación Local](#flujo-de-autenticación-local)
      - [Flujo de Autenticación OAuth 2.0 (Google)](#flujo-de-autenticación-oAuth-2.0-(Google))
      - [Autenticación con GitHub (OAuth 2.0 + Passport)](#autenticación-con-github-(oAuth-2.0-+-passport)) 
  - [Estado del proyecto](#estado-del-proyecto)
  - [Funcionalidades](#funcionalidades)
  - [Tecnologías](#tecnologías)
  - [Estructura del Proyecto](#estructura-del-royecto)
  - [Instalación y Configuración](#instalación-y-configuración)
  - [Desarrollador](#desarrollador)

-----

## 📖 Descripción del proyecto

Este proyecto es un sistema de autenticación híbrido para una aplicación de comercio electrónico, desarrollado con un enfoque Full-Stack JavaScript.

Integra tres estrategias de autenticación:

  Local: Registro y login con email/contraseña.

  Google (OAuth 2.0): Inicio de sesión con cuenta de Google.

  GitHub (OAuth 2.0 con Passport.js): Inicio de sesión mediante GitHub con callback y redirección.

La seguridad de las sesiones se gestiona mediante JSON Web Tokens (JWT) para proteger rutas privadas y mantener la persistencia del login.

-----

## 🏗️ Arquitectura y Flujo Técnico

### 🔑Flujo de Autenticación Local

1.  **Registro de Usuario:** El usuario envía sus datos (nombre, email, contraseña) al endpoint de registro (`/api/auth/register`).
2.  **Hashing de Contraseña:** El servidor, utilizando `bcryptjs`, hashea la contraseña recibida. Este proceso irreversible asegura que la contraseña nunca se almacene en texto plano en la base de datos.
3.  **Login:** El cliente envía email/contraseña al backend, que valida contra la DB.
4.  **Generación de JWT:** Si las credenciales son correctas, se crea un JWT con datos básicos del usuario (id, email).
5.  **Respuesta al Cliente:** El backend devuelve el JWT. El frontend lo guarda en localStorage o cookies.
6.  **Acceso a Rutas Protegidas:** El cliente envía el JWT en el header Authorization: Bearer <token>. Middleware en el backend valida el token.

### 🔑Flujo de Autenticación OAuth 2.0 (Google)

1. **Inicio de Login:** El usuario hace clic en "Login con Google".
2. **Redirección a Google:** Passport redirige al usuario a la página de consentimiento de Google.
3. **Autorización:** El usuario acepta compartir su información de perfil.
4. **Callback:** Google redirige al backend con un code de autorización.
5. **Intercambio de Credenciales:** El backend intercambia ese code por un access token y obtiene los datos del perfil.
6. **DB + JWT:**
   Si el usuario existe en DB, se genera un JWT.
   Si no existe, se crea un registro nuevo y luego se genera el JWT.
7. **Finalización:** El backend redirige al frontend con el JWT para que el cliente lo almacene y maneje la sesión.

-----

### 🔑Flujo de Autenticación GitHub (OAuth 2.0 con Passport)

1. **Inicio de Login:** El usuario hace clic en "Login con GitHub".
2. **Redirección a GitHub:** El frontend llama al backend (/auth/github), que redirige al login de GitHub.
3. **Autorización:** El usuario inicia sesión en GitHub y autoriza la aplicación.
4. **Callback:** GitHub redirige al backend a /auth/github/callback con un code.
5. **Intercambio de Código:** Passport intercambia ese code por un access token y obtiene el perfil del usuario.
6. **DB + Token:**
   Si el usuario existe en DB → se genera un JWT o cookie de sesión.
   Si no existe → se crea el usuario y luego se genera el JWT.
7. **Redirección al Frontend:** El backend redirige al frontend (ej. /dashboard) incluyendo el token.
8. **Acceso a rutas protegidas:** Igual que en los otros métodos, usando el JWT o cookie de sesión.

------

##💡 Resumen Comparativo

| Estrategia | Flujo                          | Generación del token            | Almacenamiento       | Particularidad                                  |
| ---------- | ------------------------------ | ------------------------------- | -------------------- | ----------------------------------------------- |
| **Local**  | Directo (front → back → front) | Backend tras validar DB         | localStorage/cookies | Usuario gestiona credenciales propias           |
| **Google** | OAuth (redirección a Google)   | Backend tras validar con Google | localStorage/cookies | Usa API de Google                               |
| **GitHub** | OAuth (redirección + callback) | Backend tras validar con GitHub | localStorage/cookies | Flujo no lineal, depende de Passport + callback |

----

## 🚧 Estado del proyecto

| Funcionalidad | Estado |
|-------------------------------------|------------|
| Registro y login local | ✅ Completo |
| Hash de contraseñas con bcryptjs | ✅ Completo |
| Login con Google OAuth 2.0 | ✅ Parcial |
| Generación y validación de JWT | ✅ Completo |
| Rutas privadas en frontend | ✅ Completo |
| Logout y cierre de sesión |  ✅ Completo|
| Integración con más proveedores OAuth | 🚧 En desarrollo |

-----

## 🔧 Funcionalidades

  * **Autenticación Local:** Registro, login, bcryptjs, JWT.
      
  * **Autenticación Google:** OAuth 2.0, (Google Identity Services — verificación de ID token en backend) creación automática de usuario, JWT.

  * **Autenticación GitHub:** OAuth 2.0 con Passport, redirección y callback, creación/validación en DB.
      
  * **Gestión de Sesión:**
      * Almacenamiento seguro del JWT en el cliente (ej. `localStorage`).
      * Protección de rutas privadas en el frontend mediante el JWT.
      * Implementación de `logout` que invalida la sesión del cliente al eliminar el token.

-----

## 🚀 Tecnologías

  * **Frontend**
      * **React.js 18+:** Biblioteca de UI.
      * **React Router:** Manejo de rutas del lado del cliente.
      * **Axios:** Cliente HTTP para interactuar con la API.
  * **Backend**
      * **Node.js 18+ & Express.js:** Entorno de ejecución y framework web para la API REST.
      * **Passport.js:** Middleware de autenticación modular.
          * `passport-local`: Para la estrategia de autenticación local.
          * `passport-google-oauth20`: Para la estrategia de autenticación con Google.
      * **bcryptjs:** Biblioteca para el hashing de contraseñas.
      * **jsonwebtoken:** Para la creación y validación de JWTs.
      * **`dotenv`:** Gestión de variables de entorno.
      * **Base de datos:** Relacional  MySQL.
  * **Herramientas**
      * **Git & GitHub:** Control de versiones.
      * **Postman / Insomnia:** Testing de APIs.
      * **Visual Studio Code:** IDE.

-----

## 📂 Estructura del Proyecto

La estructura del backend está organizada de manera modular para facilitar la escalabilidad y el mantenimiento:

```
/backend
├── /config
│   └── passportConfig.js   // Configuración de estrategias de Passport
├── /controllers
│   └── authController.js   // Lógica de los endpoints de autenticación
├── /models
│   └── User.js             // Modelo de Sequelize para la tabla 'users'
├── /routes
│   └── authRoutes.js       // Definición de las rutas de la API de autenticación
├── .env.example            // Ejemplo de variables de entorno
└── server.js               // Punto de entrada de la aplicación
```

-----

## ⚙️ Instalación y Configuración

1.  Clonar el repositorio:

    ```bash
    git clone https://github.com/PaolaBasualdo/Hackaton-FullStack-Auth.git
    cd Hackaton-FullStack-Auth/backend
    ```

2.  Instalar las dependencias del backend:

    ```bash
    npm install
    ```

3.  Crear un archivo `.env` en la raíz del proyecto backend y configurar las variables de entorno necesarias (consulta `.env.example` para referencia):

    ```
        PORT=3000
        DATABASE_URL=postgres://user:password@host:port/database
        JWT_SECRET=tu_secreto_jwt
        GOOGLE_CLIENT_ID=tu_google_id
        GOOGLE_CLIENT_SECRET=tu_google_secret
        GITHUB_CLIENT_ID=tu_github_id
        GITHUB_CLIENT_SECRET=tu_github_secret

    ```

4.  Configurar la base de datos y correr las migraciones (si aplica).

5.  Iniciar el servidor:

    ```bash
    npm run dev
    ```

-----

## 👩‍💻 Desarrollador:
Grupo 4
 

-----
