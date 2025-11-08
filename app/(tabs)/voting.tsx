import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/Spinner";
import { Header } from "@/components/layout/Header";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useSession } from "@/contexts/SessionContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Project, projectsService } from "@/services/projectsService";
import { votingService } from "@/services/votingService";
import { useAuth } from "@/src/contexts/AuthContext";
import { router } from "expo-router";

export default function VotingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const { activeSession, loading: sessionLoading } = useSession();
  const { presidente } = useAuth();
  const [votingProject, setVotingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60); // Timer de 60 segundos
  const [timerActive, setTimerActive] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [checkingVote, setCheckingVote] = useState(false);
  const [sessaoProjetoId, setSessaoProjetoId] = useState<string | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    voteType: "approve" | "reject" | "abstain" | null;
  }>({
    visible: false,
    title: "",
    message: "",
    voteType: null,
  });

  // Busca projeto em votação
  useEffect(() => {
    if (activeSession?.id && activeSession.status === "EmAndamento") {
      loadVotingProject();
    }
  }, [activeSession?.id, activeSession?.status]);

  // Verifica se já votou quando o projeto e sessaoProjetoId são carregados
  useEffect(() => {
    if (votingProject?.id && sessaoProjetoId) {
      checkIfAlreadyVoted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [votingProject?.id, sessaoProjetoId]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const loadVotingProject = async () => {
    if (!activeSession?.id) return;

    try {
      setLoading(true);
      const projectInVoting = await projectsService.getByStatusEmVotacao();

      if (
        projectInVoting &&
        projectInVoting.id !== "00000000-0000-0000-0000-000000000000"
      ) {
        setVotingProject(projectInVoting);
        setTimer(60); // Inicia timer de 1 minuto
        setTimerActive(true);
        setAlreadyVoted(false); // Reset do estado ao carregar novo projeto

        // Busca o sessaoProjetoId
        try {
          const sessaoProjetoIdResult = await votingService.getSessaoProjetoId(
            projectInVoting.id,
            activeSession.id
          );
          setSessaoProjetoId(sessaoProjetoIdResult);
        } catch (error) {
          console.error("Erro ao buscar sessaoProjetoId:", error);
          setSessaoProjetoId(null);
        }
      } else {
        setVotingProject(null);
        setAlreadyVoted(false);
        setSessaoProjetoId(null);
      }
    } catch (error) {
      console.error("Erro ao carregar projeto em votação:", error);
      setVotingProject(null);
      setAlreadyVoted(false);
      setSessaoProjetoId(null);
    } finally {
      setLoading(false);
    }
  };

  const checkIfAlreadyVoted = async () => {
    if (!votingProject || !sessaoProjetoId) return;

    try {
      setCheckingVote(true);
      const hasVoted = await votingService.vereadorAlreadyVoteInProject(
        sessaoProjetoId
      );
      setAlreadyVoted(hasVoted);
      if (hasVoted) {
        setTimerActive(false); // Para o timer se já votou
      }
    } catch (error) {
      console.error("Erro ao verificar se já votou:", error);
      // Em caso de erro, permite votar (assumindo que não votou)
      setAlreadyVoted(false);
    } finally {
      setCheckingVote(false);
    }
  };

  const handleNotificationPress = () => {
    Alert.alert("Notificações", "Você tem 3 novas notificações");
  };

  const handleProfilePress = () => {
    Alert.alert("Perfil", "Abrir perfil do usuário");
  };

  const handleVoteClick = (voteType: "approve" | "reject" | "abstain") => {
    const voteLabels = {
      approve: "Aprovar",
      reject: "Rejeitar",
      abstain: "Abster-se",
    };

    setConfirmationModal({
      visible: true,
      title: "Confirmar Voto",
      message: `Deseja confirmar seu voto: ${voteLabels[voteType]}?`,
      voteType,
    });
  };

  const handleCloseConfirmation = () => {
    setConfirmationModal({
      visible: false,
      title: "",
      message: "",
      voteType: null,
    });
  };

  const handleConfirmVote = async () => {
    const { voteType } = confirmationModal;
    if (!voteType || !votingProject || !activeSession?.id) return;

    try {
      // Mapeia o tipo de voto para o formato da API
      const tipoVotoMap: Record<
        "approve" | "reject" | "abstain",
        "Sim" | "Nao" | "Abstencao"
      > = {
        approve: "Sim",
        reject: "Nao",
        abstain: "Abstencao",
      };

      const tipoVoto = tipoVotoMap[voteType];

      // Chama a API para registrar o voto
      await votingService.vote(votingProject.id, activeSession.id, tipoVoto);

      handleCloseConfirmation();
      Alert.alert("Sucesso", "Seu voto foi registrado com sucesso!");

      // Verifica se já votou e atualiza o estado
      await checkIfAlreadyVoted();
      if (presidente) {
        router.push("/(stacks)/confirm-votes");
      }
    } catch (error: any) {
      console.error("Erro ao registrar voto:", error);
      Alert.alert(
        "Erro",
        error.message || "Erro ao registrar o voto. Tente novamente."
      );
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Mostra spinner enquanto carrega sessão
  if (sessionLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Spinner />
      </View>
    );
  }

  // Se não há sessão ativa
  if (!activeSession) {
    return (
      <View style={[styles.container, { backgroundColor: colors.secondary }]}>
        <View style={styles.topSection}>
          <Header
            userRole={presidente ? "Presidente" : "Vereador"}
            onNotificationPress={handleNotificationPress}
            onProfilePress={handleProfilePress}
          />
        </View>
        <View
          style={[styles.bottomSection, { backgroundColor: colors.background }]}
        >
          <EmptyState
            icon="calendar"
            title="Nenhuma Sessão em Andamento"
            message="Não há uma sessão em andamento no momento. Aguarde até que uma sessão seja aberta."
          />
        </View>
      </View>
    );
  }

  // Se está carregando projeto
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.secondary }]}>
        <View style={styles.topSection}>
          <Header
            userRole={presidente ? "Presidente" : "Vereador"}
            onNotificationPress={handleNotificationPress}
            onProfilePress={handleProfilePress}
          />
        </View>
        <View
          style={[styles.bottomSection, { backgroundColor: colors.background }]}
        >
          <Spinner />
        </View>
      </View>
    );
  }

  // Se não há projeto em votação
  if (!votingProject) {
    return (
      <View style={[styles.container, { backgroundColor: colors.secondary }]}>
        <View style={styles.topSection}>
          <Header
            userRole={presidente ? "Presidente" : "Vereador"}
            onNotificationPress={handleNotificationPress}
            onProfilePress={handleProfilePress}
          />
        </View>
        <View
          style={[styles.bottomSection, { backgroundColor: colors.background }]}
        >
          <EmptyState
            icon="clock"
            title="Aguardando Projetos para Votação"
            message="Não há projetos em votação no momento. Aguarde até que um projeto seja enviado para votação."
          />
        </View>
      </View>
    );
  }

  // Se já votou no projeto, mostra tela de aguardar
  if (alreadyVoted || checkingVote) {
    return (
      <View style={[styles.container, { backgroundColor: colors.secondary }]}>
        <View style={styles.topSection}>
          <Header
            userRole={presidente ? "Presidente" : "Vereador"}
            onNotificationPress={handleNotificationPress}
            onProfilePress={handleProfilePress}
          />
        </View>
        <View
          style={[styles.bottomSection, { backgroundColor: colors.background }]}
        >
          {checkingVote ? (
            <Spinner />
          ) : (
            <EmptyState
              icon="checkmark.circle"
              title="Voto Registrado"
              message="Você já registrou seu voto para este projeto. Aguarde a finalização da votação."
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.secondary }]}>
      <View style={styles.topSection}>
        <View style={styles.decorativeElements}>
          <View style={styles.bar1} />
          <View style={styles.bar2} />
          <View style={styles.bar3} />
        </View>

        <Header
          userRole={presidente ? "Presidente" : "Vereador"}
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
        />

        <View style={styles.topContent}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Votação</Text>
          </View>
          <View style={styles.timerContainer}>
            <View
              style={[styles.timerBadge, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="time-outline" size={16} color="#ffffff" />
              <Text style={styles.timerText}>{formatTimer(timer)}</Text>
            </View>
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
            <Text style={styles.proposalTitle}>{votingProject.titulo}</Text>

            <Text style={styles.proposalDescription}>
              {votingProject.descricao}
            </Text>

            <View style={styles.projectInfo}>
              <Text style={styles.authorText}>
                Autor: {votingProject.autorNome} {votingProject.autorSobrenome}
              </Text>
              <Text style={styles.dateText}>
                {new Date(votingProject.criadoEm).toLocaleDateString("pt-BR")}
              </Text>
            </View>
          </View>

          <View style={styles.votingButtons}>
            <TouchableOpacity
              style={[styles.voteButton, styles.approveButton]}
              onPress={() => handleVoteClick("approve")}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={32} color="#ffffff" />
              <Text style={styles.buttonText}>Aprovar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.voteButton, styles.rejectButton]}
              onPress={() => handleVoteClick("reject")}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle" size={32} color="#ffffff" />
              <Text style={styles.buttonText}>Rejeitar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.voteButton, styles.abstainButton]}
              onPress={() => handleVoteClick("abstain")}
              activeOpacity={0.8}
            >
              <Ionicons name="remove-circle" size={32} color="#ffffff" />
              <Text style={styles.buttonText}>Abster-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={confirmationModal.visible}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmVote}
        onCancel={handleCloseConfirmation}
        type="default"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    height: "30%",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  greeting: {
    paddingHorizontal: 0,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  bottomSection: {
    flex: 1,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  contentContainer: {
    padding: Spacing.md,
    flexGrow: 1,
  },
  timerContainer: {
    alignSelf: "flex-end",
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  timerText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: "#ffffff",
  },
  proposalCard: {
    backgroundColor: "#ffffff",
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    minHeight: 400,
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
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: "#198754",
    marginBottom: Spacing.lg,
    textAlign: "center",
    lineHeight: 32,
  },
  proposalDescription: {
    fontSize: FontSizes.lg,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: Spacing.lg,
  },
  projectInfo: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  authorText: {
    fontSize: FontSizes.md,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  dateText: {
    fontSize: FontSizes.sm,
    color: "#9CA3AF",
    textAlign: "center",
  },
  votingButtons: {
    flexDirection: "column",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    minHeight: 60,
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
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: "#ffffff",
  },
});
