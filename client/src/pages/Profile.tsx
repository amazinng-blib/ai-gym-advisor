import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import { useState, useEffect } from 'react';
import Textarea from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { saveUpdateProfile } from '../services/api';
import type { ProfileType } from '../types';

const goalOptions = [
  { value: 'muscle-gain', label: 'Build Muscle (Muscle Gain)' },
  { value: 'fat-loss', label: 'Lose Fat (Fat Loss)' },
  { value: 'maintenance', label: 'Maintain Current Physique' },
  { value: 'strength', label: 'Increase Strength' },
];

const experienceOptions = [
  { value: 'beginner', label: 'Beginner (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)' },
  { value: 'advanced', label: 'Advanced (3+ years)' },
];

const daysOptions = [
  { value: '3', label: '3 days per week' },
  { value: '4', label: '4 days per week' },
  { value: '5', label: '5 days per week' },
  { value: '6', label: '6 days per week' },
];

const sessionOptions = [
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '60 minutes' },
  { value: '90', label: '90 minutes' },
];

const equipmentOptions = [
  { value: 'full-gym', label: 'Full Gym Access' },
  { value: 'home', label: 'Home Gym' },
  { value: 'dumbbells', label: 'Dumbbells Only' },
];

const splitOptions = [
  { value: 'ppl', label: 'Push/Pull/Legs' },
  { value: 'upper-lower', label: 'Upper/Lower Split' },
  { value: 'full-body', label: 'Full Body' },
  { value: 'bro-split', label: 'Bro Split' },
];

const Profile = () => {
  const { user, isLoading } = useAuth();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [formData, setFormData] = useState<Partial<ProfileType>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch the profile here
    // For now, we'll initialize with empty data
    if (user) {
      setFormData({
        goal: '',
        experience: '',
        days_per_week: '',
        session_length: '',
        equipment: '',
        injuries: '',
        preferred_split: '',
      });
    }
  }, [user]);

  if (!user && !isLoading) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Build payload with only updated fields
      const payload: Record<string, string> = {};

      if (formData.goal) payload.goal = formData.goal;
      if (formData.experience) payload.experience = formData.experience;
      if (formData.days_per_week)
        payload.days_per_week = formData.days_per_week;
      if (formData.session_length)
        payload.session_length = formData.session_length;
      if (formData.equipment) payload.equipment = formData.equipment;
      if (formData.injuries) payload.injuries = formData.injuries;
      if (formData.preferred_split)
        payload.preferred_split = formData.preferred_split;

      console.log('📝 Updating profile with:', payload);

      const response = await saveUpdateProfile(payload);

      console.log('✅ Profile updated successfully:', response);
      setSuccess(true);
      setProfile(response.data);
      setIsEditing(false);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to update profile. Please try again.';
      console.error('❌ Error updating profile:', err);
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-2xl mx-auto">
        <Card variant="bordered">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Your Profile</h1>
              <p className="text-muted">Manage your workout preferences</p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="ghost">
                Edit Profile
              </Button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 items-start">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2 items-start">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm">
                Profile updated successfully!
              </p>
            </div>
          )}

          {isEditing ? (
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  id="goal"
                  label="Primary Goal"
                  options={goalOptions}
                  value={formData.goal || ''}
                  onChange={(e) => updateFormData('goal', e.target.value)}
                  disabled={isSaving}
                />
                <Select
                  id="experience"
                  label="Experience Level"
                  options={experienceOptions}
                  value={formData.experience || ''}
                  onChange={(e) => updateFormData('experience', e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  id="days_per_week"
                  label="Days Per Week"
                  options={daysOptions}
                  value={formData.days_per_week || ''}
                  onChange={(e) =>
                    updateFormData('days_per_week', e.target.value)
                  }
                  disabled={isSaving}
                />
                <Select
                  id="session_length"
                  label="Session Length"
                  options={sessionOptions}
                  value={formData.session_length || ''}
                  onChange={(e) =>
                    updateFormData('session_length', e.target.value)
                  }
                  disabled={isSaving}
                />
              </div>

              <Select
                id="equipment"
                label="Equipment Available"
                options={equipmentOptions}
                value={formData.equipment || ''}
                onChange={(e) => updateFormData('equipment', e.target.value)}
                disabled={isSaving}
              />

              <Select
                id="preferred_split"
                label="Preferred Split"
                options={splitOptions}
                value={formData.preferred_split || ''}
                onChange={(e) =>
                  updateFormData('preferred_split', e.target.value)
                }
                disabled={isSaving}
              />

              <Textarea
                id="injuries"
                label="Injuries or Limitations (optional)"
                rows={3}
                value={formData.injuries || ''}
                onChange={(e) => updateFormData('injuries', e.target.value)}
                disabled={isSaving}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {profile ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted">Primary Goal</p>
                      <p className="text-lg font-semibold">{profile.goal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Experience Level</p>
                      <p className="text-lg font-semibold">
                        {profile.experience}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Days Per Week</p>
                      <p className="text-lg font-semibold">
                        {profile.days_per_week}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Session Length</p>
                      <p className="text-lg font-semibold">
                        {profile.session_length} min
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Equipment</p>
                      <p className="text-lg font-semibold">
                        {profile.equipment}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Preferred Split</p>
                      <p className="text-lg font-semibold">
                        {profile.preferred_split}
                      </p>
                    </div>
                  </div>
                  {profile.injuries && (
                    <div>
                      <p className="text-sm text-muted">Injuries/Limitations</p>
                      <p className="text-lg">{profile.injuries}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted">
                  No profile data available. Edit to add your preferences.
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
