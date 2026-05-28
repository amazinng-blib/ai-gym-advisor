/**
 * Authentication Context
 * Provides authentication state and methods to all components
 */

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  isAuthenticated,
  getStoredUser,
  refreshToken,
} from '../services/api/authService';
import { clearAuthToken } from '../services/api/client';
import type { AuthCredentials, RegisterCredentials, User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication Provider Component
 * Wraps the application to provide authentication context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize authentication state on app load
   * Checks if user is already logged in
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          const storedUser = getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        clearAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Handle user login
   */
  const login = useCallback(async (credentials: AuthCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔐 Starting login in context...');
      const response = await authLogin(credentials);
      setUser(response.data.user);
      console.log('✅ Login successful in context');
    } catch (err) {
      console.error('❌ Login error caught in context:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
            ? (err as Record<string, unknown>).message
            : 'Login failed';
      setError(String(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle user registration
   */
  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('📝 Starting registration in context...');
      const response = await authRegister(credentials);
      setUser(response.data.user);
      console.log('✅ Registration successful in context');
    } catch (err) {
      console.error('❌ Registration error caught in context:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
            ? (err as Record<string, unknown>).message
            : 'Registration failed';
      setError(String(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle user logout
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authLogout();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  //handle refresh token on app load
  useEffect(() => {
    const handleRefreshToken = async () => {
      try {
        const response = await refreshToken();
        setUser(response.data.user);
      } catch (err) {
        console.error('Failed to refresh token:', err);
        clearAuthToken();
      }
    };

    handleRefreshToken();
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isAuthenticatedValue = useMemo(() => user !== null, [user]);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: isAuthenticatedValue,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [
      user,
      isLoading,
      isAuthenticatedValue,
      error,
      login,
      register,
      logout,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
