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
    tipoVoto: "Sim" | "Não" | "Abstenção"
  ): Promise<void> {
    await api.put(`/projeto/votar-no-projeto`, {
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
    await api.put(`/voto/confirmar-voto`, {
      sessaoProjetoId,
      vereadorVotanteId,
    });
  },
};
