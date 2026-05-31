/**
 * API Services Index
 * Central export point for all API services
 * Single entry point for importing API functions throughout the app
 */

export {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  setAuthToken,
  clearAuthToken,
} from './client';
export {
  login,
  register,
  logout,
  getCurrentUser,
  refreshToken,
  isAuthenticated,
  getStoredUser,
} from './authService';
export {
  saveUpdateProfile,
  getProfileById,
  getCurrentUserProfile,
  getProfileByUserId,
} from './profileService';
