import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Header } from "@/components/layout/Header";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function VotingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const isPresident = false; // Para mostrar o header de vereador

  const handleNotificationPress = () => {
    Alert.alert("Notificações", "Você tem 3 novas notificações");
  };

  const handleProfilePress = () => {
    Alert.alert("Perfil", "Abrir perfil do usuário");
  };

  const handleVote = (voteType: "approve" | "reject" | "abstain") => {
    Alert.alert(
      "Voto Registrado",
      `Seu voto foi registrado: ${
        voteType === "approve"
          ? "Aprovar"
          : voteType === "reject"
          ? "Rejeitar"
          : "Abster-se"
      }`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.secondary }]}>
      <View style={styles.topSection}>
        <View style={styles.decorativeElements}>
          <View style={styles.bar1} />
          <View style={styles.bar2} />
          <View style={styles.bar3} />
        </View>

        <Header
          userRole={isPresident ? "Presidente" : "Vereador"}
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
        />

        <View style={styles.topContent}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Votação</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={[styles.bottomSection, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.proposalInstruction}>
          Utilize os botões abaixo para registrar seu voto
        </Text>

        <View style={styles.proposalCard}>
          <View style={styles.contentSection}>
            <Text style={styles.proposalTitle}>Projeto Escola Conectada</Text>

            <Text style={styles.proposalDescription}>
              Implantação de internet de alta velocidade em todas as escolas
              municipais
            </Text>
          </View>

          <View style={styles.votingButtons}>
            <TouchableOpacity
              style={[styles.voteButton, styles.approveButton]}
              onPress={() => handleVote("approve")}
            >
              <Ionicons name="checkmark" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>Aprovar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.voteButton, styles.rejectButton]}
              onPress={() => handleVote("reject")}
            >
              <Ionicons name="close" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>Rejeitar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.voteButton, styles.abstainButton]}
              onPress={() => handleVote("abstain")}
            >
              <Ionicons name="remove" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>Abster-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    height: "50%",
    justifyContent: "space-between",
    position: "relative",
  },
  decorativeElements: {
    position: "absolute",
    bottom: "-5%",
    left: "50%",
    transform: [{ translateX: -120 }],
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 24,
  },
  bar1: {
    width: 64,
    height: 192,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderRadius: 16,
  },
  bar2: {
    width: 64,
    height: 256,
    backgroundColor: "rgba(34, 197, 94, 0.25)",
    borderRadius: 16,
  },
  bar3: {
    width: 64,
    height: 144,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderRadius: 16,
  },
  topContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  greeting: {
    paddingHorizontal: Spacing.md,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  bottomSection: {
    height: "50%",
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  contentContainer: {
    padding: Spacing.md,
    flexGrow: 1,
  },
  proposalCard: {
    backgroundColor: "#ffffff",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "space-between",
  },
  contentSection: {
    flex: 1,
    justifyContent: "flex-start",
  },
  proposalInstruction: {
    fontSize: FontSizes.xs,
    color: "#9CA3AF",
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontStyle: "italic",
    opacity: 0.8,
  },
  proposalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: "#198754",
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  proposalDescription: {
    fontSize: FontSizes.md,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  votingButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  voteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  approveButton: {
    backgroundColor: "#198754",
  },
  rejectButton: {
    backgroundColor: "#DC2626",
  },
  abstainButton: {
    backgroundColor: "#F59E0B",
  },
  buttonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
});
