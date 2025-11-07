import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { Spinner } from "@/components/common/Spinner";
import { IconSymbol } from "@/components/ui/icon-symbol";
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
import { formatDate } from "@/utils/formatters";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProjectsBySessionScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const {
    activeSession,
    loading: sessionLoading,
    refreshSession,
  } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    projetoId: string | null;
  }>({
    visible: false,
    title: "",
    message: "",
    projetoId: null,
  });
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (activeSession?.id && activeSession.status === "EmAndamento") {
      loadProjects();
    } else if (!sessionLoading) {
      // Se não está carregando e não tem sessão, para de carregar
      setLoading(false);
      setProjects([]); // Limpa projetos se não há sessão válida
    }
  }, [activeSession?.id, activeSession?.status, sessionLoading]);

  const loadProjects = async () => {
    if (!activeSession?.id || activeSession.status !== "EmAndamento") return;

    try {
      setLoading(true);
      const data = await projectsService.getBySession(activeSession.id);
      setProjects(data);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return colors.success;
      case "Rejeitado":
        return colors.error;
      case "EmVotacao":
        return colors.warning;
      case "Apresentado":
        return colors.primary;
      case "Cancelado":
        return colors.inactive;
      default:
        return colors.inactive;
    }
  };
  const getProjetoStatusLabel = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "Aprovado";
      case "Rejeitado":
        return "Rejeitado";
      case "EmVotacao":
        return "Em Votação";
      case "Apresentado":
        return "Apresentado";
      case "Cancelado":
        return "Cancelado";
      default:
        return "Não definido";
    }
  };

  const handleGoToSessions = () => {
    router.replace("/(stacks)/sessions");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Atualiza a sessão no contexto
      await refreshSession();
      // O useEffect vai detectar a mudança no activeSession e recarregar os projetos automaticamente
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpenVotingConfirmation = (
    projectId: string,
    projectTitle: string
  ) => {
    setConfirmationModal({
      visible: true,
      title: "Enviar para Votação",
      message: `Deseja enviar o projeto "${projectTitle}" para votação?`,
      projetoId: projectId,
    });
  };

  const handleCloseConfirmation = () => {
    setConfirmationModal({
      visible: false,
      title: "",
      message: "",
      projetoId: null,
    });
  };

  const handleConfirmStatusUpdate = async () => {
    if (!confirmationModal.projetoId || !activeSession?.id) return;

    try {
      setUpdatingStatus(true);
      await projectsService.updateStatus(
        activeSession.id,
        confirmationModal.projetoId,
        "EmVotacao"
      );

      // Atualiza o status do projeto na lista local
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === confirmationModal.projetoId
            ? { ...project, status: "EmVotacao" }
            : project
        )
      );

      handleCloseConfirmation();
      Alert.alert("Sucesso", "Status do projeto atualizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert(
        "Erro",
        error.message || "Erro ao atualizar o status do projeto"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Verifica se existe algum projeto em votação
  const hasProjectInVoting = projects.some(
    (project) => project.status === "EmVotacao"
  );

  const renderProjectCard = ({ item: project }: { item: Project }) => (
    <TouchableOpacity
      style={[
        styles.card,
        styles.projectCard,
        {
          backgroundColor: "#ffffff",
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.projectTitleContainer}>
          <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
            {project.titulo}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusBadgeColor(project.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {getProjetoStatusLabel(project.status)}
          </Text>
        </View>
      </View>
      <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>
        {project.descricao}
      </Text>
      <View style={styles.projectFooter}>
        <Text style={[styles.authorText, { color: colors.secondaryText }]}>
          Autor: {project.autorNome} {project.autorSobrenome}
        </Text>
        <Text style={[styles.dateText, { color: colors.disabledText }]}>
          {new Date(project.criadoEm).toLocaleDateString("pt-BR")}
        </Text>
      </View>
      {project.status === "Apresentado" && !hasProjectInVoting && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={() =>
            handleOpenVotingConfirmation(project.id, project.titulo)
          }
          disabled={updatingStatus}
          activeOpacity={0.8}
        >
          <IconSymbol name="checkmark.circle" size={18} color="#ffffff" />
          <Text style={styles.actionButtonText}>Enviar para Votação</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderListHeader = () => (
    <>
      {/* Sessão Ativa */}
      {activeSession && (
        <View
          style={[
            styles.card,
            styles.activeCard,
            {
              borderColor: colors.success,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
                {activeSession.nome}
              </Text>
              <View style={styles.cardDateContainer}>
                <Text
                  style={[styles.cardDate, { color: colors.secondaryText }]}
                >
                  {formatDate(activeSession.data, true)}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: colors.success },
                  ]}
                >
                  <Text style={styles.statusText}>Em Andamento</Text>
                </View>
              </View>
            </View>
          </View>
          <Text
            style={[styles.cardDescription, { color: colors.secondaryText }]}
          >
            {activeSession.descricao}
          </Text>
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {projects.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                Projetos
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Lista de Projetos */}
      <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
        Projetos da Sessão
      </Text>
    </>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Spinner />
        </View>
      );
    }
    return (
      <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
        Nenhum projeto cadastrado nesta sessão
      </Text>
    );
  };

  // Mostra spinner enquanto carrega sessão
  if (sessionLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Spinner />
      </View>
    );
  }

  // Se não há sessão ativa, mostra mensagem
  if (!activeSession) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: "#ffffff",
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.emptyIconContainer}>
              <IconSymbol
                name="calendar"
                size={64}
                color={colors.disabledText}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.primaryText }]}>
              Nenhuma Sessão Ativa
            </Text>
            <Text
              style={[styles.emptyMessage, { color: colors.secondaryText }]}
            >
              Não há uma sessão em andamento no momento.{"\n"}É necessário abrir
              uma sessão na tela de Sessões para visualizar os projetos.
            </Text>
            <TouchableOpacity
              style={[
                styles.goToSessionsButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleGoToSessions}
              activeOpacity={0.8}
            >
              <IconSymbol name="calendar" size={20} color="#ffffff" />
              <Text style={styles.goToSessionsButtonText}>Ir para Sessões</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={projects}
        renderItem={renderProjectCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
      <ConfirmationModal
        visible={confirmationModal.visible}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmStatusUpdate}
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
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    backgroundColor: "#ffffff",
  },
  activeCard: {
    borderWidth: 2,
  },
  projectCard: {
    backgroundColor: "#ffffff",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  cardDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: Spacing.sm,
  },
  cardDate: {
    fontSize: FontSizes.sm,
  },
  cardDescription: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSizes.xs,
  },
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: FontSizes.md,
    textAlign: "center",
    paddingVertical: Spacing.xl,
  },
  projectTitleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  projectFooter: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  authorText: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  dateText: {
    fontSize: FontSizes.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  emptyCard: {
    width: "100%",
    maxWidth: 400,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: "center",
  },
  emptyIconContainer: {
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: FontSizes.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  goToSessionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    minWidth: 200,
  },
  goToSessionsButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
});
