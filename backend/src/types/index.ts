export interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
