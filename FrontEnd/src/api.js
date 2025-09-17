import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // ajusta
});

// Interceptor para agregar token
API.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default API;
