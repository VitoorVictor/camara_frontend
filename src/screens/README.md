# Screens (Telas)

Esta pasta contém as telas/páginas da aplicação.

## 📝 Convenções

### Estrutura de uma Screen

Cada screen complexa deve ter sua própria pasta:

```
/screens
  /Home
    HomeScreen.tsx       # Componente principal da tela
    HomeScreen.styles.ts # Estilos da tela
    index.ts            # Re-export para facilitar import
  /Profile
    ProfileScreen.tsx
    ProfileScreen.styles.ts
    index.ts
```

Para screens simples, um único arquivo é suficiente:

```
/screens
  PrivacyPolicyScreen.tsx
  TermsScreen.tsx
```

## 🎯 Responsabilidades de uma Screen

Uma screen deve:

1. **Apresentação**: Renderizar a UI da tela
2. **Estado Local**: Gerenciar estado específico da tela
3. **Navegação**: Lidar com navegação entre telas
4. **Integração**: Fazer chamadas a serviços e hooks
5. **Layout**: Compor componentes reutilizáveis

Uma screen NÃO deve:

- ❌ Conter lógica de negócio complexa (use serviços)
- ❌ Fazer chamadas diretas à API (use serviços)
- ❌ Ser reutilizada em outros lugares (use componentes)
- ❌ Conter componentes genéricos (mova para `/components`)

## 📖 Exemplo Completo

### HomeScreen.tsx

```typescript
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/layout/themed-text";
import { ThemedView } from "@/components/layout/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { styles } from "./HomeScreen.styles";

export function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // const response = await someService.getData();
      // setData(response);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Bem-vindo, {user?.name}!</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>{/* Conteúdo da tela */}</ThemedView>
    </ScrollView>
  );
}
```

### HomeScreen.styles.ts

```typescript
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
});
```

### index.ts

```typescript
export { HomeScreen } from "./HomeScreen";
export { styles } from "./HomeScreen.styles";
```

## 🔄 Integração com Expo Router

As screens ficam nesta pasta, mas as **rotas** ficam na pasta `/app`:

```typescript
// app/(tabs)/home.tsx
import { HomeScreen } from "@/screens/Home";

export default HomeScreen;
```

Isso mantém a lógica de apresentação separada da configuração de rotas.

## 💡 Dicas

### 1. Use Hooks Customizados

Se a lógica da tela ficar complexa, extraia para um hook:

```typescript
// src/hooks/useHomeScreen.ts
export function useHomeScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    // lógica...
  }

  return { data, loading, loadData };
}

// HomeScreen.tsx
import { useHomeScreen } from "@/hooks/useHomeScreen";

export function HomeScreen() {
  const { data, loading } = useHomeScreen();
  // ...
}
```

### 2. Componentes Locais

Se um componente é usado apenas nesta screen, você pode criar uma subpasta:

```
/Home
  HomeScreen.tsx
  HomeScreen.styles.ts
  /components
    HomeHeader.tsx
    HomeCard.tsx
  index.ts
```

### 3. Tratamento de Erros

Sempre trate erros e mostre feedback ao usuário:

```typescript
const [error, setError] = useState<string | null>(null);

try {
  // operação...
} catch (error) {
  setError("Erro ao carregar dados");
  console.error(error);
}

if (error) {
  return <ErrorMessage message={error} />;
}
```

### 4. Loading States

Sempre mostre feedback de loading:

```typescript
if (loading) {
  return <LoadingSpinner />;
}
```

### 5. Type-Safety na Navegação

Use tipos para navegação type-safe:

```typescript
import { RootNavigationProp } from "@/types/navigation.types";

type Props = {
  navigation: RootNavigationProp;
};

export function ProfileScreen({ navigation }: Props) {
  navigation.navigate("Home");
}
```
