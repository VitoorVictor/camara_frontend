import { DatePicker } from "@/components/common/DatePicker";
import { SearchBar } from "@/components/common/SearchBar";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import {
  SessaoStatusEnum,
  getSessaoStatusLabel,
} from "@/enums/SessaoStatusEnum";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  ListSessionsParams,
  Session,
  sessionsService,
} from "@/services/sessionsService";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SessionsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ListSessionsParams>({});

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async (params?: ListSessionsParams) => {
    try {
      setLoading(true);
      const data = await sessionsService.listByCamara(params || filters);
      setSessions(data);
    } catch (error) {
      console.error("Erro ao carregar sessões:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    const newFilters = { ...filters, nome: text || undefined };
    setFilters(newFilters);
    loadSessions(newFilters);
  };

  const handleDateChange = (date: string) => {
    const newFilters = { ...filters, data: date || undefined };
    setFilters(newFilters);
    loadSessions(newFilters);
  };

  const handleStatusChange = (status: SessaoStatusEnum | "all") => {
    const newFilters = {
      ...filters,
      status: status === "all" ? undefined : status,
    };
    setFilters(newFilters);
    loadSessions(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: ListSessionsParams = {};
    setFilters(emptyFilters);
    loadSessions(emptyFilters);
  };

  const getStatusBadgeColor = (status: SessaoStatusEnum) => {
    switch (status) {
      case SessaoStatusEnum.EmAndamento:
        return colors.success;
      case SessaoStatusEnum.Agendada:
        return colors.warning;
      case SessaoStatusEnum.Encerrada:
        return colors.inactive;
      case SessaoStatusEnum.Cancelada:
        return colors.error;
      default:
        return colors.inactive;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleOpenSession = async (id: string) => {
    try {
      await sessionsService.start(id);
      loadSessions(); // Recarrega a lista de sessões
    } catch (error) {
      console.error("Erro ao abrir sessão:", error);
    }
  };

  const handleFinishSession = async (id: string) => {
    try {
      await sessionsService.finish(id);
      loadSessions(); // Recarrega a lista de sessões
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Filtro por status */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statusButtonsContainer}
          contentContainerStyle={styles.statusButtonsContent}
        >
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
          {Object.values(SessaoStatusEnum)
            .filter((v) => typeof v === "number")
            .map((status) => (
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
                onPress={() => handleStatusChange(status as SessaoStatusEnum)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    {
                      color:
                        filters.status === status
                          ? "#ffffff"
                          : colors.primaryText,
                    },
                  ]}
                >
                  {getSessaoStatusLabel(status as SessaoStatusEnum)}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Pesquisa e Data */}
        <View style={styles.searchDateContainer}>
          <SearchBar
            placeholder="Pesquisar por nome da sessão"
            value={filters.nome}
            onChangeText={(text) => setFilters({ ...filters, nome: text })}
            onSearch={handleSearch}
          />
          <DatePicker
            value={filters.data}
            onChange={handleDateChange}
            placeholder="Data"
          />
        </View>

        {/* Lista de Sessões */}
        <Text style={[styles.listTitle, { color: colors.primaryText }]}>
          Sessões ({sessions.length})
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : sessions.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            Nenhuma sessão encontrada
          </Text>
        ) : (
          sessions.map((session) => (
            <TouchableOpacity
              key={session.id}
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
                  <Text
                    style={[styles.cardTitle, { color: colors.primaryText }]}
                  >
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
                    {getSessaoStatusLabel(session.status)}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.cardDescription,
                  { color: colors.secondaryText },
                ]}
              >
                {session.descricao}
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.cardDateContainer}>
                  <Text
                    style={[styles.dateLabel, { color: colors.secondaryText }]}
                  >
                    Data:
                  </Text>
                  <Text
                    style={[styles.dateValue, { color: colors.primaryText }]}
                  >
                    {formatDate(session.data)}
                  </Text>
                </View>
                <View style={styles.cardDateContainer}>
                  <Text
                    style={[styles.dateLabel, { color: colors.secondaryText }]}
                  >
                    Aberta em:
                  </Text>
                  <Text
                    style={[styles.dateValue, { color: colors.primaryText }]}
                  >
                    {new Date(session.abertoEm).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
              </View>

              {/* Botões de ação */}
              {session.status === SessaoStatusEnum.Agendada && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => handleOpenSession(session.id)}
                >
                  <Text style={styles.actionButtonText}>Abrir Sessão</Text>
                </TouchableOpacity>
              )}

              {session.status === SessaoStatusEnum.EmAndamento && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: colors.error },
                  ]}
                  onPress={() => handleFinishSession(session.id)}
                >
                  <Text style={styles.actionButtonText}>Encerrar Sessão</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
});
