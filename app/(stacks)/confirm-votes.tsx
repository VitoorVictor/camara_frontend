import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ConfirmVotesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.primaryText }]}>
          Confirmar Votos
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Finalize a votação da sessão atual
        </Text>

        {/* Aqui você pode adicionar o conteúdo específico para confirmar votos */}
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
            Votação em Andamento
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            Tem certeza que deseja finalizar a votação? Esta ação não pode ser
            desfeita.
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
  },
});
