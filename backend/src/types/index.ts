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

export type UserType = {
  id?: string;
  email: string;
  name: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
};

export type ProfileType = {
  id?: string;
  userId: string;
  goal: string;
  experience: string;
  days_per_week: string;
  session_length: string;
  equipment: string;
  injuries?: string;
  preferred_split: string;
  created_at?: Date;
  updated_at?: Date;
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
