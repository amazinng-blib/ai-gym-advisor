/**
 * Global type definitions for the application
 */

export interface User {
  id?: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  isLoading: boolean;
}
