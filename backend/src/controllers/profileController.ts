import { Response } from 'express';
import { ApiResponse, ProfileType } from '../types';
import ProfileModel from '../models/profile_model';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * Input validation schema for profile creation
 * Senior dev practice: Validate and normalize input early
 */
interface CreateProfilePayload {
  goal: string;
  experience: string;
  days_per_week: string;
  session_length: string;
  equipment: string;
  injuries?: string;
  preferred_split: string;
}

/**
 * Partial profile payload for updates (all fields optional)
 */
interface PartialProfilePayload {
  goal?: string;
  experience?: string;
  days_per_week?: string;
  session_length?: string;
  equipment?: string;
  injuries?: string;
  preferred_split?: string;
}

/**
 * Validate profile creation payload
 * Returns validation errors or normalized payload
 */
const validateProfilePayload = (
  data: any,
): { isValid: boolean; errors?: string[]; data?: CreateProfilePayload } => {
  const errors: string[] = [];

  // Required fields validation
  const requiredFields = [
    'goal',
    'experience',
    'days_per_week',
    'session_length',
    'equipment',
    'preferred_split',
  ];

  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string') {
      errors.push(`${field} is required and must be a string`);
    }
  }

  // Optional field validation
  if (data.injuries && typeof data.injuries !== 'string') {
    errors.push('injuries must be a string');
  }

  // Specific field validations
  const validGoals = [
    'bulk',
    'cut',
    'recomp',
    'maintain',
    'strength',
    'endurance',
  ];
  const validExperience = ['beginner', 'intermediate', 'advanced'];
  const validDaysPerWeek = ['3', '4', '5', '6'];
  const validSessionLength = ['30', '45', '60', '90'];
  const validSplits = ['ppl', 'upper_lower', 'full_body', 'custom'];

  if (data.goal && !validGoals.includes(data.goal.toLowerCase())) {
    errors.push(`goal must be one of: ${validGoals.join(', ')}`);
  }

  if (
    data.experience &&
    !validExperience.includes(data.experience.toLowerCase())
  ) {
    errors.push(`experience must be one of: ${validExperience.join(', ')}`);
  }

  if (data.days_per_week && !validDaysPerWeek.includes(data.days_per_week)) {
    errors.push(`days_per_week must be one of: ${validDaysPerWeek.join(', ')}`);
  }

  if (
    data.session_length &&
    !validSessionLength.includes(data.session_length)
  ) {
    errors.push(
      `session_length must be one of: ${validSessionLength.join(', ')}`,
    );
  }

  if (
    data.preferred_split &&
    !validSplits.includes(data.preferred_split.toLowerCase())
  ) {
    errors.push(`preferred_split must be one of: ${validSplits.join(', ')}`);
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Normalize data
  const normalizedData: CreateProfilePayload = {
    goal: data.goal.toLowerCase(),
    experience: data.experience.toLowerCase(),
    days_per_week: data.days_per_week,
    session_length: data.session_length,
    equipment: data.equipment,
    injuries: data.injuries || null,
    preferred_split: data.preferred_split.toLowerCase(),
  };

  return { isValid: true, data: normalizedData };
};

/**
 * Validate partial profile payload for updates
 * All fields are optional, only validates fields that are provided
 */
