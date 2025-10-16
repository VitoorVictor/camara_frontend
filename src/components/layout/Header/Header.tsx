import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  userRole?: string;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export function Header({
  userRole = "Vereador",
  onNotificationPress,
  onProfilePress,
}: HeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <View style={[styles.container, { backgroundColor: colors.secondary }]}>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <IconSymbol name="bell" size={32} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.roleText}>Papel do Usuário</Text>
          <Text style={styles.userText}>{userRole}</Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <IconSymbol name="person.circle" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.xl  + 20,
    padding: Spacing.md,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    padding: Spacing.xs,
  },
  userInfo: {
    alignItems: "center",
  },
  roleText: {
    fontSize: FontSizes.sm,
    color: "#ffffff",
    fontWeight: FontWeights.normal,
  },
  userText: {
    fontSize: FontSizes.lg,
    color: "#ffffff",
    fontWeight: FontWeights.bold,
    marginTop: 2,
  },
});
