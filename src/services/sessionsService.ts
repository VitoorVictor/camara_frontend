import { api } from "./api";

// Tipos (você pode criar em types/ se preferir)
interface Session {
  id: string;
  title: string;
  date: string;
  status: "active" | "scheduled" | "finished";
  projectsCount: number;
}

interface CreateSessionData {
  title: string;
  date: string;
  description?: string;
}

/**
 * Serviço de sessões legislativas
 */
export const sessionsService = {
  /**
   * Lista todas as sessões
   */
  async getAll(): Promise<Session[]> {
    const { data } = await api.get<Session[]>("/sessions");
    return data;
  },

  /**
   * Busca uma sessão por ID
   */
  async getById(id: string): Promise<Session> {
    const { data } = await api.get<Session>(`/sessions/${id}`);
    return data;
  },

  /**
   * Cria uma nova sessão
   */
  async create(sessionData: CreateSessionData): Promise<Session> {
    const { data } = await api.post<Session>("/sessions", sessionData);
    return data;
  },

  /**
   * Atualiza uma sessão
   */
  async update(
    id: string,
    sessionData: Partial<CreateSessionData>
  ): Promise<Session> {
    const { data } = await api.put<Session>(`/sessions/${id}`, sessionData);
    return data;
  },

  /**
   * Deleta uma sessão
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/sessions/${id}`);
  },

  /**
   * Busca sessões ativas
   */
  async getActive(): Promise<Session[]> {
    const { data } = await api.get<Session[]>("/sessions?status=active");
    return data;
  },

  /**
   * Inicia uma sessão
   */
  async start(id: string): Promise<Session> {
    const { data } = await api.post<Session>(`/sessions/${id}/start`);
    return data;
  },

  /**
   * Finaliza uma sessão
   */
  async finish(id: string): Promise<Session> {
    const { data } = await api.post<Session>(`/sessions/${id}/finish`);
    return data;
  },
};
