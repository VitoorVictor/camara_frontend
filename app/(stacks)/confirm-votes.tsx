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
import {
  Voto,
  VotosPorSessaoProjeto,
  votingService,
} from "@/services/votingService";
import { formatDate } from "@/utils/formatters";
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

export default function ConfirmVotesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const { activeSession } = useSession();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<VotosPorSessaoProjeto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  // Estados para modais de confirmação
  const [acceptAllModal, setAcceptAllModal] = useState(false);
  const [rejectAllModal, setRejectAllModal] = useState(false);
  const [acceptVoteModal, setAcceptVoteModal] = useState<Voto | null>(null);
  const [rejectVoteModal, setRejectVoteModal] = useState<Voto | null>(null);

  // Estados para modais de status do projeto
  const [approveProjectModal, setApproveProjectModal] = useState(false);
  const [rejectProjectModal, setRejectProjectModal] = useState(false);
  const [approveNextInstanceModal, setApproveNextInstanceModal] =
    useState(false);
  const [updatingProjectStatus, setUpdatingProjectStatus] = useState(false);

  // Mock do ID da sessão projeto
  const SESSAO_PROJETO_ID = "b26c6e9e-6e4a-4cc6-9c3e-dcdb53e2c7b9";

  useEffect(() => {
    loadVereadoresData();
    loadProject();
  }, [activeSession?.id]);

  const loadVereadoresData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await votingService.listVereadoresByVotosInSessaoProjeto(
        SESSAO_PROJETO_ID
      );
      setData(response);
    } catch (err: any) {
      console.error("Erro ao carregar dados dos vereadores:", err);
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const loadProject = async () => {
    if (!activeSession?.id) return;

    try {
      const projects = await projectsService.getBySession(activeSession.id);
      // Busca o projeto em votação
      const projectInVoting = projects.find((p) => p.status === "EmVotacao");
      if (projectInVoting) {
        setProject(projectInVoting);
      }
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadVereadoresData(), loadProject()]);
    setRefreshing(false);
  };

  const handleAcceptAllVotes = () => {
    setAcceptAllModal(true);
  };

  const handleConfirmAcceptAll = async () => {
    setAcceptAllModal(false);
    if (!data || !data.votos.length) return;

    try {
      // Confirma todos os votos pendentes
      const pendingVotes = data.votos.filter((v) => !v.votoConfirmado);
      for (const voto of pendingVotes) {
        await votingService.confirmVote(
          SESSAO_PROJETO_ID,
          voto.vereadorVotante.id
        );
      }
      Alert.alert("Sucesso", "Todos os votos foram aceitos!");
      loadVereadoresData();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao aceitar todos os votos");
    }
  };

  const handleRejectAllVotes = () => {
    setRejectAllModal(true);
  };

  const handleConfirmRejectAll = async () => {
    setRejectAllModal(false);
    // TODO: Implementar função de rejeitar todos os votos (se houver rota específica)
    Alert.alert("Aviso", "Função de rejeitar todos ainda não implementada");
  };

  const handleAcceptVote = (voto: Voto) => {
    setAcceptVoteModal(voto);
  };

  const handleConfirmAcceptVote = async () => {
    if (!acceptVoteModal) return;

    try {
      await votingService.confirmVote(
        SESSAO_PROJETO_ID,
        acceptVoteModal.vereadorVotante.id
      );
      Alert.alert("Sucesso", "Voto aceito com sucesso!");
      setAcceptVoteModal(null);
      loadVereadoresData();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao aceitar o voto");
    }
  };

  const handleRejectVote = (voto: Voto) => {
    setRejectVoteModal(voto);
  };

  const handleConfirmRejectVote = async () => {
    if (!rejectVoteModal) return;

    // TODO: Implementar função de rejeitar voto individual (se houver rota específica)
    Alert.alert("Aviso", "Função de rejeitar voto ainda não implementada");
    setRejectVoteModal(null);
  };

  // Handlers para status do projeto
  const handleApproveProject = () => {
    setApproveProjectModal(true);
  };

  const handleConfirmApproveProject = async () => {
    if (!project) return;
    setApproveProjectModal(false);

    try {
      setUpdatingProjectStatus(true);
      await projectsService.updateStatus(project.id, "Aprovado");
      Alert.alert("Sucesso", "Projeto marcado como aprovado!");
      await Promise.all([loadProject(), loadVereadoresData()]);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao aprovar o projeto");
    } finally {
      setUpdatingProjectStatus(false);
    }
  };

  const handleRejectProject = () => {
    setRejectProjectModal(true);
  };

  const handleConfirmRejectProject = async () => {
    if (!project) return;
    setRejectProjectModal(false);

    try {
      setUpdatingProjectStatus(true);
      await projectsService.updateStatus(project.id, "Rejeitado");
      Alert.alert("Sucesso", "Projeto marcado como rejeitado!");
      await Promise.all([loadProject(), loadVereadoresData()]);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao rejeitar o projeto");
    } finally {
      setUpdatingProjectStatus(false);
    }
  };

  const handleApproveNextInstance = () => {
    setApproveNextInstanceModal(true);
  };

  const handleConfirmApproveNextInstance = async () => {
    if (!project) return;
    setApproveNextInstanceModal(false);

    try {
      setUpdatingProjectStatus(true);
      // TODO: Verificar se existe uma rota específica para "aprovar para próxima instância"
      // Por enquanto, usando o mesmo updateStatus com status apropriado
      await projectsService.updateStatus(project.id, "Aprovado");
      Alert.alert("Sucesso", "Projeto aprovado para próxima instância!");
      await Promise.all([loadProject(), loadVereadoresData()]);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Erro ao aprovar para próxima instância"
      );
    } finally {
      setUpdatingProjectStatus(false);
    }
  };

  const formatVoteDate = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") {
      return "Não informado";
    }
    try {
      return formatDate(dateString, true);
    } catch {
      return "Data inválida";
    }
  };

  const getVoteLabel = (valor: string) => {
    switch (valor) {
      case "Sim":
        return "Aprovar";
      case "Não":
        return "Rejeitar";
      case "Abstenção":
        return "Abster-se";
      default:
        return valor;
    }
  };

  const getVoteColor = (valor: string) => {
    switch (valor) {
      case "Sim":
        return colors.success;
      case "Não":
        return colors.error;
      case "Abstenção":
        return colors.warning;
      default:
        return colors.inactive;
    }
  };

  const renderVoteItem = ({ item: voto }: { item: Voto }) => (
    <View
      style={[
        styles.voteCard,
        {
          backgroundColor: "#ffffff",
          borderColor: colors.border,
          borderLeftWidth: voto.votoConfirmado ? 4 : 1,
          borderLeftColor: voto.votoConfirmado ? colors.success : colors.border,
        },
      ]}
    >
      <View style={styles.voteCardContent}>
        <View style={styles.voteInfo}>
          <Text style={[styles.vereadorName, { color: colors.primaryText }]}>
            {voto.vereadorVotante.nome}
          </Text>
          <View style={styles.voteDetails}>
            <View
              style={[
                styles.voteBadge,
                {
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: getVoteColor(voto.valor),
                },
              ]}
            >
              <Text
                style={[styles.voteBadgeLabel, { color: colors.secondaryText }]}
              >
                Voto:
              </Text>
              <Text
                style={[
                  styles.voteBadgeValue,
                  { color: getVoteColor(voto.valor) },
                ]}
              >
                {getVoteLabel(voto.valor)}
              </Text>
            </View>
            <Text style={[styles.voteTime, { color: colors.secondaryText }]}>
              {formatVoteDate(voto.dataHora)}
            </Text>
          </View>
        </View>
        <View style={styles.voteActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.rejectButton,
              {
                backgroundColor: voto.votoConfirmado
                  ? colors.inactive
                  : colors.error,
              },
            ]}
            onPress={() => handleRejectVote(voto)}
            disabled={voto.votoConfirmado}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>
              {voto.votoConfirmado ? "Rejeitado" : "Rejeitar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.acceptButton,
              {
                backgroundColor: voto.votoConfirmado
                  ? colors.inactive
                  : colors.success,
              },
            ]}
            onPress={() => handleAcceptVote(voto)}
            disabled={voto.votoConfirmado}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>
              {voto.votoConfirmado ? "Aceito" : "Aceitar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderProjectCard = () => {
    if (!project) return null;

    return (
      <View
        style={[
          styles.projectCard,
          {
            backgroundColor: "#ffffff",
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.projectCardHeader}>
          <View style={styles.projectTitleContainer}>
            <Text
              style={[styles.projectCardTitle, { color: colors.primaryText }]}
            >
              {project.titulo}
            </Text>
          </View>
          <View
            style={[
              styles.projectStatusBadge,
              { backgroundColor: colors.warning },
            ]}
          >
            <Text style={styles.projectStatusText}>Em Votação</Text>
          </View>
        </View>
        <Text
          style={[
            styles.projectCardDescription,
            { color: colors.secondaryText },
          ]}
        >
          {project.descricao}
        </Text>
        <View style={styles.projectCardFooter}>
          <Text
            style={[styles.projectAuthorText, { color: colors.secondaryText }]}
          >
            Autor: {project.autorNome} {project.autorSobrenome}
          </Text>
          <Text
            style={[styles.projectDateText, { color: colors.disabledText }]}
          >
            {formatDate(project.criadoEm, false)}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    if (!data) return null;

    return (
      <>
        {renderProjectCard()}

        <View style={styles.summaryContainer}>
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: "#ffffff", borderColor: colors.border },
            ]}
          >
            <Text style={[styles.summaryTitle, { color: colors.primaryText }]}>
              Resumo dos Votos
            </Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  {data.votosSim}
                </Text>
                <Text
                  style={[styles.summaryLabel, { color: colors.secondaryText }]}
                >
                  Sim
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.error }]}>
                  {data.votosNao}
                </Text>
                <Text
                  style={[styles.summaryLabel, { color: colors.secondaryText }]}
                >
                  Não
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.warning }]}>
                  {data.votosAbstencao}
                </Text>
                <Text
                  style={[styles.summaryLabel, { color: colors.secondaryText }]}
                >
                  Abstenção
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.inactive }]}>
                  {data.votosFaltou}
                </Text>
                <Text
                  style={[styles.summaryLabel, { color: colors.secondaryText }]}
                >
                  Faltou
                </Text>
              </View>
            </View>

            {/* Botões de ação do projeto */}
            {project &&
              project.status === "EmVotacao" &&
              data.votos.length > 0 &&
              data.votos.every((voto) => voto.votoConfirmado) && (
                <View style={styles.projectActionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.projectActionButton,
                      styles.approveButton,
                      { backgroundColor: colors.success },
                    ]}
                    onPress={handleApproveProject}
                    disabled={updatingProjectStatus}
                    activeOpacity={0.8}
                  >
                    <IconSymbol
                      name="checkmark.circle"
                      size={18}
                      color="#ffffff"
                    />
                    <Text style={styles.projectActionButtonText}>
                      Aprovar Projeto
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.projectActionButton,
                      styles.nextInstanceButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleApproveNextInstance}
                    disabled={updatingProjectStatus}
                    activeOpacity={0.8}
                  >
                    <IconSymbol
                      name="chevron.right"
                      size={18}
                      color="#ffffff"
                    />
                    <Text style={styles.projectActionButtonText}>
                      Aprovar Próxima Instância
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.projectActionButton,
                      styles.rejectButtonProject,
                      { backgroundColor: colors.error },
                    ]}
                    onPress={handleRejectProject}
                    disabled={updatingProjectStatus}
                    activeOpacity={0.8}
                  >
                    <IconSymbol
                      name="xmark.circle.fill"
                      size={18}
                      color="#ffffff"
                    />
                    <Text style={styles.projectActionButtonText}>
                      Rejeitar Projeto
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </View>

        <View style={styles.topButtonContainer}>
          <View style={styles.topButtonsRow}>
            <TouchableOpacity
              style={[
                styles.topActionButton,
                styles.rejectAllButton,
                { backgroundColor: colors.error },
              ]}
              onPress={handleRejectAllVotes}
              activeOpacity={0.8}
            >
              <IconSymbol name="xmark.circle.fill" size={20} color="#ffffff" />
              <Text style={styles.topActionButtonText}>Rejeitar Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.topActionButton,
                styles.acceptAllButton,
                { backgroundColor: colors.success },
              ]}
              onPress={handleAcceptAllVotes}
              activeOpacity={0.8}
            >
              <IconSymbol name="checkmark.circle" size={20} color="#ffffff" />
              <Text style={styles.topActionButtonText}>Aceitar Todos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  const renderFooter = () => {
    if (!data || data.votos.length === 0) return null;
    return <View style={styles.footer} />;
  };

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
        Nenhum voto encontrado
      </Text>
    );
  };

  if (loading && !data) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: "#ffffff",
              borderColor: colors.error,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.error }]}>
            Erro ao Carregar
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data?.votos || []}
        renderItem={renderVoteItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
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
        onEndReachedThreshold={0.3}
      />

      {/* Modal de confirmar aceitar todos */}
      <ConfirmationModal
        visible={acceptAllModal}
        title="Aceitar Todos os Votos"
        message="Deseja aceitar todos os votos pendentes?"
        confirmText="Aceitar"
        cancelText="Cancelar"
        onConfirm={handleConfirmAcceptAll}
        onCancel={() => setAcceptAllModal(false)}
        type="default"
      />

      {/* Modal de confirmar rejeitar todos */}
      <ConfirmationModal
        visible={rejectAllModal}
        title="Rejeitar Todos os Votos"
        message="Deseja rejeitar todos os votos pendentes?"
        confirmText="Rejeitar"
        cancelText="Cancelar"
        onConfirm={handleConfirmRejectAll}
        onCancel={() => setRejectAllModal(false)}
        type="danger"
      />

      {/* Modal de confirmar aceitar voto individual */}
      <ConfirmationModal
        visible={acceptVoteModal !== null}
        title="Aceitar Voto"
        message={`Deseja aceitar o voto de ${acceptVoteModal?.vereadorVotante.nome}?`}
        confirmText="Aceitar"
        cancelText="Cancelar"
        onConfirm={handleConfirmAcceptVote}
        onCancel={() => setAcceptVoteModal(null)}
        type="default"
      />

      {/* Modal de confirmar rejeitar voto individual */}
      <ConfirmationModal
        visible={rejectVoteModal !== null}
        title="Rejeitar Voto"
        message={`Deseja rejeitar o voto de ${rejectVoteModal?.vereadorVotante.nome}?`}
        confirmText="Rejeitar"
        cancelText="Cancelar"
        onConfirm={handleConfirmRejectVote}
        onCancel={() => setRejectVoteModal(null)}
        type="danger"
      />

      {/* Modal de confirmar aprovar projeto */}
      <ConfirmationModal
        visible={approveProjectModal}
        title="Aprovar Projeto"
        message={`Deseja marcar o projeto "${project?.titulo}" como aprovado?`}
        confirmText="Aprovar"
        cancelText="Cancelar"
        onConfirm={handleConfirmApproveProject}
        onCancel={() => setApproveProjectModal(false)}
        type="default"
      />

      {/* Modal de confirmar rejeitar projeto */}
      <ConfirmationModal
        visible={rejectProjectModal}
        title="Rejeitar Projeto"
        message={`Deseja marcar o projeto "${project?.titulo}" como rejeitado?`}
        confirmText="Rejeitar"
        cancelText="Cancelar"
        onConfirm={handleConfirmRejectProject}
        onCancel={() => setRejectProjectModal(false)}
        type="danger"
      />

      {/* Modal de confirmar aprovar para próxima instância */}
      <ConfirmationModal
        visible={approveNextInstanceModal}
        title="Aprovar para Próxima Instância"
        message={`Deseja aprovar o projeto "${project?.titulo}" para a próxima instância?`}
        confirmText="Aprovar"
        cancelText="Cancelar"
        onConfirm={handleConfirmApproveNextInstance}
        onCancel={() => setApproveNextInstanceModal(false)}
        type="default"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topButtonContainer: {
    paddingBottom: Spacing.md,
  },
  topButtonsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  topActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  acceptAllButton: {
    // Estilo será aplicado dinamicamente
  },
  rejectAllButton: {
    // Estilo será aplicado dinamicamente
  },
  topActionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  summaryContainer: {
    marginBottom: Spacing.md,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: Spacing.sm,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
  },
  projectActionButtons: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    gap: Spacing.sm,
  },
  projectActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  approveButton: {
    // Estilo será aplicado dinamicamente
  },
  rejectButtonProject: {
    // Estilo será aplicado dinamicamente
  },
  nextInstanceButton: {
    // Estilo será aplicado dinamicamente
  },
  projectActionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
  voteCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  voteCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.md,
  },
  voteInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  vereadorName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  voteDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  voteBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
    alignSelf: "flex-start",
  },
  voteBadgeLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.normal,
  },
  voteBadgeValue: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  voteTime: {
    fontSize: FontSizes.xs,
  },
  voteActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    minWidth: 80,
  },
  acceptButton: {
    // Estilo será aplicado dinamicamente
  },
  rejectButton: {
    // Estilo será aplicado dinamicamente
  },
  actionButtonText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
    textAlign: "center",
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  cardText: {
    fontSize: FontSizes.md,
    lineHeight: 24,
    marginBottom: Spacing.xs,
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
  footer: {
    height: Spacing.xl,
  },
  projectCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  projectCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  projectTitleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  projectCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  projectStatusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  projectStatusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
  projectCardDescription: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  projectCardFooter: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  projectAuthorText: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  projectDateText: {
    fontSize: FontSizes.xs,
  },
});
