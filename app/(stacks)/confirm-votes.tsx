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

export default function ConfirmVotesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Aqui você pode adicionar o conteúdo específico para confirmar votos */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: "#ffffff",
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

        <View
          style={[
            styles.card,
            {
              backgroundColor: "#ffffff",
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
            Resumo dos Votos
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            Total de votantes: 45 vereadores
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            Votos confirmados: 42
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            Aguardando: 3
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
