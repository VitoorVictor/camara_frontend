import { api } from "./api";

export interface Session {
  id: string;
  nome: string;
  descricao: string;
  status: string;
  data: string;
  abertoEm: string;
  encerradoEm: string;
}

export interface InfiniteRollSessionsResponse {
  items: Session[];
  totalCount: number;
  hasMore: boolean;
  offset: number;
}

export interface ListSessionsParams {
  nome?: string;
  data?: string;
  status?: string;
}

export const sessionsService = {
  /**
   * Busca sessão em andamento
   */
  async getActiveSession(): Promise<Session> {
    const { data } = await api.get<Session>("/sessao/get-sessao-em-andamento");
    return data;
  },

  /**
   * Lista todas as sessões da câmara com filtros
   */
  async listByCamara(
    limit: number,
    offset: number,
    params?: ListSessionsParams
  ): Promise<InfiniteRollSessionsResponse> {
    const queryParts: string[] = [];

    queryParts.push(`limit=${limit}`);
    queryParts.push(`offset=${offset}`);
    if (params?.nome) {
      queryParts.push(`nome=${encodeURIComponent(params.nome)}`);
    }
    if (params?.data) {
      queryParts.push(`data=${encodeURIComponent(params.data)}`);
    }
    if (params?.status) {
      queryParts.push(`status=${encodeURIComponent(params.status)}`);
    }

    const queryString = queryParts.join("&");
    const { data } = await api.get<InfiniteRollSessionsResponse>(
      `/sessao/infinite-roll-by-camara?${queryString}`
    );
    return data;
  },

  /**
   * Inicia uma sessão
   */
  async start(id: string): Promise<Session> {
    const { data } = await api.put<Session>(`/sessao/abrir-sessao`, id);
    return data;
  },

  /**
   * Finaliza uma sessão
   */
  async finish(id: string): Promise<Session> {
    const { data } = await api.put<Session>(`/sessao/encerrar-sessao`, id);
    return data;
  },
};
