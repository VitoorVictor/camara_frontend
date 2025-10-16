# Câmara Frontend 📱

Projeto React Native com Expo Router, TypeScript e NativeWind (Tailwind CSS).

## 🎨 Stack Tecnológica

- ⚛️ **React Native** - Framework mobile
- 📱 **Expo** - Plataforma de desenvolvimento
- 🧭 **Expo Router** - Navegação file-based
- 🎨 **NativeWind (Tailwind CSS)** - Estilização
- 📘 **TypeScript** - Tipagem estática
- 🏗️ **Arquitetura organizada** - Estrutura escalável

## 🚀 Como Começar

1. **Instalar dependências**

   ```bash
   npm install
   ```

2. **Iniciar o app**

   ```bash
   npm start
   ```

   Ou para plataformas específicas:

   ```bash
   npm run android    # Android
   npm run ios        # iOS
   npm run web        # Web
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## 📁 Estrutura do Projeto

```
├── app/              # Rotas do Expo Router
│   ├── (tabs)/      # Navegação por tabs
│   └── _layout.tsx
├── src/              # Código fonte
│   ├── components/  # Componentes reutilizáveis
│   ├── screens/     # Telas da aplicação
│   ├── services/    # APIs e serviços
│   ├── hooks/       # Custom hooks
│   ├── contexts/    # React contexts
│   ├── utils/       # Funções utilitárias
│   ├── types/       # Tipos TypeScript
│   └── constants/   # Constantes
└── assets/          # Imagens, fontes, etc
```

**📚 Documentação completa:**

- [`ESTRUTURA.md`](./ESTRUTURA.md) - Estrutura detalhada do projeto
- [`TAILWIND_NATIVEWIND.md`](./TAILWIND_NATIVEWIND.md) - Guia completo do Tailwind/NativeWind
- [`src/README.md`](./src/README.md) - Documentação da pasta src/
- [`src/screens/README.md`](./src/screens/README.md) - Como criar screens

## 🎨 Estilização com Tailwind CSS

Este projeto usa **NativeWind** para trazer o Tailwind CSS ao React Native:

```typescript
import { View, Text } from "react-native";
import { Button } from "@/components/common/Button";

export function MinhaTela() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-500 p-4">
      <Text className="text-white text-2xl font-bold mb-4">
        Olá, NativeWind!
      </Text>
      <Button title="Clique aqui" onPress={() => {}} />
    </View>
  );
}
```

Veja o guia completo: [`TAILWIND_NATIVEWIND.md`](./TAILWIND_NATIVEWIND.md)

## 🧩 Componentes Prontos

O projeto já inclui componentes estilizados com Tailwind:

- **Button** - Botão com variantes (primary, secondary, outline)
- **Card** - Cards com diferentes estilos
- **Input** - Input com label, erro e helper text

```typescript
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
```

## 🛠️ Scripts Úteis

```bash
npm start          # Inicia o Expo
npm run android    # Abre no Android
npm run ios        # Abre no iOS
npm run web        # Abre no navegador
npm run lint       # Roda o linter
```

## 💡 Dicas de Desenvolvimento

### Criar uma nova Screen

1. Crie em `src/screens/MinhaScreen/MinhaScreen.tsx`
2. Adicione rota em `app/minha-screen.tsx`

```typescript
// app/minha-screen.tsx
import { MinhaScreen } from "@/screens/MinhaScreen";
export default MinhaScreen;
```

### Imports com Alias

Use os alias configurados para imports limpos:

```typescript
import { Button } from "@/components/common/Button";
import { HomeScreen } from "@/screens/Home";
import { api } from "@/services/api/client";
import { formatDate } from "@/utils/formatters";
```

## 📚 Recursos

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Native](https://reactnative.dev/)

## 🎯 Próximos Passos

1. ✅ Estrutura de pastas organizada
2. ✅ Tailwind CSS configurado
3. ✅ Componentes básicos criados
4. ⬜ Criar suas screens personalizadas
5. ⬜ Implementar serviços de API
6. ⬜ Adicionar autenticação

Consulte os arquivos de documentação para mais detalhes!
