import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export function Input({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  ...props
}: InputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.secondaryText }]}>
          {label}
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            borderColor: error ? colors.error : colors.border,
            color: colors.primaryText,
          },
          inputStyle,
        ]}
        placeholderTextColor={colors.disabledText}
        {...props}
      />

      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}

      {helperText && !error && (
        <Text style={[styles.helperText, { color: colors.secondaryText }]}>
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  input: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    borderWidth: 1,
  },
  errorText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  helperText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
});
