/**
 * Profile Context
 * Manages profile state and provides profile-related operations
 * Follows Redux-like state management patterns for reliability
 */

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  saveUpdateProfile,
  getCurrentUserProfile,
} from '../services/api/profileService';
import type { ProfileType } from '../types';
import { useAuth } from '../hooks/useAuth';

/**
 * Profile context type definition
 * Ensures type safety for all profile operations
 */
interface ProfileContextType {
  profile: ProfileType | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  hasProfile: boolean;
  loadProfile: () => Promise<void>;
  saveProfile: (
    profileData: Partial<Omit<ProfileType, 'id' | 'userId'>>,
  ) => Promise<ProfileType>;
  updateProfileField: <K extends keyof ProfileType>(
    field: K,
    value: ProfileType[K],
  ) => Promise<void>;
  clearError: () => void;
  resetProfile: () => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined,
);

interface ProfileProviderProps {
  children: React.ReactNode;
}

/**
 * Profile Provider Component
 * Manages profile state and operations
 *
 * Senior dev practices:
 * - Lazy loads profile data when needed
 * - Handles partial updates efficiently
 * - Provides type-safe field updates
 * - Proper error handling and user feedback
 * - Memoized context value to prevent unnecessary re-renders
 */
export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();

  // State management
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load user's profile from API
   * Only loads if user is authenticated and doesn't already have profile in state
   */
  const loadProfile = useCallback(async () => {
    if (!user?.id || profile !== null) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`[Profile] Loading profile for authenticated user`);
      const response = await getCurrentUserProfile();

      if (response.success && response.data) {
        setProfile(response.data);
        console.log('[Profile] Profile loaded successfully:', response.data);
      }
    } catch (err) {
      // Profile might not exist yet, which is OK for new users
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load profile';

      console.log(
        '[Profile] Profile not found or error loading:',
        errorMessage,
      );
      // Don't set error here since missing profile is expected for new users
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, profile]);

  /**
   * Save or create profile
   * Handles both initial creation and updates
   */
  const saveProfile = useCallback(
    async (
      profileData: Partial<Omit<ProfileType, 'id' | 'userId'>>,
    ): Promise<ProfileType> => {
      setIsSaving(true);
      setError(null);

      try {
        console.log('[Profile] Saving profile data:', profileData);

        const response = await saveUpdateProfile(profileData);

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to save profile');
        }

        setProfile(response.data);
        console.log('[Profile] Profile saved successfully:', response.data);

        return response.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to save profile';

        console.error('[Profile] Error saving profile:', errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  /**
   * Update a single profile field
   * Type-safe field updates with proper validation
   * More efficient than full profile updates
   */
  const updateProfileField = useCallback(
    async <K extends keyof ProfileType>(
      field: K,
      value: ProfileType[K],
    ): Promise<void> => {
      if (!profile) {
        throw new Error('Profile not loaded. Cannot update field.');
      }

      // Optimistic update
      const previousProfile = profile;
      setProfile((prev) => (prev ? { ...prev, [field]: value } : null));

      try {
        console.log(`[Profile] Updating field ${String(field)}:`, value);

        const response = await saveUpdateProfile({
          [field]: value,
        });

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update profile field');
        }

        setProfile(response.data);
        console.log('[Profile] Field updated successfully:', response.data);
      } catch (err) {
        // Rollback on error
        setProfile(previousProfile);

        const errorMessage =
          err instanceof Error
            ? err.message
            : `Failed to update ${String(field)}`;

        console.error('[Profile] Error updating field:', errorMessage);
        setError(errorMessage);
        throw err;
      }
    },
    [profile],
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset profile state
   * Useful for logout or resetting UI state
   */
  const resetProfile = useCallback(() => {
    setProfile(null);
    setError(null);
    setIsLoading(false);
    setIsSaving(false);
  }, []);

  /**
   * Initialize profile on auth state change
   * Automatically loads profile when user logs in
   */
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadProfile();
    } else {
      resetProfile();
    }
  }, [isAuthenticated, user?.id, loadProfile, resetProfile]);

  /**
   * Computed property: hasProfile
   * Useful for conditional rendering
   */
  const hasProfile = useMemo(() => profile !== null, [profile]);

  /**
   * Memoize context value to prevent unnecessary re-renders
   * Only recalculates when actual values change
   */
  const value: ProfileContextType = useMemo(
    () => ({
      profile,
      isLoading,
      isSaving,
      error,
      hasProfile,
      loadProfile,
      saveProfile,
      updateProfileField,
      clearError,
      resetProfile,
    }),
    [
      profile,
      isLoading,
      isSaving,
      error,
      hasProfile,
      loadProfile,
      saveProfile,
      updateProfileField,
      clearError,
      resetProfile,
    ],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
