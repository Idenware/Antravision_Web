import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      throw new Error("Tempo de conexão excedido. Verifique sua internet.");
    }

    if (!error.response) {
      throw new Error("Erro de rede. Verifique sua conexão.");
    }

    return Promise.reject(error);
  }
);

export default api;
