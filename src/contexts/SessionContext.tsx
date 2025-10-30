import React, { createContext, useContext, useEffect, useState } from "react";
import { SessaoStatusEnum } from "../enums/SessaoStatusEnum";
import { sessionsService } from "../services/sessionsService";

interface Session {
  id: string;
  nome: string;
  descricao: string;
  status: SessaoStatusEnum;
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

  const loadActiveSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const session = await sessionsService.getActiveSession();
      setActiveSession(session);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar sessão";
      setError(errorMessage);
      console.error("Erro ao carregar sessão ativa:", err);
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
