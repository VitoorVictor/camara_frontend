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

export default function ProjectsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Lista de Projetos */}
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
          <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
            Dispõe sobre a criação de programa de reciclagem
          </Text>
          <Text style={[styles.cardStatus, { color: colors.warning }]}>
            Status: Em votação
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
            Projeto de Lei Nº 038/2024
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
            Institui o programa de mobilidade urbana sustentável
          </Text>
          <Text style={[styles.cardStatus, { color: colors.success }]}>
            Status: Aprovado
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
            Projeto de Lei Nº 035/2024
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
            Altera dispositivos da Lei Orgânica Municipal
          </Text>
          <Text style={[styles.cardStatus, { color: colors.primaryText }]}>
            Status: Aguardando pauta
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
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  cardStatus: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
});
