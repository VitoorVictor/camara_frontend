import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionCard } from "@/components/common/ActionCard";
import { SearchBar } from "@/components/common/SearchBar";
import { Header } from "@/components/layout/Header";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const isPresident = true;

  const handleNotificationPress = () => {
    Alert.alert("Notificações", "Você tem 3 novas notificações");
  };

  const handleProfilePress = () => {
    Alert.alert("Perfil", "Abrir perfil do usuário");
  };

  const handleSearch = (text: string) => {
    if (text.trim()) {
      Alert.alert("Pesquisa", `Buscando por: "${text}"`);
    }
  };

  const handleVotingPress = () => {
    router.push("/(tabs)/voting");
  };

  const handleProjectsPress = () => {
    router.push("/(stacks)/projects");
  };

  const handleConfirmVotesPress = () => {
    router.push("/(stacks)/confirm-votes");
  };

  const handleFinalResultsPress = () => {
    router.push("/(stacks)/results");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.secondary }]}>
      <View style={styles.topSection}>
        <View style={styles.decorativeElements}>
          <View style={styles.bar1} />
          <View style={styles.bar2} />
          <View style={styles.bar3} />
        </View>

        <Header
          userRole={isPresident ? "Presidente" : "Vereador"}
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
        />

        <View style={styles.topContent}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Olá, Fulano56!</Text>
          </View>

          <SearchBar
            placeholder="Encontre o que precisa"
            onSearch={handleSearch}
          />
        </View>
      </View>

      <ScrollView
        style={[styles.bottomSection, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {!isPresident && (
          <ActionCard
            title="Sessão"
            subtitle="Votação de propostas"
            iconName="hand.thumbsup.fill"
            onPress={handleVotingPress}
          />
        )}
        {isPresident && (
          <>
            <ActionCard
              title="Acessar Projetos"
              subtitle="Seus projetos"
              iconName="folder.fill"
              onPress={handleProjectsPress}
            />
            <ActionCard
              title="Confirmar Votos"
              subtitle="Finalizar votação da sessão"
              iconName="checkmark.square.fill"
              onPress={handleConfirmVotesPress}
            />
            <ActionCard
              title="Resultado Final"
              subtitle="Visualizar resultado da votação"
              iconName="chart.bar.fill"
              onPress={handleFinalResultsPress}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    height: "50%",
    justifyContent: "space-between",
    position: "relative",
  },
  decorativeElements: {
    position: "absolute",
    bottom: "-5%",
    left: "50%",
    transform: [{ translateX: -120 }],
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 24,
  },
  bar1: {
    width: 64,
    height: 192,
    backgroundColor: "rgba(34, 197, 94, 0.15)", // Verde claro translúcido
    borderRadius: 16,
  },
  bar2: {
    width: 64,
    height: 256,
    backgroundColor: "rgba(34, 197, 94, 0.25)", // Verde mais visível
    borderRadius: 16,
  },
  bar3: {
    width: 64,
    height: 144,
    backgroundColor: "rgba(34, 197, 94, 0.1)", // Verde sutil
    borderRadius: 16,
  },
  topContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  greeting: {
    paddingHorizontal: Spacing.md,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  bottomSection: {
    height: "50%",
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
});
