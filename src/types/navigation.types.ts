/**
 * Tipos de navegação para type-safety nas rotas
 *
 * Referência: https://reactnavigation.org/docs/typescript/
 */

import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Defina os parâmetros de cada tela
export type RootStackParamList = {
  "(tabs)": undefined;
  modal: undefined;
  // Adicione suas rotas aqui:
  // Profile: { userId: string };
  // PostDetails: { postId: string };
};

export type TabsParamList = {
  index: undefined;
  explore: undefined;
  // Adicione suas tabs aqui:
  // profile: undefined;
  // settings: undefined;
};

// Helpers para tipos de navegação e rotas
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type RootRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

// Exemplo de uso:
// import { RootNavigationProp } from '@/types/navigation.types';
//
// type Props = {
//   navigation: RootNavigationProp;
// };
