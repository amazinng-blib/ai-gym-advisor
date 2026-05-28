/**
 * Custom Hook: useAuth
 * Provides access to authentication context throughout the application
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook to access authentication context
 * @throws Error if used outside of AuthProvider
 * @returns Authentication context with user, loading, and auth methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
