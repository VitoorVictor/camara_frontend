import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { DatePicker } from "@/components/common/DatePicker";
import { SearchBar } from "@/components/common/SearchBar";
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
import {
  ListSessionsParams,
  Session,
  sessionsService,
} from "@/services/sessionsService";
import { useAuth } from "@/src/contexts/AuthContext";
import { formatDate } from "@/src/utils/formatters";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const STATUS_OPTIONS = ["EmAndamento", "Agendada", "Encerrada", "Cancelada"];

export default function SessionsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const { refreshSession } = useSession();
  const { presidente } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<ListSessionsParams>({});
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [confirmationModal, setConfirmationModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
    type?: "default" | "danger";
  }>({
    visible: false,
    title: "",
    message: "",
    confirmText: "Confirmar",
    onConfirm: () => {},
    type: "default",
  });
  const limit = 10;

  useEffect(() => {
    resetAndLoadSessions();
  }, []);

  const resetAndLoadSessions = async () => {
    try {
      setLoading(true);
      setOffset(0);
      setHasMore(true);
      const data = await sessionsService.listByCamara(limit, 0, filters);
      setSessions(data.items);
      setHasMore(data.hasMore);
      setOffset(limit);
    } catch (error) {
      console.error("Erro ao carregar sessões:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreSessions = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const data = await sessionsService.listByCamara(limit, offset, filters);
      setSessions((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
      setOffset((prev) => prev + limit);
    } catch (error) {
      console.error("Erro ao carregar mais sessões:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = async (text: string) => {
    setSearchLoading(true);
    const newFilters = { ...filters, nome: text || undefined };
    setFilters(newFilters);
    await applyFilters(newFilters);
    setSearchLoading(false);
  };

  const handleDateChange = async (date: string) => {
    const newFilters = { ...filters, data: date || undefined };
    setFilters(newFilters);
    await applyFilters(newFilters);
  };

  const handleClearSearch = async () => {
    const newFilters = { ...filters, nome: undefined };
    setFilters(newFilters);
    await applyFilters(newFilters);
  };

  const handleClearDate = async () => {
    const newFilters = { ...filters, data: undefined };
    setFilters(newFilters);
    await applyFilters(newFilters);
  };

  const handleClearAll = async () => {
    const emptyFilters: ListSessionsParams = {};
    setFilters(emptyFilters);
    await applyFilters(emptyFilters);
  };

  const handleStatusChange = (status: string) => {
    const newFilters = {
      ...filters,
      status: status === "all" ? undefined : status,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = async (newFilters: ListSessionsParams) => {
    try {
      setLoading(true);
      setOffset(0);
      setHasMore(true);
      const data = await sessionsService.listByCamara(limit, 0, newFilters);
      setSessions(data.items);
      setHasMore(data.hasMore);
      setOffset(limit);
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await applyFilters(filters);
    setRefreshing(false);
  };

  const clearFilters = () => {
    const emptyFilters: ListSessionsParams = {};
    setFilters(emptyFilters);
    applyFilters(emptyFilters);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "EmAndamento":
        return colors.success;
      case "Agendada":
        return colors.warning;
      case "Encerrada":
        return colors.inactive;
      case "Cancelada":
        return colors.error;
      default:
        return colors.inactive;
    }
  };

  const getSessionStatusLabel = (status: string) => {
    switch (status) {
      case "EmAndamento":
        return "Em Andamento";
      case "Agendada":
        return "Agendada";
      case "Encerrada":
        return "Encerrada";
      case "Cancelada":
        return "Cancelada";
      default:
        return "Não definido";
    }
  };

  // Verifica se existe alguma sessão em andamento
  const hasActiveSession = sessions.some(
    (session) => session.status === "EmAndamento"
  );

  const handleOpenSession = async (id: string, sessionName: string) => {
    setConfirmationModal({
      visible: true,
      title: "Confirmar Abertura",
      message: `Deseja realmente abrir a sessão "${sessionName}"?`,
      confirmText: "Abrir",
      type: "default",
      onConfirm: async () => {
        try {
          setConfirmationModal((prev) => ({ ...prev, visible: false }));
          await sessionsService.start(id);
          resetAndLoadSessions(); // Recarrega a lista de sessões
          // Atualiza a sessão ativa no contexto
          await refreshSession();
          if (presidente) {
            router.push("/(stacks)/projects-by-session");
          }
        } catch (error) {
          console.error("Erro ao abrir sessão:", error);
          setConfirmationModal({
            visible: true,
            title: "Erro",
            message: "Não foi possível abrir a sessão. Tente novamente.",
            confirmText: "OK",
            type: "danger",
            onConfirm: () => {
              setConfirmationModal((prev) => ({ ...prev, visible: false }));
            },
          });
        }
      },
    });
  };

  const handleFinishSession = async (id: string, sessionName: string) => {
    setConfirmationModal({
      visible: true,
      title: "Confirmar Encerramento",
      message: `Deseja realmente encerrar a sessão "${sessionName}"?\n\nEsta ação não pode ser desfeita.`,
      confirmText: "Encerrar",
      type: "danger",
      onConfirm: async () => {
        try {
          setConfirmationModal((prev) => ({ ...prev, visible: false }));
          await sessionsService.finish(id);
          resetAndLoadSessions(); // Recarrega a lista de sessões
          // Atualiza a sessão ativa no contexto (vai limpar pois não há mais sessão ativa)
          await refreshSession();
        } catch (error) {
          console.error("Erro ao encerrar sessão:", error);
          setConfirmationModal({
            visible: true,
            title: "Erro",
            message: "Não foi possível encerrar a sessão. Tente novamente.",
            confirmText: "OK",
            type: "danger",
            onConfirm: () => {
              setConfirmationModal((prev) => ({ ...prev, visible: false }));
            },
          });
        }
      },
    });
  };

  const handleEndReached = () => {
    if (!loadingMore && hasMore) {
      loadMoreSessions();
    }
  };

  const renderSessionCard = useCallback(
    ({ item: session }: { item: Session }) => (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: "#ffffff",
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
              {session.nome}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBadgeColor(session.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getSessionStatusLabel(session.status)}
            </Text>
          </View>
        </View>

        <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>
          {session.descricao}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.cardDateContainer}>
            <Text style={[styles.dateLabel, { color: colors.secondaryText }]}>
              Data:
            </Text>
            <Text style={[styles.dateValue, { color: colors.primaryText }]}>
              {formatDate(session.data, true)}
            </Text>
          </View>
          {session.abertoEm && session.abertoEm !== "0001-01-01T00:00:00" && (
            <View style={styles.cardDateContainer}>
              <Text style={[styles.dateLabel, { color: colors.secondaryText }]}>
                Aberta em:
              </Text>
              <Text style={[styles.dateValue, { color: colors.primaryText }]}>
                {formatDate(session.abertoEm, true)}
              </Text>
            </View>
          )}
        </View>

        {/* Botões de ação */}
        {session.status === "Agendada" && !hasActiveSession && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => handleOpenSession(session.id, session.nome)}
          >
            <Text style={styles.actionButtonText}>Abrir Sessão</Text>
          </TouchableOpacity>
        )}

        {session.status === "EmAndamento" && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error }]}
            onPress={() => handleFinishSession(session.id, session.nome)}
          >
            <Text style={styles.actionButtonText}>Encerrar Sessão</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    ),
    [colors, handleOpenSession, handleFinishSession]
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <Spinner size="small" />;
  };

  const hasSearchFilters = Boolean(filters.nome || filters.data);

  const renderListHeader = () => (
    <>
      {/* Filtro por status */}
      <FlatList
        horizontal
        data={STATUS_OPTIONS}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.statusButtonsContent}
        ListHeaderComponent={
          <TouchableOpacity
            style={[
              styles.statusButton,
              {
                backgroundColor:
                  filters.status === undefined ? colors.primary : "#ffffff",
                borderColor:
                  filters.status === undefined
                    ? colors.primary
                    : "rgba(0, 0, 0, 0.1)",
              },
            ]}
            onPress={() => handleStatusChange("all")}
          >
            <Text
              style={[
                styles.statusButtonText,
                {
                  color:
                    filters.status === undefined
                      ? "#ffffff"
                      : colors.primaryText,
                },
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>
        }
        renderItem={({ item: status }) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              {
                backgroundColor:
                  filters.status === status ? colors.primary : "#ffffff",
                borderColor:
                  filters.status === status
                    ? colors.primary
                    : "rgba(0, 0, 0, 0.1)",
              },
            ]}
            onPress={() => handleStatusChange(status)}
          >
            <Text
              style={[
                styles.statusButtonText,
                {
                  color:
                    filters.status === status ? "#ffffff" : colors.primaryText,
                },
              ]}
            >
              {getSessionStatusLabel(status)}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.statusButtonsContainer}
      />

      {/* Pesquisa e Data */}
      <View style={styles.searchDateContainer}>
        <SearchBar
          placeholder="Pesquisar por nome da sessão"
          value={filters.nome}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          onClearAll={handleClearAll}
          loading={searchLoading}
        />
        <View style={styles.dateAndActionsContainer}>
          <DatePicker
            value={filters.data}
            onChange={handleDateChange}
            onClear={handleClearDate}
            placeholder="Data"
          />
          {hasSearchFilters && (
            <TouchableOpacity
              style={[
                styles.clearFiltersButton,
                { backgroundColor: colors.error },
              ]}
              onPress={clearFilters}
            >
              <IconSymbol name="trash" size={18} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lista de Sessões */}
      <Text style={[styles.listTitle, { color: colors.primaryText }]}>
        Sessões ({sessions.length})
      </Text>
    </>
  );

  const renderEmpty = () => (
    <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
      {loading ? "" : "Nenhuma sessão encontrada"}
    </Text>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {loading && sessions.length === 0 ? (
        <Spinner />
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSessionCard}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
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
      )}

      <ConfirmationModal
        visible={confirmationModal.visible}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText="Cancelar"
        type={confirmationModal.type}
        onConfirm={confirmationModal.onConfirm}
        onCancel={() =>
          setConfirmationModal((prev) => ({ ...prev, visible: false }))
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  statusButtonsContainer: {
    marginBottom: Spacing.md,
  },
  statusButtonsContent: {
    gap: Spacing.sm,
  },
  statusButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minWidth: 100,
    alignItems: "center",
  },
  searchDateContainer: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  dateAndActionsContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: Spacing.sm,
  },
  statusButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  clearButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  clearButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
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
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
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
  cardDescription: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    gap: Spacing.xs,
  },
  cardDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  dateLabel: {
    fontSize: FontSizes.sm,
  },
  dateValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  listTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  actionButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
  clearFiltersButton: {
    width: 48,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
});
