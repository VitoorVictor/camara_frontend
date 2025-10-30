export enum SessaoStatusEnum {
  Cancelada = 0,
  Encerrada = 1,
  EmAndamento = 2,
  Agendada = 3,
}

// Função helper para converter do número do backend para o status
export function getSessaoStatusFromNumber(
  num: number
): SessaoStatusEnum | undefined {
  return Object.values(SessaoStatusEnum).includes(num)
    ? (num as SessaoStatusEnum)
    : undefined;
}

// Função helper para obter a label do status
export function getSessaoStatusLabel(status: SessaoStatusEnum): string {
  const labels: Record<SessaoStatusEnum, string> = {
    [SessaoStatusEnum.Cancelada]: "Cancelada",
    [SessaoStatusEnum.Encerrada]: "Encerrada",
    [SessaoStatusEnum.EmAndamento]: "Em Andamento",
    [SessaoStatusEnum.Agendada]: "Agendada",
  };
  return labels[status] || "Desconhecido";
}
