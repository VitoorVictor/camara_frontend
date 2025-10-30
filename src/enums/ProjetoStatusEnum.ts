export enum ProjetoStatusEnum {
  Apresentado = 0,
  EmVotacao = 1,
  Aprovado = 2,
  Rejeitado = 3,
  Cancelado = 4,
}

// Função helper para converter do número do backend para o status
export function getProjetoStatusFromNumber(
  num: number
): ProjetoStatusEnum | undefined {
  return Object.values(ProjetoStatusEnum).includes(num)
    ? (num as ProjetoStatusEnum)
    : undefined;
}

// Função helper para obter a label do status
export function getProjetoStatusLabel(status: ProjetoStatusEnum): string {
  const labels: Record<ProjetoStatusEnum, string> = {
    [ProjetoStatusEnum.Apresentado]: "Apresentado",
    [ProjetoStatusEnum.EmVotacao]: "Em Votação",
    [ProjetoStatusEnum.Aprovado]: "Aprovado",
    [ProjetoStatusEnum.Rejeitado]: "Rejeitado",
    [ProjetoStatusEnum.Cancelado]: "Cancelado",
  };
  return labels[status] || "Desconhecido";
}
