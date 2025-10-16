import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { SFSymbol } from "expo-symbols";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionCardProps {
  title: string;
  subtitle: string;
  iconName: SFSymbol;
  onPress?: () => void;
  style?: any;
}

export function ActionCard({
  title,
  subtitle,
  iconName,
  onPress,
  style,
}: ActionCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View
          style={[styles.iconContainer, { backgroundColor: colors.primary }]}
        >
          <IconSymbol name={iconName} size={24} color="#ffffff" />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.primary }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            {subtitle}
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <Text style={[styles.actionText, { color: colors.primary }]}>
            Acessar
          </Text>
          <View
            style={[styles.actionIcon, { backgroundColor: colors.primary }]}
          >
            <IconSymbol name="chevron.right" size={16} color="#ffffff" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: Spacing.md,
    backgroundColor: "#ffffff",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.normal,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  actionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  actionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
