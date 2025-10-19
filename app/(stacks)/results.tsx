import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ResultsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Aqui você pode adicionar gráficos e estatísticas */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
            Estatísticas da Votação
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            Total de votos: 45
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            Aprovado: 30 votos (66.7%)
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            Rejeitado: 15 votos (33.3%)
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
          <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
            Projeto de Lei Nº 042/2024
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            Status: Aprovado
          </Text>
          <Text style={[styles.cardText, { color: colors.success }]}>
            ✓ Maioria alcançada
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
          <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
            Detalhes
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            Data: 19/10/2024
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            Horário: 14:30
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            Sessão: Ordinária
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
});
