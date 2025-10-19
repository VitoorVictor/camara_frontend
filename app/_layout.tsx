import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, FontSizes, FontWeights } from "@/src/constants/theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

// Componente customizado para título com subtítulo
const CustomHeaderTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <View style={styles.headerTitleContainer}>
    <Text style={styles.headerTitle}>{title}</Text>
    <Text style={styles.headerSubtitle}>{subtitle}</Text>
  </View>
);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(stacks)/confirm-votes"
          options={{
            headerTitle: () => (
              <CustomHeaderTitle
                title="Confirmar Votos"
                subtitle="Finalize a votação da sessão atual"
              />
            ),
            headerStyle: { backgroundColor: colors.secondary },
            headerTintColor: "#ffffff",
          }}
        />
        <Stack.Screen
          name="(stacks)/projects"
          options={{
            headerTitle: () => (
              <CustomHeaderTitle
                title="Projetos de Lei"
                subtitle="Gerencie seus projetos e propostas"
              />
            ),
            headerStyle: { backgroundColor: colors.secondary },
            headerTintColor: "#ffffff",
          }}
        />
        <Stack.Screen
          name="(stacks)/results"
          options={{
            headerTitle: () => (
              <CustomHeaderTitle
                title="Resultado Final"
                subtitle="Visualize o resultado da votação"
              />
            ),
            headerStyle: { backgroundColor: colors.secondary },
            headerTintColor: "#ffffff",
          }}
        />
        <Stack.Screen
          name="(stacks)/sessions"
          options={{
            headerTitle: () => (
              <CustomHeaderTitle
                title="Sessões"
                subtitle="Gerencie as sessões legislativas"
              />
            ),
            headerStyle: { backgroundColor: colors.secondary },
            headerTintColor: "#ffffff",
          }}
        />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: "#ffffff",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: "rgba(255, 255, 255, 0.9)",
  },
});
