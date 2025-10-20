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
}

export interface CurrentUser {
  camara: any;
  camaraId: string;
  nomeCompleto: string;
  createdAt: string;
  updatedAt: string | null;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: string | null;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface AuthError {
  message: string;
  statusCode?: number;
}
