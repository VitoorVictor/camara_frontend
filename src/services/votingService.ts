import { api } from "./api";

export interface VereadorVotante {
  id: string;
  nome: string;
}

export interface Voto {
  id: string;
  aprovadorId: string | null;
  dataHora: string;
  valor: string;
  votoConfirmado: boolean;
  vereadorVotante: VereadorVotante;
}

export interface VotosPorSessaoProjeto {
  votosAbstencao: number;
  votosFaltou: number;
  votosNao: number;
  votosSim: number;
  votosTotais: number;
  votos: Voto[];
}

/**
 * Serviço de votação
 */
export const votingService = {
  /**
   * Lista vereadores por votos em sessão-projeto
   */
  async listVereadoresByVotosInSessaoProjeto(
    sessaoProjetoId: string
  ): Promise<VotosPorSessaoProjeto> {
    const { data } = await api.get<VotosPorSessaoProjeto>(
      `/SessaoProjeto/list-vereadores-by-votos-in-sessao-projeto?id=${sessaoProjetoId}`
    );
    return data;
  },

  /**
   * Vota em um projeto
   */
  async vote(
    projetoId: string,
    sessaoId: string,
    tipoVoto: "Sim" | "Nao" | "Abstencao"
  ): Promise<void> {
    await api.put(`/Projeto/votar-no-projeto`, {
      projetoId,
      sessaoId,
      tipoVoto,
    });
  },

  /**
   * Confirma um voto
   */
  async confirmVote(
    sessaoProjetoId: string,
    vereadorVotanteId: string
  ): Promise<void> {
    await api.put(`/Voto/confirmar-voto`, {
      sessaoProjetoId,
      vereadorVotanteId,
    });
  },

  /**
   * Confirma todos os votos de uma sessão-projeto
   */
  async confirmAllVotes(sessaoProjetoId: string): Promise<void> {
    await api.put(`/Voto/confirmar-todos-voto`, sessaoProjetoId);
  },

  /**
   * Verifica se o vereador já votou no projeto
   */
  async vereadorAlreadyVoteInProject(
    sessaoProjetoId: string
  ): Promise<boolean> {
    const { data } = await api.get<boolean>(
      `/Voto/vereador-already-vote-in-this-projeto?sessaoProjetoId=${sessaoProjetoId}`
    );
    return data;
  },

  /**
   * Busca o ID da sessão-projeto pelo projeto e sessão
   */
  async getSessaoProjetoId(
    projetoId: string,
    sessaoId: string
  ): Promise<string> {
    const { data } = await api.get<string>(
      `/SessaoProjeto/read-by-projeto-and-sessao?projetoId=${projetoId}&sessaoId=${sessaoId}`
    );
    return data;
  },
};
