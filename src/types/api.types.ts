/**
 * Tipos relacionados a requisições e respostas de API
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Tipos de requisição
export interface LoginRequest {
  userName: string;
  password: string;
}

// Tipos específicos para sua API
export interface LoginResponse {
  accessToken: string;
  expiration: string;
  currentUser: CurrentUser;
  nome: string;
  presidente: boolean;
}

export interface CurrentUser {
  camaraId: string;
  id: string;
  usuario: string;
  nome: string;
  presidente: boolean;
}

export interface AuthError {
  message: string;
  statusCode?: number;
}
