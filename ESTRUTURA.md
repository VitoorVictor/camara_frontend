# 📁 Estrutura do Projeto - Câmara Frontend

Este documento descreve a organização completa do projeto após a reestruturação.

## 🎯 Visão Geral

O projeto foi reorganizado seguindo as melhores práticas de desenvolvimento React Native, com separação clara de responsabilidades e estrutura escalável.

## 📂 Estrutura de Diretórios

```
camara_frontend/
│
├── app/                          # Rotas do Expo Router (não mover!)
│   ├── (tabs)/                   # Grupo de rotas com navegação por tabs
│   │   ├── _layout.tsx          # Layout das tabs
│   │   ├── index.tsx            # Tela Home (primeira tab)
│   │   └── explore.tsx          # Tela Explore (segunda tab)
│   ├── _layout.tsx              # Layout raiz da aplicação
│   └── modal.tsx                # Tela de exemplo de modal
│
├── src/                          # 🆕 CÓDIGO FONTE PRINCIPAL
│   │
│   ├── components/               # Componentes reutilizáveis
│   │   ├── common/              # Componentes genéricos (Button, Input, Card)
│   │   ├── ui/                  # Componentes do design system
│   │   │   ├── collapsible.tsx
│   │   │   ├── icon-symbol.tsx
│   │   │   └── icon-symbol.ios.tsx
│   │   └── layout/              # Componentes de layout
│   │       ├── external-link.tsx
│   │       ├── haptic-tab.tsx
│   │       ├── hello-wave.tsx
│   │       ├── parallax-scroll-view.tsx
│   │       ├── themed-text.tsx
│   │       └── themed-view.tsx
│   │
│   ├── screens/                 # 🆕 Telas da aplicação
│   │   └── README.md           # Documentação sobre como criar screens
│   │
│   ├── services/                # 🆕 Serviços e integrações
│   │   ├── api/
│   │   │   └── client.ts       # Cliente HTTP configurado
│   │   └── storage/
│   │       └── asyncStorage.ts # Wrapper para AsyncStorage
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── use-color-scheme.ts
│   │   ├── use-color-scheme.web.ts
│   │   └── use-theme-color.ts
│   │
│   ├── contexts/                # 🆕 Contexts do React
│   │   └── AuthContext.tsx     # Exemplo de Context de autenticação
│   │
│   ├── utils/                   # 🆕 Funções utilitárias
│   │   ├── formatters.ts       # Formatadores (data, moeda, etc)
│   │   └── validators.ts       # Validadores (email, CPF, etc)
│   │
│   ├── types/                   # 🆕 Tipos TypeScript
│   │   ├── api.types.ts        # Tipos de API
│   │   ├── models.types.ts     # Modelos de dados
│   │   └── navigation.types.ts # Tipos de navegação
│   │
│   ├── constants/               # Constantes da aplicação
│   │   └── theme.ts
│   │
│   ├── styles/                  # 🆕 Estilos globais
│   │
│   └── README.md               # Documentação da estrutura src/
│
├── assets/                      # Assets estáticos (imagens, fontes)
│   └── images/
│
├── scripts/                     # Scripts auxiliares
│   └── reset-project.js
│
├── tsconfig.json               # ✏️ Configuração TypeScript (atualizado)
├── package.json
├── app.json
└── ESTRUTURA.md               # 🆕 Este arquivo
```

## 🔧 Configurações Atualizadas

### tsconfig.json

Adicionados paths específicos para facilitar imports:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["src/components/*"],
      "@/screens/*": ["src/screens/*"],
      "@/services/*": ["src/services/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/contexts/*": ["src/contexts/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"],
      "@/constants/*": ["src/constants/*"],
      "@/styles/*": ["src/styles/*"]
    }
  }
}
```

## 📝 Como Usar

### Imports

Use os alias configurados para imports limpos:

```typescript
// ✅ Correto
import { ThemedText } from "@/components/layout/themed-text";
import { HomeScreen } from "@/screens/Home";
import { api } from "@/services/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/utils/formatters";
import { User } from "@/types/models.types";

// ❌ Evite imports relativos profundos
import { ThemedText } from "../../../src/components/layout/themed-text";
```

### Criando uma Nova Screen

1. Crie a pasta em `src/screens/`:

```
src/screens/MinhaScreen/
  MinhaScreen.tsx
  MinhaScreen.styles.ts
  index.ts
```

2. Crie a rota em `app/`:

```typescript
// app/minha-screen.tsx
import { MinhaScreen } from "@/screens/MinhaScreen";
export default MinhaScreen;
```

### Criando um Novo Serviço

```typescript
// src/services/api/userService.ts
import { api } from "./client";
import { User } from "@/types/models.types";

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get("/user/profile");
    return response.data;
  },
};
```

### Criando um Componente Reutilizável

```typescript
// src/components/common/Button/Button.tsx
import { TouchableOpacity, Text } from "react-native";
import { styles } from "./Button.styles";

interface ButtonProps {
  title: string;
  onPress: () => void;
}

export function Button({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

// src/components/common/Button/index.ts
export { Button } from "./Button";
```

## 🎯 Princípios de Organização

### 1. Separação de Responsabilidades

- **app/**: Apenas configuração de rotas
- **src/screens/**: Lógica de apresentação das telas
- **src/components/**: Componentes reutilizáveis
- **src/services/**: Lógica de negócio e integrações

### 2. Componentes por Tipo

- **common/**: Componentes genéricos (Button, Input)
- **ui/**: Design system (IconSymbol, Collapsible)
- **layout/**: Layout específico (ThemedText, ThemedView)

### 3. Colocation

Mantenha arquivos relacionados próximos:

```
/MinhaScreen
  MinhaScreen.tsx
  MinhaScreen.styles.ts
  MinhaScreen.test.tsx
  /components (se necessário)
```

### 4. Feature Isolation

Cada funcionalidade deve ser independente quando possível.

## 📚 Documentação Adicional

- `src/README.md` - Documentação detalhada da pasta src/
- `src/screens/README.md` - Como criar e organizar screens
- Cada arquivo de exemplo contém comentários explicativos

## 🚀 Próximos Passos

1. **Criar suas primeiras screens** em `src/screens/`
2. **Implementar serviços de API** em `src/services/api/`
3. **Adicionar componentes comuns** em `src/components/common/`
4. **Configurar contexts** em `src/contexts/`
5. **Definir tipos** em `src/types/`

## 💡 Dicas

- Sempre use TypeScript para type-safety
- Mantenha componentes pequenos e focados
- Extraia lógica complexa para hooks ou serviços
- Use o ESLint para manter código consistente
- Documente código complexo com comentários

## 🔄 Migrando Código Antigo

Se você tinha código na estrutura antiga:

1. **Componentes**: Mova de `components/` para `src/components/`
2. **Hooks**: Mova de `hooks/` para `src/hooks/`
3. **Constants**: Mova de `constants/` para `src/constants/`
4. **Atualize imports** para usar os novos paths

Todos os imports já foram atualizados automaticamente! ✅

## 📞 Suporte

Consulte os arquivos README.md em cada pasta para mais detalhes sobre como usar cada parte da estrutura.
