import {
  CamaraDTO,
  ChangePasswordRequest,
  CurrentUser,
  LoginRequest,
  LoginResponse,
} from "@/types/api.types";
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
      await AsyncStorage.setItem(
        STORAGE_KEYS.CAMARA_DATA,
        JSON.stringify(data.camaraDTO)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.PASSWORD_RESETED,
        JSON.stringify(data.passwordReseted)
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
      STORAGE_KEYS.CAMARA_DATA,
      STORAGE_KEYS.PASSWORD_RESETED,
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
   * Recupera os dados da câmara
   */
  async getCamaraData(): Promise<CamaraDTO | null> {
    const camaraData = await AsyncStorage.getItem(STORAGE_KEYS.CAMARA_DATA);
    return camaraData ? JSON.parse(camaraData) : null;
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

  /**
   * Altera a senha do usuário
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    await api.put("/User/change-password", passwordData);
    // Remove o flag de senha resetada após alterar com sucesso
    await AsyncStorage.removeItem(STORAGE_KEYS.PASSWORD_RESETED);
  },

  /**
   * Verifica se a senha precisa ser alterada
   */
  async isPasswordReseted(): Promise<boolean> {
    const passwordReseted = await AsyncStorage.getItem(
      STORAGE_KEYS.PASSWORD_RESETED
    );
    return passwordReseted === "true";
  },
};
