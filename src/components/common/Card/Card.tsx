import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";

interface CardProps extends ViewProps {
  variant?: "default" | "elevated" | "outlined";
  style?: ViewStyle;
}

export function Card({
  children,
  variant = "default",
  style,
  ...props
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  const getVariantStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.background,
    };

    switch (variant) {
      case "elevated":
        return {
          ...baseStyle,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        };
      case "outlined":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <View style={[styles.base, getVariantStyle(), style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
});
