import { api } from "./api";

// Tipos
export interface Project {
  id: string;
  criadoEm: string;
  titulo: string;
  descricao: string;
  status: string;
  aprovado: boolean;
  autorId: string;
  autorNome: string;
  autorSobrenome: string;
}

/**
 * Serviço de projetos de lei
 */
export const projectsService = {
  /**
   * Lista todos os projetos
   */
  async getAll(): Promise<Project[]> {
    const { data } = await api.get<Project[]>("/projects");
    return data;
  },

  /**
   * Busca um projeto por ID
   */
  async getById(id: string): Promise<Project> {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
  },

  /**
   * Lista projetos por sessão
   */
  async getBySession(sessionId: string): Promise<Project[]> {
    // TODO: Descomentar quando API estiver pronta
    const { data } = await api.get<Project[]>(
      `/sessao/list-projetos-by-sessao?id=${sessionId}`
    );
    return data;
  },

  /**
   * Atualiza o status de um projeto
   */
  async updateStatus(projetoId: string, status: string): Promise<void> {
    await api.put(`/projeto/update-projeto-status-by-current-vereador`, {
      projetoId,
      status,
    });
  },

  /**
   * Vota em um projeto
   */
  async vote(
    projetoId: string,
    sessaoId: string,
    tipoVoto: "Sim" | "Não" | "Abstenção"
  ): Promise<void> {
    await api.put(`/projeto/votar-no-projeto`, {
      projetoId,
      sessaoId,
      tipoVoto,
    });
  },
};
