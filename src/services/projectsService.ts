import { api } from "./api";

// Tipos (você pode criar em types/ se preferir)
interface Project {
  id: string;
  number: string;
  title: string;
  description: string;
  status: "pending" | "voting" | "approved" | "rejected";
  author: string;
  createdAt: string;
}

interface CreateProjectData {
  number: string;
  title: string;
  description: string;
  author: string;
}

interface Vote {
  projectId: string;
  vote: "yes" | "no" | "abstain";
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
   * Cria um novo projeto
   */
  async create(projectData: CreateProjectData): Promise<Project> {
    const { data } = await api.post<Project>("/projects", projectData);
    return data;
  },

  /**
   * Atualiza um projeto
   */
  async update(
    id: string,
    projectData: Partial<CreateProjectData>
  ): Promise<Project> {
    const { data } = await api.put<Project>(`/projects/${id}`, projectData);
    return data;
  },

  /**
   * Deleta um projeto
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  /**
   * Busca projetos por status
   */
  async getByStatus(status: string): Promise<Project[]> {
    const { data } = await api.get<Project[]>(`/projects?status=${status}`);
    return data;
  },

  /**
   * Registra um voto em um projeto
   */
  async vote(voteData: Vote): Promise<void> {
    await api.post("/projects/vote", voteData);
  },

  /**
   * Busca projetos em votação
   */
  async getVoting(): Promise<Project[]> {
    return this.getByStatus("voting");
  },

  /**
   * Busca resultados de votação de um projeto
   */
  async getResults(id: string): Promise<any> {
    const { data } = await api.get(`/projects/${id}/results`);
    return data;
  },
};
