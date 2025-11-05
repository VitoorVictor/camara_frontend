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
    const { data } = await api.get<Project[]>("/Projects");
    return data;
  },

  /**
   * Busca um projeto por ID
   */
  async getById(id: string): Promise<Project> {
    const { data } = await api.get<Project>(`/Projects/${id}`);
    return data;
  },

  /**
   * Lista projetos por sessão
   */
  async getBySession(sessionId: string): Promise<Project[]> {
    // TODO: Descomentar quando API estiver pronta
    const { data } = await api.get<Project[]>(
      `/Sessao/list-projetos-by-sessao?id=${sessionId}`
    );
    return data;
  },

  /**
   * Busca projeto com status EmVotacao
   */
  async getByStatusEmVotacao(): Promise<Project | null> {
    const { data } = await api.get<Project>(
      `/Projeto/read-by-status-em-votacao`
    );
    return data || null;
  },

  /**
   * Atualiza o status de um projeto
   */
  async updateStatus(projetoId: string, status: string): Promise<void> {
    await api.put(`/Projeto/update-projeto-status-by-current-vereador`, {
      projetoId,
      status,
    });
  },
};
