import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Configuração da API
const API_URL = "http://192.168.3.12:5097";

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "@app:accessToken",
  USER_DATA: "@app:userData",
  TOKEN_EXPIRATION: "@app:tokenExpiration",
  CAMARA_DATA: "@app:camaraData",
  PASSWORD_RESETED: "@app:passwordReseted",
};

// Instância do axios
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de Request - Adiciona o token automaticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Erro ao obter token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Trata erros globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Token expirado ou inválido
      if (status === 401) {
        // Limpa o storage e redireciona para login
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.ACCESS_TOKEN,
          STORAGE_KEYS.USER_DATA,
          STORAGE_KEYS.TOKEN_EXPIRATION,
          STORAGE_KEYS.CAMARA_DATA,
          STORAGE_KEYS.PASSWORD_RESETED,
        ]);
        // Você pode emitir um evento ou usar navigation aqui para redirecionar
      }

      // Retorna a mensagem de erro da API
      const message = data?.message || data?.error || "Erro na requisição";
      return Promise.reject(new Error(message));
    }

    // Erro de rede ou timeout
    if (error.request) {
      if (error.code === "ECONNREFUSED") {
        return Promise.reject(
          new Error("API não está rodando. Verifique se o servidor está ativo.")
        );
      }

      if (error.code === "ETIMEDOUT") {
        return Promise.reject(
          new Error("Timeout - API demorou muito para responder.")
        );
      }

      return Promise.reject(
        new Error(
          "Erro de conexão. Verifique sua internet e se a API está rodando."
        )
      );
    }

    return Promise.reject(error);
  }
);
