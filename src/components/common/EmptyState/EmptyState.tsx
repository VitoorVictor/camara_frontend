import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Tipo para os ícones disponíveis (baseado nas chaves do MAPPING)
type IconSymbolName =
  | "house.fill"
  | "paperplane.fill"
  | "chevron.left.forwardslash.chevron.right"
  | "chevron.right"
  | "folder.fill"
  | "checkmark.square.fill"
  | "hand.thumbsup.fill"
  | "bell"
  | "person.circle"
  | "magnifyingglass"
  | "chart.bar.fill"
  | "calendar"
  | "xmark"
  | "xmark.circle.fill"
  | "info.circle"
  | "clock"
  | "checkmark.circle";

interface EmptyStateProps {
  icon?: IconSymbolName;
  iconSize?: number;
  title: string;
  message: string;
}

export function EmptyState({
  icon = "info.circle",
  iconSize = 64,
  title,
  message,
}: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.emptyCard,
          {
            backgroundColor: "#ffffff",
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <IconSymbol name={icon} size={iconSize} color={colors.disabledText} />
        </View>
        <Text style={[styles.title, { color: colors.primaryText }]}>
          {title}
        </Text>
        <Text style={[styles.message, { color: colors.secondaryText }]}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  emptyCard: {
    width: "100%",
    maxWidth: 400,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  message: {
    fontSize: FontSizes.md,
    textAlign: "center",
    lineHeight: 22,
  },
});
