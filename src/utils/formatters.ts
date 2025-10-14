/**
 * Funções utilitárias para formatação de dados
 */

/**
 * Formata data para formato brasileiro
 * @param date - Data a ser formatada
 * @param includeTime - Se deve incluir hora
 */
export function formatDate(date: string | Date, includeTime = false): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  return dateObj.toLocaleDateString("pt-BR", options);
}

/**
 * Formata valor monetário para formato brasileiro
 * @param value - Valor a ser formatado
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formata CPF
 * @param cpf - CPF a ser formatado
 */
export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Formata telefone
 * @param phone - Telefone a ser formatado
 */
export function formatPhone(phone: string): string {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");

  // Formata conforme o tamanho
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return phone;
}

/**
 * Trunca texto e adiciona reticências
 * @param text - Texto a ser truncado
 * @param maxLength - Tamanho máximo
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Capitaliza primeira letra
 * @param text - Texto a ser capitalizado
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
