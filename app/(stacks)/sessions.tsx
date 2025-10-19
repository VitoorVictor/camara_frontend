import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SessionsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Sessão Ativa */}
        <View
          style={[
            styles.card,
            styles.activeCard,
            {
              backgroundColor: colors.background,
              borderColor: colors.success,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
                Sessão Ordinária #45
              </Text>
              <Text style={[styles.cardDate, { color: colors.secondaryText }]}>
                19 de Outubro de 2024 • 14:00
              </Text>
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: colors.success }]}
            >
              <Text style={styles.statusText}>Em Andamento</Text>
            </View>
          </View>
          <Text
            style={[styles.cardDescription, { color: colors.secondaryText }]}
          >
            Votação de projetos de lei municipais e debates sobre a ordem do
            dia.
          </Text>
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                8
              </Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                Projetos
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                45
              </Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                Presentes
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                3
              </Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                Votados
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.buttonText}>Acessar Sessão</Text>
          </TouchableOpacity>
        </View>

        {/* Próximas Sessões */}
        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
          Próximas Sessões
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
                Sessão Extraordinária #12
              </Text>
              <Text style={[styles.cardDate, { color: colors.secondaryText }]}>
                25 de Outubro de 2024 • 09:00
              </Text>
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: colors.warning }]}
            >
              <Text style={styles.statusText}>Agendada</Text>
            </View>
          </View>
          <Text
            style={[styles.cardDescription, { color: colors.secondaryText }]}
          >
            Discussão e votação de projeto de lei complementar sobre orçamento.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
                Sessão Ordinária #46
              </Text>
              <Text style={[styles.cardDate, { color: colors.secondaryText }]}>
                26 de Outubro de 2024 • 14:00
              </Text>
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: colors.warning }]}
            >
              <Text style={styles.statusText}>Agendada</Text>
            </View>
          </View>
          <Text
            style={[styles.cardDescription, { color: colors.secondaryText }]}
          >
            Sessão ordinária semanal com pauta geral.
          </Text>
        </View>

        {/* Sessões Anteriores */}
        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
          Sessões Anteriores
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
                Sessão Ordinária #44
              </Text>
              <Text style={[styles.cardDate, { color: colors.secondaryText }]}>
                12 de Outubro de 2024 • 14:00
              </Text>
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: colors.inactive }]}
            >
              <Text style={[styles.statusText, { color: colors.primaryText }]}>
                Encerrada
              </Text>
            </View>
          </View>
          <Text
            style={[styles.cardDescription, { color: colors.secondaryText }]}
          >
            5 projetos votados • 42 vereadores presentes
          </Text>
        </View>
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
  },
  activeCard: {
    borderWidth: 2,
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
});
