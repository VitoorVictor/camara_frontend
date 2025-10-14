/**
 * Wrapper para AsyncStorage com tipagem
 * Facilita o uso do AsyncStorage com TypeScript
 *
 * IMPORTANTE: Este arquivo requer a instalação do pacote:
 * npm install @react-native-async-storage/async-storage
 */

// Descomente após instalar o pacote:
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Implementação mock para evitar erro de compilação
const AsyncStorage = {
  setItem: async (key: string, value: string) => {},
  getItem: async (key: string) => null as string | null,
  removeItem: async (key: string) => {},
  clear: async () => {},
};

const STORAGE_KEYS = {
  USER: "@app:user",
  TOKEN: "@app:token",
  THEME: "@app:theme",
  // Adicione mais chaves conforme necessário
} as const;

type StorageKey = keyof typeof STORAGE_KEYS;

export const storage = {
  /**
   * Salva um item no storage
   */
  setItem: async <T>(key: StorageKey, value: T): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(STORAGE_KEYS[key], jsonValue);
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
      throw error;
    }
  },

  /**
   * Recupera um item do storage
   */
  getItem: async <T>(key: StorageKey): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS[key]);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Erro ao recuperar ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove um item do storage
   */
  removeItem: async (key: StorageKey): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS[key]);
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
      throw error;
    }
  },

  /**
   * Limpa todo o storage
   */
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Erro ao limpar storage:", error);
      throw error;
    }
  },
};

// Exemplo de uso:
// import { storage } from '@/services/storage/asyncStorage';
//
// await storage.setItem('USER', { id: 1, name: 'João' });
// const user = await storage.getItem('USER');
// await storage.removeItem('USER');
