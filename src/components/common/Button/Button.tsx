import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  style,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  const getButtonStyle = (): ViewStyle => {
    if (disabled) {
      return {
        backgroundColor: colors.inactive,
        opacity: 0.5,
      };
    }

    switch (variant) {
      case "primary":
        return { backgroundColor: colors.primary };
      case "secondary":
        return { backgroundColor: colors.secondary };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: colors.primary,
        };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getTextColor = (): string => {
    if (disabled) {
      return colors.disabledText;
    }
    return variant === "outline" ? colors.primary : "#ffffff";
  };

  const buttonStyle = [
    styles.base,
    getButtonStyle(),
    styles[`size_${size}`],
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`text_size_${size}`],
    { color: getTextColor() },
  ] as TextStyle[];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? colors.primary : "#ffffff"}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.md,
  },
  size_sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minHeight: 40,
  },
  size_md: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minHeight: 50,
  },
  size_lg: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    minHeight: 60,
  },
  text: {
    fontWeight: FontWeights.semibold,
  },
  text_size_sm: {
    fontSize: FontSizes.sm,
  },
  text_size_md: {
    fontSize: FontSizes.md,
  },
  text_size_lg: {
    fontSize: FontSizes.lg,
  },
});
