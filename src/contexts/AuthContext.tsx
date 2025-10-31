import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { authService } from "@/services/authService";
import { CurrentUser } from "@/types/api.types";

interface AuthContextData {
  user: CurrentUser | null;
  loading: boolean;
  signIn: (userName: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      setLoading(true);
      // Verifica se há token válido no AsyncStorage
      const isAuth = await authService.isAuthenticated();

      if (isAuth) {
        // Token válido encontrado, restaura os dados do usuário
        const storedUser = await authService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        } else {
          // Se não houver dados do usuário mas o token existe, limpa tudo
          await authService.logout();
        }
      } else {
        // Token inválido ou expirado, limpa os dados
        await authService.logout();
        setUser(null);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      // Em caso de erro, limpa os dados para garantir segurança
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(userName: string, password: string) {
    try {
      setLoading(true);
      const response = await authService.login({ userName, password });
      setUser(response.currentUser);
      // setUser({
      //   camara: null,
      //   camaraId: "658c5bd8-7ca0-482b-bbae-bd783c0c97c8",
      //   nome: "Vereadore",
      //   sobrenome: "Presidente",
      //   createdAt: "2025-10-27T22:14:18.439174",
      //   updatedAt: null,
      //   id: "c3a256ef-a94c-429e-9e20-9562b0d5f330",
      //   userName: "vereadorpresidente",
      //   normalizedUserName: "VEREADORPRESIDENTE",
      //   email: "presidente@exemplo.com",
      //   normalizedEmail: "PRESIDENTE@EXEMPLO.COM",
      //   emailConfirmed: true,
      //   passwordHash:
      //     "AQAAAAIAAYagAAAAEKCGuIORMeDoaMTPZl67TlTFWWgGnImrIhTY7OtN2M8Q2rECPG8pAR6OOJ9dENrmUA==",
      //   securityStamp: "EJ4ZPDEESYSKQDALEBZ6NNEDVEPXGQGI",
      //   concurrencyStamp: "80d9f748-1d10-432b-a5cb-546f4b206873",
      //   phoneNumber: "11877777777",
      //   phoneNumberConfirmed: true,
      //   twoFactorEnabled: false,
      //   lockoutEnd: null,
      //   lockoutEnabled: true,
      //   accessFailedCount: 0,
      // });
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    } finally {
      setLoading(false);
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
