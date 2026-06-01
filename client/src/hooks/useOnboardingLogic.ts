/**
 * Onboarding Business Logic Hook
 * Encapsulates all onboarding-related operations
 * Senior dev practice: Separation of concerns - logic separated from UI/context
 *
 * This hook handles:
 * - Form data management
 * - Form field updates
 * - Profile submission logic
 * - Loading and error states
 */

import { useState, useCallback } from 'react';
import type { ProfileType } from '../types';

export interface OnboardingFormData {
  goal: string;
  experience: string;
  daysPerWeek: string;
  sessionLength: string;
  equipment: string;
  injuries: string;
  preferredSplit: string;
}

interface UseOnboardingLogicReturn {
  formData: OnboardingFormData;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  updateFormField: (field: keyof OnboardingFormData, value: string) => void;
  resetForm: () => void;
  clearError: () => void;
  setSuccess: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  convertFormDataToPayload: () => Partial<Omit<ProfileType, 'id' | 'userId'>>;
}

const DEFAULT_FORM_DATA: OnboardingFormData = {
  goal: 'bulk',
  experience: 'intermediate',
  daysPerWeek: '4',
  sessionLength: '60',
  equipment: 'full_gym',
  injuries: '',
  preferredSplit: 'upper_lower',
};

/**
 * Custom hook for onboarding form logic
 * Manages form state and conversion to API payload
 *
 * @returns Object containing form state and operations
 */
export const useOnboardingLogic = (): UseOnboardingLogicReturn => {
  const [formData, setFormData] =
    useState<OnboardingFormData>(DEFAULT_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Update a single form field
   */
  const updateFormField = useCallback(
    (field: keyof OnboardingFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  /**
   * Reset form to default values
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    setError(null);
    setSuccess(false);
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Convert camelCase form data to snake_case API payload
   * Filters out empty optional fields
   */
  const convertFormDataToPayload = useCallback((): Partial<
    Omit<ProfileType, 'id' | 'userId'>
  > => {
    return {
      goal: formData.goal,
      experience: formData.experience,
      days_per_week: formData.daysPerWeek,
      session_length: formData.sessionLength,
      equipment: formData.equipment,
      injuries: formData.injuries || undefined,
      preferred_split: formData.preferredSplit,
    };
  }, [formData]);

  return {
    formData,
    isLoading,
    error,
    success,
    updateFormField,
    resetForm,
    clearError,
    setSuccess,
    setIsLoading,
    setError,
    convertFormDataToPayload,
  };
};
