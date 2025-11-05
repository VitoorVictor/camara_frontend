import { CurrentUser, LoginRequest, LoginResponse } from "@/types/api.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, STORAGE_KEYS } from "./api";

/**
 * Serviço de autenticação
 */
export const authService = {
  /**
   * Realiza o login do usuário
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const { data } = await api.post<LoginResponse>("/sign-in", credentials);

      // Mescla os dados do currentUser com nome e presidente do LoginResponse
      const userData = {
        ...data.currentUser,
        nome: data.nome || data.currentUser.nome,
        presidente: data.presidente ?? data.currentUser.presidente,
      };

      // Salva os dados no AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.TOKEN_EXPIRATION,
        data.expiration
      );

      return data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.TOKEN_EXPIRATION,
    ]);
  },

  /**
   * Recupera o token de acesso
   */
  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Recupera os dados do usuário
   */
  async getCurrentUser(): Promise<CurrentUser | null> {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Verifica se o usuário está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    const expiration = await AsyncStorage.getItem(
      STORAGE_KEYS.TOKEN_EXPIRATION
    );

    if (!token || !expiration) {
      return false;
    }

    // Verifica se o token não expirou
    const expirationDate = new Date(expiration);
    const now = new Date();

    return expirationDate > now;
  },

  /**
   * Atualiza o token de acesso
   */
  async refreshToken(): Promise<string | null> {
    const { data } = await api.post<LoginResponse>("/auth/refresh");

    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRATION, data.expiration);

    return data.accessToken;
  },
};
