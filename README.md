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
  - [Estado del proyecto](#estado-del-proyecto)
  - [Funcionalidades](#funcionalidades)
  - [Tecnologías](#tecnologías)
  - [Estructura del Proyecto](#estructura-del-royecto)
  - [Instalación y Configuración](#instalación-y-configuración)
  - [Desarrollador](#desarrollador)

-----

## 📖 Descripción del proyecto

Este proyecto es un **sistema de autenticación híbrido** para una aplicación de comercio electrónico, desarrollado con un enfoque **Full-Stack JavaScript**. La solución integra la autenticación tradicional (email y contraseña) con la moderna autenticación social (OAuth 2.0) a través de Google. La seguridad se gestiona mediante **JSON Web Tokens (JWT)** para proteger las rutas privadas y mantener la persistencia de la sesión de manera segura.

El backend, construido con **Node.js y Express**, gestiona la lógica de autenticación y la API REST. El frontend, desarrollado con **React.js**, interactúa con esta API para ofrecer una experiencia de usuario fluida, protegiendo las rutas según el estado de autenticación.

-----

## 🏗️ Arquitectura y Flujo Técnico

### Flujo de Autenticación Local

1.  **Registro de Usuario:** El usuario envía sus datos (nombre, email, contraseña) al endpoint de registro (`/api/auth/register`).
2.  **Hashing de Contraseña:** El servidor, utilizando `bcryptjs`, hashea la contraseña recibida. Este proceso irreversible asegura que la contraseña nunca se almacene en texto plano en la base de datos.
3.  **Creación en DB:** Se crea un nuevo registro en la base de datos con los datos del usuario y la contraseña hasheada.
4.  **Login y Validación:** En el login, el usuario envía su email y contraseña. El servidor busca el usuario por email y utiliza `bcryptjs` para comparar la contraseña proporcionada con la hasheada almacenada.
5.  **Generación de JWT:** Si la comparación es exitosa, se genera un **JSON Web Token (JWT)**. Este token contiene un `payload` con información no sensible del usuario (ej. `id`, `email`) y está firmado con una clave secreta (`JWT_SECRET`).
6.  **Respuesta al Cliente:** El servidor envía el JWT al cliente como parte de la respuesta. El frontend lo almacena de forma segura (ej. en `localStorage` o `cookies`).
7.  **Acceso a Rutas Protegidas:** Para acceder a una ruta protegida, el cliente adjunta el JWT en el encabezado `Authorization` (`Bearer <token>`). El servidor utiliza un **middleware** para validar este token. Si el token es válido y no ha expirado, se permite el acceso a la ruta.

### Flujo de Autenticación OAuth 2.0 (Google)

1.  **Inicio de Login:** El usuario hace clic en el botón "Login con Google" en el frontend.
2.  **Redirección a Google:** El backend inicia el flujo de Passport.js y redirige al usuario a la página de consentimiento de Google.
3.  **Autorización del Usuario:** El usuario aprueba el acceso de la aplicación a sus datos de perfil.
4.  **Google Callback:** Google redirige al usuario de vuelta al `callback URL` configurado en el backend, junto con un `código de autorización`.
5.  **Obtención de Datos del Perfil:** El backend utiliza este código para intercambiarlo por un `access token` y los datos del perfil de Google del usuario.
6.  **Lógica de Base de Datos:**
      * Se verifica si el usuario (por su email de Google) ya existe en la base de datos.
      * Si el usuario **existe**, se genera un JWT para él y se envía de vuelta al cliente.
      * Si el usuario **no existe**, se crea un nuevo registro en la base de datos utilizando los datos de Google. Luego, se genera y envía un JWT.
7.  **Finalización del Flujo:** El servidor redirige al usuario al frontend, pasando el JWT para que la aplicación del cliente pueda manejar la sesión.

-----

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

  * **Autenticación Local:**
      * Registro de usuarios (nombre, email, contraseña).
      * Contraseña hasheada con `bcryptjs` para máxima seguridad.
      * Login con validación de credenciales.
      * Generación y validación de **JWT** para sesiones seguras.
  * **Autenticación Social (OAuth 2.0):**
      * Login con **Google** integrado usando `Passport.js`.
      * Creación automática de usuario si no existe en la DB.
      * Manejo de redirecciones y `callbacks` del proveedor.
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
      * **Base de datos:** Relacional (PostgreSQL o MySQL).
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
    JWT_SECRET=tu_secreto_para_jwt
    GOOGLE_CLIENT_ID=tu_id_de_cliente_de_google
    GOOGLE_CLIENT_SECRET=tu_secreto_de_cliente_de_google
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
