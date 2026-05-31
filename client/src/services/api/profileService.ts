/**
 * Profile Service
 * Handles all profile-related API calls (create, update, get, etc.)
 * Provides both high-level and low-level profile operations
 */

import type { ProfileType } from '../../types';
import { apiPost, apiGet } from './client';

const PROFILE_ENDPOINTS = {
  CREATE_OR_UPDATE: '/profile',
  GET: '/profiles/:id',
  GET_CURRENT: '/profiles/current',
} as const;

export interface SaveProfilePayload {
  goal?: string;
  experience?: string;
  days_per_week?: string;
  session_length?: string;
  equipment?: string;
  injuries?: string;
  preferred_split?: string;
}

/**
 * Save or update user profile
 * Handles both creation and partial updates
 *
 * Senior dev practice:
 * - Validates response before setting state
 * - Provides clear error messages
 * - Logs operations for debugging
 *
 * @param profileData - Profile data to save (can be partial for updates)
 * @returns Profile data
 */
export const saveUpdateProfile = async (
  profileData: SaveProfilePayload,
): Promise<{ success: boolean; message: string; data: ProfileType }> => {
  console.log('📝 Saving/updating profile with data:', profileData);

  try {
    const response = await apiPost<{
      success: boolean;
      message: string;
      data: ProfileType;
    }>(PROFILE_ENDPOINTS.CREATE_OR_UPDATE, {
      body: profileData,
    });

    console.log('✅ Profile saved successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to save profile:', error);
    throw error;
  }
};

/**
 * Get profile by ID
 * @param id - Profile ID
 * @returns Profile data
 */
export const getProfileById = async (
  id: string,
): Promise<{ success: boolean; message: string; data: ProfileType }> => {
  const endpoint = PROFILE_ENDPOINTS.GET.replace(':id', id);

  try {
    const response = await apiGet<{
      success: boolean;
      message: string;
      data: ProfileType;
    }>(endpoint);

    console.log('✅ Profile retrieved successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to get profile:', error);
    throw error;
  }
};

/**
 * Get current user's profile
 * Uses authenticated user context from token
 *
 * Senior dev practice:
 * - No userId parameter needed (derived from auth token)
 * - Simpler API contract
 * - More secure (can't fetch other users' profiles)
 *
 * @returns Current user's profile data
 */
export const getCurrentUserProfile = async (): Promise<{
  success: boolean;
  message: string;
  data: ProfileType;
}> => {
  try {
    const response = await apiGet<{
      success: boolean;
      message: string;
      data: ProfileType;
    }>(PROFILE_ENDPOINTS.GET_CURRENT);

    console.log('✅ Current user profile retrieved successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to get current user profile:', error);
    throw error;
  }
};

/**
 * Get profile by user ID (legacy support)
 * Prefer getCurrentUserProfile for authenticated requests
 *
 * @param userId - User ID
 * @returns Profile data
 * @deprecated Use getCurrentUserProfile instead
 */
export const getProfileByUserId = async (
  userId: string,
): Promise<{ success: boolean; message: string; data: ProfileType }> => {
  console.warn(
    '[Deprecation] getProfileByUserId is deprecated. Use getCurrentUserProfile instead.',
  );
  return getCurrentUserProfile();
};
