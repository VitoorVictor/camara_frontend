import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { authService } from "@/services/authService";
import { CamaraDTO, CurrentUser, LoginResponse } from "@/types/api.types";

interface AuthContextData {
  user: CurrentUser | null;
  camara: CamaraDTO | null;
  loading: boolean;
  signIn: (
    userName: string,
    password: string
  ) => Promise<{ passwordReseted: boolean }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  nome: string | null;
  presidente: boolean | null;
  changePassword: (password: string, confirmPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [camara, setCamara] = useState<CamaraDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Extrai nome e presidente do user para facilitar acesso
  const nome = user?.nome || null;
  const presidente = user?.presidente ?? null;

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
        const storedCamara = await authService.getCamaraData();
        if (storedUser) {
          // Verifica se precisa alterar a senha (persistente após refresh)
          const passwordReseted = await authService.isPasswordReseted();
          if (passwordReseted) {
            await authService.logout();
            setUser(null);
            setCamara(null);
            return;
          }

          setUser(storedUser);
          setCamara(storedCamara);
        } else {
          // Se não houver dados do usuário mas o token existe, limpa tudo
          await authService.logout();
        }
      } else {
        // Token inválido ou expirado, limpa os dados
        await authService.logout();
        setUser(null);
        setCamara(null);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      // Em caso de erro, limpa os dados para garantir segurança
      await authService.logout();
      setUser(null);
      setCamara(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(
    userName: string,
    password: string
  ): Promise<{ passwordReseted: boolean }> {
    try {
      setLoading(true);
      const response = await authService.login({ userName, password });
      // Mescla os dados do currentUser com nome e presidente do LoginResponse
      const userData = {
        ...response.currentUser,
        nome: response.nome || response.currentUser.nome,
        presidente: response.presidente ?? response.currentUser.presidente,
      };
      if (!response.passwordReseted) {
        setUser(userData);
        setCamara(response.camaraDTO);
      } else {
        setUser(null);
        setCamara(null);
      }
      return { passwordReseted: response.passwordReseted };
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await authService.changePassword({ password, confirmPassword });
    // Faz logout após alterar a senha com sucesso
    await signOut();
  }

  async function signOut() {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setCamara(null);
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
        camara,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
        nome,
        presidente,
        changePassword,
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
