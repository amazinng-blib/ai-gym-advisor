import { Router } from 'express';
import * as profileController from '../controllers/profileController';
import { authenticateToken } from '../middleware/authMiddleware';

const profileRoutes = Router();

/**
 * Profile Routes
 * All routes require authentication
 * Senior dev pattern: Clear separation of concerns, proper middleware application
 */

// Create a new profile - POST /profile
profileRoutes.post(
  '/',
  authenticateToken,
  profileController.createOrUpdateProfile,
);

// Get profile by ID - GET /profile/:id
profileRoutes.get('/:id', authenticateToken, profileController.getProfile);

// Update profile - PUT /profile/:id
// profileRoutes.put('/:id', authenticateToken, profileController.createOrUpdateProfile);

export default profileRoutes;
