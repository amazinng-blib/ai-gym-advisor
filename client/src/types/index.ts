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

export interface ProfileType {
  id: string;
  userId: string;
  goal: string;
  experience: string;
  days_per_week: string;
  session_length: string;
  equipment: string;
  injuries?: string;
  preferred_split: string;
  created_at?: string;
  updated_at?: string;
}
