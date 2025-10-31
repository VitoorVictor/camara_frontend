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

    // // Mock temporário
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve([
    //       {
    //         id: "1",
    //         criadoEm: "2024-01-15T10:00:00",
    //         titulo: "Projeto de Lei nº 001/2024",
    //         descricao:
    //           "Institui o plano de ação para melhoria da infraestrutura municipal",
    //         status: ProjetoStatusEnum.EmVotacao,
    //         aprovado: false,
    //         autorId: "10",
    //         autorNome: "João",
    //         autorSobrenome: "Silva",
    //       },
    //       {
    //         id: "2",
    //         criadoEm: "2024-01-15T10:30:00",
    //         titulo: "Projeto de Lei nº 002/2024",
    //         descricao: "Cria o programa de incentivo à reciclagem no município",
    //         status: ProjetoStatusEnum.Apresentado,
    //         aprovado: false,
    //         autorId: "11",
    //         autorNome: "Maria",
    //         autorSobrenome: "Santos",
    //       },
    //       {
    //         id: "3",
    //         criadoEm: "2024-01-15T11:00:00",
    //         titulo: "Projeto de Lei nº 003/2024",
    //         descricao:
    //           "Regulamenta o uso de bicicletas compartilhadas na cidade",
    //         status: ProjetoStatusEnum.EmVotacao,
    //         aprovado: false,
    //         autorId: "12",
    //         autorNome: "Pedro",
    //         autorSobrenome: "Oliveira",
    //       },
    //     ]);
    //   }, 500);
    // });
  },
};
