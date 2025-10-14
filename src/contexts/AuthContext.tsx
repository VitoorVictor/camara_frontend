/**
 * Context de Autenticação
 *
 * Exemplo de uso:
 *
 * import { useAuth } from '@/contexts/AuthContext';
 *
 * function MeuComponente() {
 *   const { user, login, logout } = useAuth();
 *   // ...
 * }
 */

import { storage } from "@/services/storage/asyncStorage";
import { User } from "@/types/models.types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedUser = await storage.getItem<User>("USER");
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      // TODO: Implementar chamada à API
      // const response = await api.post('/auth/login', { email, password });

      // Exemplo de resposta mockada:
      const mockUser: User = {
        id: "1",
        name: "Usuário Teste",
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(mockUser);
      await storage.setItem("USER", mockUser);
      // await storage.setItem('TOKEN', response.token);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  }

  async function signOut() {
    try {
      setUser(null);
      await storage.removeItem("USER");
      await storage.removeItem("TOKEN");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
