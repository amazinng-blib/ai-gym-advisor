/**
 * Profile Business Logic Hook
 * Encapsulates all profile-related operations and state management
 * Senior dev practice: Separation of concerns - logic separated from UI/context
 *
 * This hook handles:
 * - Loading profiles from API
 * - Saving/updating profiles
 * - Field-level updates with optimistic updates
 * - Error handling and state management
 */

import { useCallback, useState } from 'react';
import {
  saveUpdateProfile,
  //   getCurrentUserProfile,
  getProfileById,
} from '../services/api/profileService';
import type { ProfileType } from '../types';

interface UseProfileLogicReturn {
  profile: ProfileType | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  hasAttemptedLoad: boolean;
  isEditing: boolean;
  success: boolean;
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
  setIsEditing: (value: boolean) => void;
  setSuccess: (value: boolean) => void;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType | null>>;
}

/**
 * Custom hook for profile business logic
 * Provides all profile operations with proper state management
 *
 * @param userId - Current authenticated user's ID
 * @returns Object containing profile state and operations
 */
export const useProfileLogic = (
  userId: string | undefined,
): UseProfileLogicReturn => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  /**
   * Load user's profile from API
   * Only attempts load once per user
   */
  const loadProfile = useCallback(async () => {
    if (!userId || hasAttemptedLoad) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasAttemptedLoad(true);

    try {
      const response = await getProfileById(userId);

      if (response.success && response.data) {
        setProfile(response.data);
        console.log('[Profile] Profile loaded successfully:', response.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load profile';
      console.log(
        '[Profile] Profile not found (normal for new users):',
        errorMessage,
      );
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId, hasAttemptedLoad]);

  /**
   * Save or create profile
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
   * Update a single profile field with optimistic updates
   */
  const updateProfileField = useCallback(
    async <K extends keyof ProfileType>(
      field: K,
      value: ProfileType[K],
    ): Promise<void> => {
      if (!profile) {
        throw new Error('Profile not loaded. Cannot update field.');
      }

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
    [],
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset all profile state
   */
  const resetProfile = useCallback(() => {
    setProfile(null);
    setError(null);
    setIsLoading(false);
    setIsSaving(false);
    setHasAttemptedLoad(false);
    setIsEditing(false);
    setSuccess(false);
  }, []);

  return {
    profile,
    isLoading,
    isSaving,
    error,
    hasAttemptedLoad,
    isEditing,
    success,
    loadProfile,
    saveProfile,
    updateProfileField,
    clearError,
    resetProfile,
    setIsEditing,
    setSuccess,
    setProfile,
  };
};
