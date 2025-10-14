# Estrutura do Código Fonte

Esta pasta contém todo o código-fonte organizado do projeto.

## 📁 Estrutura de Pastas

### `/components`

Componentes reutilizáveis organizados por categoria:

- **`/common`** - Componentes genéricos (Button, Input, Card, etc.)
- **`/ui`** - Componentes do sistema de UI (IconSymbol, Collapsible, etc.)
- **`/layout`** - Componentes de layout (ThemedText, ThemedView, ParallaxScrollView, etc.)

### `/screens`

Telas/Páginas da aplicação. Cada screen deve:

- Conter sua lógica de apresentação
- Importar componentes necessários
- Gerenciar estado local da tela
- Fazer chamadas a serviços quando necessário

**Exemplo de estrutura:**

```
/screens
  /Home
    HomeScreen.tsx
    HomeScreen.styles.ts
    index.ts
  /Profile
    ProfileScreen.tsx
    ProfileScreen.styles.ts
    index.ts
```

### `/services`

Serviços e integrações externas:

- **`/api`** - Configuração de cliente HTTP, endpoints e interceptors
- **`/storage`** - Gerenciamento de armazenamento local (AsyncStorage)
- Outros serviços como autenticação, notificações, etc.

### `/hooks`

Custom hooks reutilizáveis da aplicação:

- `useColorScheme` - Hook para tema claro/escuro
- `useThemeColor` - Hook para cores do tema
- `useAuth` - Hook para autenticação (exemplo)

### `/contexts`

Contexts da API de Context do React:

- Gerenciamento de estado global
- Provedores de funcionalidades compartilhadas

### `/utils`

Funções utilitárias e helpers:

- Formatadores (datas, moedas, textos)
- Validadores
- Helpers gerais

### `/types`

Definições de tipos TypeScript globais:

- Tipos de API
- Tipos de navegação
- Modelos de dados
- Interfaces compartilhadas

### `/constants`

Constantes da aplicação:

- Temas e cores
- Configurações
- URLs e endpoints
- Valores fixos

### `/styles`

Estilos globais e temas:

- Estilos compartilhados
- Definições de tema
- Variáveis de estilo

## 🎯 Boas Práticas

### Imports

Use os alias configurados no `tsconfig.json`:

```typescript
import { Button } from "@/components/common/Button";
import { HomeScreen } from "@/screens/Home";
import { api } from "@/services/api/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatters";
import { User } from "@/types/models.types";
import { COLORS } from "@/constants/theme";
```

### Organização de Componentes

Cada componente deve ter sua própria pasta quando complexo:

```
/components/common/Button/
  Button.tsx          # Componente principal
  Button.styles.ts    # Estilos
  Button.test.tsx     # Testes (opcional)
  index.ts           # Re-export para importação limpa
```

### Screens

Screens são específicas de rotas e não devem ser reutilizadas:

- Mantenha lógica de negócio nos serviços
- Use hooks para lógica compartilhada
- Componentes reutilizáveis vão em `/components`

### Serviços

Centralize lógica de integração:

- API calls
- Transformação de dados
- Tratamento de erros
- Cache e otimizações

## 📝 Exemplos

### Criando uma nova Screen

```typescript
// src/screens/Profile/ProfileScreen.tsx
import { View } from "react-native";
import { ThemedText } from "@/components/layout/themed-text";
import { useAuth } from "@/hooks/useAuth";

export function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View>
      <ThemedText>Olá, {user.name}!</ThemedText>
    </View>
  );
}
```

### Criando um Serviço

```typescript
// src/services/api/userService.ts
import { api } from "./client";
import { User } from "@/types/models.types";

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put("/user/profile", data);
    return response.data;
  },
};
```

### Criando um Hook

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import { User } from "@/types/models.types";
import { authService } from "@/services/api/authService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário", error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading };
}
```