const validatePartialProfilePayload = (
  data: any,
): { isValid: boolean; errors?: string[]; data?: PartialProfilePayload } => {
  const errors: string[] = [];

  // If no fields provided, return error
  if (!data || Object.keys(data).length === 0) {
    errors.push('At least one field must be provided for update');
    return { isValid: false, errors };
  }

  // Define allowed fields
  const allowedFields = [
    'goal',
    'experience',
    'days_per_week',
    'session_length',
    'equipment',
    'injuries',
    'preferred_split',
  ];

  // Check for unknown fields
  for (const key of Object.keys(data)) {
    if (!allowedFields.includes(key)) {
      errors.push(`Unknown field: ${key}`);
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Validate each field if provided
  const validGoals = [
    'bulk',
    'cut',
    'recomp',
    'maintain',
    'strength',
    'endurance',
  ];
  const validExperience = ['beginner', 'intermediate', 'advanced'];
  const validDaysPerWeek = ['3', '4', '5', '6'];
  const validSessionLength = ['30', '45', '60', '90'];
  const validSplits = ['ppl', 'upper-lower', 'full-body', 'custom'];

  if (data.goal && !validGoals.includes(data.goal.toLowerCase())) {
    errors.push(`goal must be one of: ${validGoals.join(', ')}`);
  }

  if (
    data.experience &&
    !validExperience.includes(data.experience.toLowerCase())
  ) {
    errors.push(`experience must be one of: ${validExperience.join(', ')}`);
  }

  if (data.days_per_week && !validDaysPerWeek.includes(data.days_per_week)) {
    errors.push(`days_per_week must be one of: ${validDaysPerWeek.join(', ')}`);
  }

  if (
    data.session_length &&
    !validSessionLength.includes(data.session_length)
  ) {
    errors.push(
      `session_length must be one of: ${validSessionLength.join(', ')}`,
    );
  }

  if (
    data.preferred_split &&
    !validSplits.includes(data.preferred_split.toLowerCase())
  ) {
    errors.push(`preferred_split must be one of: ${validSplits.join(', ')}`);
  }

  if (data.injuries && typeof data.injuries !== 'string') {
    errors.push('injuries must be a string');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Normalize provided data
  const normalizedData: PartialProfilePayload = {};

  if (data.goal) normalizedData.goal = data.goal.toLowerCase();
  if (data.experience)
    normalizedData.experience = data.experience.toLowerCase();
  if (data.days_per_week) normalizedData.days_per_week = data.days_per_week;
  if (data.session_length) normalizedData.session_length = data.session_length;
  if (data.equipment) normalizedData.equipment = data.equipment;
  if (data.injuries) normalizedData.injuries = data.injuries;
  if (data.preferred_split)
    normalizedData.preferred_split = data.preferred_split.toLowerCase();

  return { isValid: true, data: normalizedData };
};

/**
 * Create or Update Profile Controller
 * Senior dev practices:
 * - Validates all input
 * - Checks authentication
 * - Uses findOrCreate for create/update in single operation
 * - Supports partial updates (only updates provided fields)
 * - Clear error messages
 * - Proper HTTP status codes
 * - Returns 201 for new profiles, 200 for updates
 */
export const createOrUpdateProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Check authentication
    if (!req.userId) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'User authentication required',
      };
      res.status(401).json(response);
      return;
    }

    // First, check if profile exists for this user
    const existingProfile = await ProfileModel.findOne({
      where: { userId: req.userId },
    });

    let validation;
    let profileData;

    // If profile exists, allow partial updates; otherwise require full data
    if (existingProfile) {
      // For updates, use partial validation
      validation = validatePartialProfilePayload(req.body);
      if (!validation.isValid) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid profile data',
          error: validation.errors?.join('; '),
        };
        res.status(400).json(response);
        return;
      }
      profileData = validation.data as PartialProfilePayload;

      // Update only provided fields
      await existingProfile.update(profileData);

      console.log(
        `[Profile] Successfully updated profile: ${existingProfile.id}`,
      );

      const response: ApiResponse<ProfileType> = {
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: existingProfile.getDataValue('id'),
          userId: existingProfile.getDataValue('userId'),
          goal: existingProfile.getDataValue('goal'),
          experience: existingProfile.getDataValue('experience'),
          days_per_week: existingProfile.getDataValue('days_per_week'),
          session_length: existingProfile.getDataValue('session_length'),
          equipment: existingProfile.getDataValue('equipment'),
          injuries: existingProfile.getDataValue('injuries'),
          preferred_split: existingProfile.getDataValue('preferred_split'),
        },
      };

      res.status(200).json(response);
    } else {
      // For creation, require all fields
      validation = validateProfilePayload(req.body);
      if (!validation.isValid) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid profile data',
          error: validation.errors?.join('; '),
        };
        res.status(400).json(response);
        return;
      }

      profileData = validation.data as CreateProfilePayload;

      // Create new profile
      const newProfile = await ProfileModel.create({
        ...profileData,
        userId: req.userId,
      });

      console.log(`[Profile] Successfully created profile: ${newProfile.id}`);

      const response: ApiResponse<ProfileType> = {
        success: true,
        message: 'Profile created successfully',
        data: {
          id: newProfile.getDataValue('id'),
          userId: newProfile.getDataValue('userId'),
          goal: newProfile.getDataValue('goal'),
          experience: newProfile.getDataValue('experience'),
          days_per_week: newProfile.getDataValue('days_per_week'),
          session_length: newProfile.getDataValue('session_length'),
          equipment: newProfile.getDataValue('equipment'),
          injuries: newProfile.getDataValue('injuries'),
          preferred_split: newProfile.getDataValue('preferred_split'),
        },
      };

      res.status(201).json(response);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    console.error(
      '[Profile] Error creating or updating profile:',
      errorMessage,
    );

    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to create or update profile',
      error: errorMessage,
    };

    res.status(500).json(response);
  }
};

/**
 * Get Profile Controller
 * Retrieve user's profile by ID
 */
export const getProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Profile ID is required',
      };
      res.status(400).json(response);
      return;
    }

    const profile = await ProfileModel.findOne({
      where: {
        userId: id,
      },
    });

    if (!profile) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Profile not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<ProfileType> = {
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        id: profile.getDataValue('id'),
        userId: profile.getDataValue('userId'),
        goal: profile.getDataValue('goal'),
        experience: profile.getDataValue('experience'),
        days_per_week: profile.getDataValue('days_per_week'),
        session_length: profile.getDataValue('session_length'),
        equipment: profile.getDataValue('equipment'),
        injuries: profile.getDataValue('injuries'),
        preferred_split: profile.getDataValue('preferred_split'),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    console.error('[Profile] Error retrieving profile:', errorMessage);

    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to retrieve profile',
      error: errorMessage,
    };

    res.status(500).json(response);
  }
};

/**
 * Update Profile Controller
 * Update user's profile with new data
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Profile ID is required',
      };
      res.status(400).json(response);
      return;
    }

    // Validate payload if provided
    const validation = validateProfilePayload(req.body);
    if (!validation.isValid) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Invalid profile data',
        error: validation.errors?.join('; '),
      };
      res.status(400).json(response);
      return;
    }

    const profile = await ProfileModel.findByPk(id);

    if (!profile) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Profile not found',
      };
      res.status(404).json(response);
      return;
    }

    await profile.update(validation.data as CreateProfilePayload);

    console.log(`[Profile] Successfully updated profile: ${id}`);

    const response: ApiResponse<ProfileType> = {
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: profile.getDataValue('id'),
        userId: profile.getDataValue('userId'),
        goal: profile.getDataValue('goal'),
        experience: profile.getDataValue('experience'),
        days_per_week: profile.getDataValue('days_per_week'),
        session_length: profile.getDataValue('session_length'),
        equipment: profile.getDataValue('equipment'),
        injuries: profile.getDataValue('injuries'),
        preferred_split: profile.getDataValue('preferred_split'),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    console.error('[Profile] Error updating profile:', errorMessage);

    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to update profile',
      error: errorMessage,
    };

    res.status(500).json(response);
  }
};
