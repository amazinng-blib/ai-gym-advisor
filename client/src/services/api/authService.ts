/**
 * Authentication Service
 * Handles all auth-related API calls (login, register, logout, etc.)
 */

import type {
  AuthCredentials,
  AuthResponse,
  RegisterCredentials,
  User,
} from '../../types';
import { apiPost, apiGet, setAuthToken, clearAuthToken } from './client';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
} as const;

/**
 * Store user data in localStorage
 */
const storeUserData = (user: User | null): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get stored user data from localStorage
 */
export const getStoredUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Clear user data from localStorage
 */
const clearUserData = (): void => {
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

/**
 * Login user with email and password
 * @param credentials - Email and password
 * @returns User data and authentication token
 */
export const login = async (
  credentials: AuthCredentials,
): Promise<AuthResponse> => {
  const response = await apiPost<AuthResponse>(AUTH_ENDPOINTS.LOGIN, {
    body: credentials,
  });

  // Store token for future requests
  setAuthToken(response.data.token);
  storeUserData(response.data.user);

  return response;
};

/**
 * Register new user
 * @param credentials - Email, password, and name
 * @returns User data and authentication token
 */
export const register = async (
  credentials: RegisterCredentials,
): Promise<AuthResponse> => {
  console.log('🔐 Starting registration with email:', credentials.email);

  try {
    const response = await apiPost<AuthResponse>(AUTH_ENDPOINTS.REGISTER, {
      body: credentials,
    });

    console.log('✅ Registration successful:', response.data.user);

    // Store token for future requests
    console.log('token', response.data.token);
    console.log('user', response.data.user);
    setAuthToken(response.data.token);
    storeUserData(response.data.user);

    return response;
  } catch (error) {
    console.error('❌ Registration failed:', error);
    throw error;
  }
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  try {
    await apiPost(AUTH_ENDPOINTS.LOGOUT);
  } finally {
    clearAuthToken();
    clearUserData();
  }
};

/**
 * Get current user profile
 * @returns Current user data
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await apiGet<AuthResponse>(AUTH_ENDPOINTS.ME);
  storeUserData(response.data.user);
  return response;
};

/**
 * Refresh authentication token
 * @returns New authentication token
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  const storedUser = getStoredUser();
  if (!storedUser) {
    throw new Error('No user data found for token refresh');
  }
  const id = storedUser.id;
  const response = await apiPost<AuthResponse>(AUTH_ENDPOINTS.REFRESH, {
    body: { userId: id },
  });
  setAuthToken(response.data.token);
  return response;
};
