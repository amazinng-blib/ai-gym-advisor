/**
 * Profile Context
 * Manages profile state and provides profile-related operations
 * Clean architecture: Uses useProfileLogic hook for business logic
 */

import React, { createContext, useEffect, useMemo, useState } from 'react';
import type { ProfileType } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useProfileLogic } from '../hooks/useProfileLogic';

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
  formData: Partial<Omit<ProfileType, 'id' | 'userId'>>;
  setFormData: React.Dispatch<
    React.SetStateAction<Partial<Omit<ProfileType, 'id' | 'userId'>>>
  >;
  handleFormdataChange: (field: keyof ProfileType, value: string) => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined,
);

interface ProfileProviderProps {
  children: React.ReactNode;
}

/**
 * Profile Provider Component
 * Wraps the app and provides profile context
 *
 * Architecture:
 * - Uses useProfileLogic hook for all business logic
 * - Handles auth state changes and profile initialization
 * - Provides memoized context value
 */
export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<
    Partial<Omit<ProfileType, 'id' | 'userId'>>
  >({});

  // Use the profile logic hook for all business logic
  const profileLogic = useProfileLogic(user?.id);

  /**
   * Initialize profile on auth state change
   * Automatically loads profile when user logs in
   */
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      profileLogic.loadProfile();
    } else {
      profileLogic.resetProfile();
    }
  }, [isAuthenticated, user?.id, profileLogic]);

  /**
   * Computed property: hasProfile
   */
  const hasProfile = useMemo(
    () => profileLogic.profile !== null,
    [profileLogic.profile],
  );

  const handleFormdataChange = (field: keyof ProfileType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Memoize context value to prevent unnecessary re-renders
   */
  const value: ProfileContextType = useMemo(
    () => ({
      profile: profileLogic.profile,
      isLoading: profileLogic.isLoading,
      isSaving: profileLogic.isSaving,
      error: profileLogic.error,
      hasProfile,
      isEditing: profileLogic.isEditing,
      success: profileLogic.success,
      loadProfile: profileLogic.loadProfile,
      saveProfile: profileLogic.saveProfile,
      updateProfileField: profileLogic.updateProfileField,
      clearError: profileLogic.clearError,
      resetProfile: profileLogic.resetProfile,
      setIsEditing: profileLogic.setIsEditing,
      setSuccess: profileLogic.setSuccess,
      formData: formData,
      setFormData: setFormData,
      handleFormdataChange,
    }),
    [
      profileLogic.profile,
      profileLogic.isLoading,
      profileLogic.isSaving,
      profileLogic.error,
      profileLogic.isEditing,
      profileLogic.success,
      profileLogic.loadProfile,
      profileLogic.saveProfile,
      profileLogic.updateProfileField,
      profileLogic.clearError,
      profileLogic.resetProfile,
      profileLogic.setIsEditing,
      profileLogic.setSuccess,
      hasProfile,
      formData,
      setFormData,
      handleFormdataChange,
    ],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
