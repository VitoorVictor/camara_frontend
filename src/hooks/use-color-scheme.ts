import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

/**
 * Hook para detectar o esquema de cores do sistema
 * Por padrão, força o tema light para a aplicação
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const systemColorScheme = useRNColorScheme();

  // Sempre retorna 'light' até hidratar, depois usa o sistema ou força 'light'
  if (hasHydrated) {
    // Para forçar sempre light mode, descomente a linha abaixo:
    return "light";

    // Para usar o tema do sistema, use:
    // return systemColorScheme;
  }

  return "light";
}
