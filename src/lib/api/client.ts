import axios, { AxiosInstance, AxiosError } from "axios";
import { getIdToken } from "../firebase/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Instancia base de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor de request — agrega el token automáticamente
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de response — manejo centralizado de errores
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado — redirigir al login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
