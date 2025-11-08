import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChangePasswordModalProps {
  visible: boolean;
  onSuccess: () => void;
  onChangePassword: (
    password: string,
    confirmPassword: string
  ) => Promise<void>;
}

export function ChangePasswordModal({
  visible,
  onSuccess,
  onChangePassword,
}: ChangePasswordModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password || password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    } else if (!/\d/.test(password)) {
      newErrors.password = "A senha deve conter pelo menos um número";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "A senha deve conter pelo menos uma letra maiúscula";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "A senha deve conter pelo menos uma letra minúscula";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password =
        "A senha deve conter pelo menos um caractere especial";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirme sua senha";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onChangePassword(password, confirmPassword);
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      handleReset();
      onSuccess();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Erro ao alterar a senha. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <IconSymbol
                name="exclamationmark.triangle.fill"
                size={48}
                color={colors.warning || "#F59E0B"}
              />
            </View>
            <Text style={[styles.title, { color: colors.primaryText }]}>
              Alteração de Senha Obrigatória
            </Text>
            <Text style={[styles.message, { color: colors.secondaryText }]}>
              Por segurança, é necessário alterar sua senha no primeiro acesso.
              Por favor, defina uma nova senha.
            </Text>
            <View
              style={[
                styles.helpBox,
                {
                  backgroundColor: colors.primary + "10",
                  borderColor: colors.primary + "30",
                },
              ]}
            >
              <IconSymbol
                name="info.circle.fill"
                size={16}
                color={colors.primary}
              />
              <Text style={[styles.helpText, { color: colors.secondaryText }]}>
                A senha deve ter no mínimo 6 caracteres, incluir letras
                maiúsculas e minúsculas, pelo menos um número e um caractere
                especial.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.secondaryText }]}>
                  Nova Senha
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: errors.password ? colors.error : "#E5E7EB",
                    },
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.primaryText }]}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) {
                        setErrors({ ...errors, password: undefined });
                      }
                    }}
                    placeholder="Nova senha"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {errors.password}
                  </Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.secondaryText }]}>
                  Confirmar Senha
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: errors.confirmPassword
                        ? colors.error
                        : "#E5E7EB",
                    },
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.primaryText }]}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: undefined });
                      }
                    }}
                    placeholder="Confirme sua senha"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {errors.confirmPassword}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                {
                  backgroundColor: colors.primary,
                  opacity: loading ? 0.6 : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <Text style={styles.buttonText}>Alterando...</Text>
              ) : (
                <>
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={20}
                    color="#9CA3AF"
                  />
                  <Text style={styles.buttonText}>Alterar Senha</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  content: {
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: FontSizes.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  helpBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  helpText: {
    fontSize: FontSizes.xs,
    flex: 1,
    lineHeight: 16,
  },
  form: {
    gap: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md,
    marginLeft: Spacing.xs,
  },
  eyeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  buttonsContainer: {
    gap: Spacing.sm,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  submitButton: {
    // Estilo será aplicado dinamicamente
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: "#ffffff",
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
});
