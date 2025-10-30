import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useSession } from "@/contexts/SessionContext";
import {
  ProjetoStatusEnum,
  getProjetoStatusLabel,
} from "@/enums/ProjetoStatusEnum";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Project, projectsService } from "@/services/projectsService";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProjectsBySessionScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const { activeSession } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeSession?.id) {
      loadProjects();
    }
  }, [activeSession?.id]);

  const loadProjects = async () => {
    if (!activeSession?.id) return;

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

  const getStatusBadgeColor = (status: ProjetoStatusEnum) => {
    switch (status) {
      case ProjetoStatusEnum.Aprovado:
        return colors.success;
      case ProjetoStatusEnum.Rejeitado:
        return colors.error;
      case ProjetoStatusEnum.EmVotacao:
        return colors.warning;
      case ProjetoStatusEnum.Apresentado:
        return colors.primary;
      default:
        return colors.inactive;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
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
              <View>
                <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
                  {activeSession.nome}
                </Text>
                <View style={styles.cardDateContainer}>
                  <Text
                    style={[styles.cardDate, { color: colors.secondaryText }]}
                  >
                    {activeSession.data}
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
                <Text
                  style={[styles.statLabel, { color: colors.secondaryText }]}
                >
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

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : projects.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            Nenhum projeto cadastrado nesta sessão
          </Text>
        ) : (
          projects.map((project) => (
            <TouchableOpacity
              key={project.id}
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
                  <Text
                    style={[styles.cardTitle, { color: colors.primaryText }]}
                  >
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
              <Text
                style={[
                  styles.cardDescription,
                  { color: colors.secondaryText },
                ]}
              >
                {project.descricao}
              </Text>
              <View style={styles.projectFooter}>
                <Text
                  style={[styles.authorText, { color: colors.secondaryText }]}
                >
                  Autor: {project.autorNome} {project.autorSobrenome}
                </Text>
                <Text style={[styles.dateText, { color: colors.disabledText }]}>
                  {new Date(project.criadoEm).toLocaleDateString("pt-BR")}
                </Text>
              </View>
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
});
