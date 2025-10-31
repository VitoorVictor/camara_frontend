import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface SpinnerProps {
  size?: "small" | "large";
  color?: string;
  message?: string;
  style?: any;
}

export function Spinner({
  size = "large",
  color,
  message,
  style,
}: SpinnerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color || colors.primary} />
      {message && (
        <Text style={[styles.message, { color: colors.primaryText }]}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
  },
  message: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
});
