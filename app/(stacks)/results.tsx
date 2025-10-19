import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ResultsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.primaryText }]}>
          Resultado Final
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Visualize o resultado da votação
        </Text>

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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.lg,
  },
  card: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
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
