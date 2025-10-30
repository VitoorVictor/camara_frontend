import { SessaoStatusEnum } from "../enums/SessaoStatusEnum";
import { api } from "./api";

export interface Session {
  id: string;
  nome: string;
  descricao: string;
  status: SessaoStatusEnum;
  data: string;
  abertoEm: string;
  encerradoEm: string;
}

export interface ListSessionsParams {
  nome?: string;
  data?: string;
  status?: SessaoStatusEnum;
}

export const sessionsService = {
  /**
   * Lista todas as sessões
   */
  // async getAll(): Promise<Session[]> {
  //   const { data } = await api.get<Session[]>("/sessions");
  //   return data;
  // },

  // /**
  //  * Busca uma sessão por ID
  //  */
  // async getById(id: string): Promise<Session> {
  //   const { data } = await api.get<Session>(`/sessions/${id}`);
  //   return data;
  // },

  /**
   * Busca sessão em andamento
   */
  async getActiveSession(): Promise<Session> {
    // TODO: Descomentar quando API estiver pronta
    // const { data } = await api.get<Session>("/sessao/get-sessao-em-andamento");
    // return data;

    // Mock temporário
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "1",
          nome: "Sessão Ordinária - Janeiro 2024",
          descricao:
            "Sessão para votação de projetos ordinários do mês de janeiro",
          status: SessaoStatusEnum.EmAndamento,
          data: "2024-01-15",
          abertoEm: "2024-01-15T10:00:00",
          encerradoEm: "2024-01-15T12:00:00",
        });
      }, 500);
    });
  },

  /**
   * Inicia uma sessão
   */
  async start(id: string): Promise<Session> {
    const { data } = await api.put<Session>(`/sessao/abrir-sessao`, { id });
    return data;
  },

  /**
   * Lista todas as sessões da câmara com filtros
   */
  async listByCamara(params?: ListSessionsParams): Promise<Session[]> {
    // TODO: Descomentar quando API estiver pronta
    // const { data } = await api.get<Session[]>("/sessao/list-by-camara", {
    //   params,
    // });
    // return data;

    // Mock temporário
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockSessions: Session[] = [
          {
            id: "1",
            nome: "Sessão Ordinária - Janeiro 2024",
            descricao:
              "Sessão para votação de projetos ordinários do mês de janeiro",
            status: SessaoStatusEnum.EmAndamento,
            data: "2024-01-15",
            abertoEm: "2024-01-15T10:00:00",
            encerradoEm: "2024-01-15T12:00:00",
          },
          {
            id: "2",
            nome: "Sessão Extraordinária - Fevereiro 2024",
            descricao:
              "Discussão e votação de projeto de lei complementar sobre orçamento",
            status: SessaoStatusEnum.Agendada,
            data: "2024-02-10",
            abertoEm: "2024-02-10T09:00:00",
            encerradoEm: "2024-02-10T11:00:00",
          },
          {
            id: "3",
            nome: "Sessão Ordinária - Dezembro 2023",
            descricao: "Sessão ordinária semanal com pauta geral",
            status: SessaoStatusEnum.Encerrada,
            data: "2023-12-20",
            abertoEm: "2023-12-20T14:00:00",
            encerradoEm: "2023-12-20T16:00:00",
          },
          {
            id: "4",
            nome: "Sessão Extraordinária - Novembro 2023",
            descricao:
              "Votação de projetos de lei municipais e debates sobre a ordem do dia",
            status: SessaoStatusEnum.Cancelada,
            data: "2023-11-25",
            abertoEm: "2023-11-25T10:00:00",
            encerradoEm: "2023-11-25T12:00:00",
          },
        ];

        // Aplicar filtros
        let filtered = mockSessions;
        if (params) {
          if (params.nome) {
            filtered = filtered.filter((s) =>
              s.nome.toLowerCase().includes(params.nome!.toLowerCase())
            );
          }
          if (params.data) {
            filtered = filtered.filter((s) => s.data === params.data);
          }
          if (params.status !== undefined) {
            filtered = filtered.filter((s) => s.status === params.status);
          }
        }

        resolve(filtered);
      }, 500);
    });
  },

  /**
   * Finaliza uma sessão
   */
  async finish(id: string): Promise<Session> {
    const { data } = await api.put<Session>(`/sessao/encerrar-sessao`, { id });
    return data;
  },
};
