import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

type ColorScheme = "light" | "dark";

/**
 * Hook personalizado para gerenciar o tema da aplicação
 * Por padrão, força o tema light, mas permite alternar
 */
export function useAppTheme() {
  const systemColorScheme = useRNColorScheme();
  const [appTheme, setAppTheme] = useState<ColorScheme>("light"); // Força light como padrão
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const toggleTheme = () => {
    setAppTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (theme: ColorScheme) => {
    setAppTheme(theme);
  };

  // Retorna sempre 'light' até hidratar, depois usa o tema da app
  const currentTheme = hasHydrated ? appTheme : "light";

  return {
    colorScheme: currentTheme,
    systemColorScheme,
    toggleTheme,
    setTheme,
    isLight: currentTheme === "light",
    isDark: currentTheme === "dark",
  };
}
