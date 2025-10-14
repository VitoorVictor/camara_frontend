/**
 * Tipos de modelos de dados da aplicação
 * Defina aqui as interfaces dos seus modelos
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

// Adicione mais modelos conforme necessário
// Exemplo:
// export interface Product {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
//   imageUrl: string;
// }
