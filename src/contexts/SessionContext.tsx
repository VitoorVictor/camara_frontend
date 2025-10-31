import React, { createContext, useContext, useEffect, useState } from "react";
import { sessionsService } from "../services/sessionsService";

interface Session {
  id: string;
  nome: string;
  descricao: string;
  status: string;
  data: string;
  abertoEm: string;
  encerradoEm: string;
}

interface SessionContextData {
  activeSession: Session | null;
  loading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextData | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para verificar se a sessão é válida (não é uma sessão vazia/inativa)
  const isValidSession = (session: Session | null): boolean => {
    if (!session) return false;

    // Verifica se é uma sessão vazia (retornada quando não há sessão ativa)
    // A API retorna um objeto com valores default quando não há sessão ativa
    const isEmptySession =
      session.id === "00000000-0000-0000-0000-000000000000" ||
      !session.nome ||
      session.nome === null ||
      session.data === "0001-01-01T00:00:00" ||
      (session.status !== "EmAndamento" && session.abertoEm === null);

    return !isEmptySession;
  };

  const loadActiveSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const session = await sessionsService.getActiveSession();

      // Verifica se a sessão retornada é válida
      if (isValidSession(session)) {
        setActiveSession(session);
      } else {
        // Sessão vazia ou inválida = não há sessão ativa
        setActiveSession(null);
        setError(null);
      }
    } catch (err: any) {
      // Verifica se é um erro 404 (sessão não encontrada) ou se a mensagem indica isso
      // Como o interceptor transforma erros, precisamos verificar de diferentes formas
      const isNotFound =
        err?.response?.status === 404 ||
        err?.message?.includes("404") ||
        err?.message?.toLowerCase().includes("não encontrado") ||
        err?.message?.toLowerCase().includes("not found") ||
        err?.message?.toLowerCase().includes("sessao inativa");

      if (isNotFound) {
        // Se não houver sessão ativa, não é erro, apenas não há sessão
        setActiveSession(null);
        setError(null);
      } else {
        // Outros erros são tratados como erro real
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar sessão";
        setError(errorMessage);
        console.error("Erro ao carregar sessão ativa:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        activeSession,
        loading,
        error,
        refreshSession: loadActiveSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession deve ser usado dentro de um SessionProvider");
  }
  return context;
}
