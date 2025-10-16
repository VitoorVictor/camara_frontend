/**
 * Cores e temas globais do aplicativo.
 * Definidas para modo claro (light) e escuro (dark).
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    // Cores principais
    primary: "#198754",
    secondary: "#0F5132",

    // Textos
    primaryText: "#111827",
    secondaryText: "#374151",
    disabledText: "#9CA3AF",

    // Interface
    background: "#F2F2F7",
    border: "#E5E7EB",
    hover: "#D1D5DB",
    inactive: "#D1D5DB",

    // Estados
    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",

    // Tabs (mantendo compatibilidade)
    tint: "#198754",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#198754",
  },
  dark: {
    // Cores principais
    primary: "#198754",
    secondary: "#0F5132",

    // Textos
    primaryText: "#111827",
    secondaryText: "#374151",
    disabledText: "#9CA3AF",

    // Interface
    background: "#F2F2F7",
    border: "#E5E7EB",
    hover: "#D1D5DB",
    inactive: "#D1D5DB",

    // Estados
    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",

    // Tabs (mantendo compatibilidade)
    tint: "#198754",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#198754",
  },
  // dark: {
  //   // Cores principais
  //   primary: "#22C55E",
  //   secondary: "#16A34A",

  //   // Textos
  //   primaryText: "#F9FAFB",
  //   secondaryText: "#E5E7EB",
  //   disabledText: "#6B7280",

  //   // Interface
  //   background: "#111827",
  //   border: "#374151",
  //   hover: "#4B5563",
  //   inactive: "#374151",

  //   // Estados
  //   success: "#22C55E",
  //   warning: "#FBBF24",
  //   error: "#EF4444",

  //   // Tabs (mantendo compatibilidade)
  //   tint: "#22C55E",
  //   icon: "#9BA1A6",
  //   tabIconDefault: "#9BA1A6",
  //   tabIconSelected: "#22C55E",
  // },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Espaçamentos consistentes
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Tamanhos de borda arredondada
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Tamanhos de fonte
export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

// Pesos de fonte
export const FontWeights = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};
