/**
 * Custom Hook: useProfile
 * Provides access to profile context throughout the application
 *
 * Usage:
 * const { profile, saveProfile, updateProfileField } = useProfile();
 */

import { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';

/**
 * Hook to access profile context
 *
 * @throws Error if used outside of ProfileProvider
 * @returns Profile context with profile data and operations
 *
 * Senior dev practice:
 * - Validates that hook is used within correct provider
 * - Provides clear error message for debugging
 * - Type-safe context access
 */
export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (context === undefined) {
    throw new Error(
      'useProfile must be used within a ProfileProvider. ' +
        'Make sure ProfileProvider wraps your component tree in App.tsx',
    );
  }

  return context;
};
