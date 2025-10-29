import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  BorderRadius,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const { signIn, loading } = useAuth();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!userName.trim() || !password.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }
    try {
      await signIn(userName, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Erro no Login", error.message || "Erro ao fazer login");
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Recuperar Senha", "Funcionalidade em desenvolvimento");
  };

  const handleTermsPress = () => {
    Alert.alert("Termos de Uso", "Abrir termos de uso");
  };

  const handlePrivacyPress = () => {
    Alert.alert("Política de Privacidade", "Abrir política de privacidade");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo e Título */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBars}>
              <View style={styles.bar1} />
              <View style={styles.bar2} />
              <View style={styles.bar3} />
            </View>
            <Text style={styles.logoText}>
              <Text style={styles.logoTextPrimary}>Câmara</Text>
              <Text style={styles.logoTextSecondary}> Digital</Text>
            </Text>
          </View>

          <Text style={styles.welcomeTitle}>Bem-vindo a Câmara Digital</Text>
          <Text style={styles.welcomeSubtitle}>
            Acesse sua conta para gerenciar projetos e tarefas.
          </Text>
        </View>

        {/* Formulário de Login */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder="Entre com seu usuário"
              placeholderTextColor="#9CA3AF"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder="Entre com sua senha"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Esqueceu a senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Termos Legais */}
        <View style={styles.legalSection}>
          <Text style={styles.legalText}>
            Ao entrar, você concorda com nossos{" "}
            <Text style={styles.legalLink} onPress={handleTermsPress}>
              Termos de Uso
            </Text>{" "}
            e{" "}
            <Text style={styles.legalLink} onPress={handlePrivacyPress}>
              Política de Privacidade
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  logoBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: Spacing.sm,
  },
  bar1: {
    width: 8,
    height: 24,
    backgroundColor: "#0F5132",
    borderRadius: 4,
  },
  bar2: {
    width: 8,
    height: 32,
    backgroundColor: "#0F5132",
    borderRadius: 4,
  },
  bar3: {
    width: 8,
    height: 20,
    backgroundColor: "#0F5132",
    borderRadius: 4,
  },
  logoText: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  logoTextPrimary: {
    color: "#0F5132",
  },
  logoTextSecondary: {
    color: "#198754",
  },
  welcomeTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: "#111827",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: FontSizes.md,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md,
    color: "#111827",
    marginLeft: Spacing.sm,
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-start",
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: FontSizes.sm,
    color: "#6B7280",
  },
  loginButton: {
    backgroundColor: "#198754",
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  loginButtonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
  legalSection: {
    alignItems: "center",
  },
  legalText: {
    fontSize: FontSizes.sm,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  legalLink: {
    textDecorationLine: "underline",
    color: "#198754",
  },
});
