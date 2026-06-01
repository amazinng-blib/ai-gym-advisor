import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { ProfileType } from '../types';
import { useProfile } from '../hooks/useProfile';

const goalOptions = [
  {
    value: 'bulk',
    label: 'Build Muscle (Bulk)',
  },
  {
    value: 'cut',
    label: 'Lose Fat (Cut)',
  },
  {
    value: 'recomp',
    label: 'Body Recomposition (Recomp)',
  },
  {
    value: 'maintain',
    label: 'Maintain Current Physique',
  },
  {
    value: 'strength',
    label: 'Increase Strength',
  },
  {
    value: 'endurance',
    label: 'Improve Endurance',
  },
];

const experienceOptions = [
  { value: 'beginner', label: 'Beginner (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)' },
  { value: 'advanced', label: 'Advanced (3+ years)' },
];

const daysOptions = [
  { value: '2', label: '2 days per week' },
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
  { value: 'full_gym', label: 'Full Gym Access' },
  { value: 'home', label: 'Home Gym' },
  { value: 'dumbbells', label: 'Dumbbells Only' },
];

const splitOptions = [
  { value: 'full_body', label: 'Full Body' },
  { value: 'upper_lower', label: 'Upper/Lower Split' },
  { value: 'ppl', label: 'Push/Pull/Legs' },
  { value: 'custom', label: 'Let AI Decide' },
];

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const {
    error,
    isLoading,
    isSaving,
    profile,
    saveProfile,
    clearError,
    isEditing,
    setIsEditing,
    success,
    handleFormdataChange,
    formData,
  } = useProfile();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const handleSaveProfile = async (
    profileData: Partial<Omit<ProfileType, 'id' | 'userId'>>,
  ) => {
    try {
      await saveProfile(profileData);
    } catch (error) {
      console.error('Error saving/updating profile:', error);
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
            {!isEditing && profile && (
              <Button onClick={() => setIsEditing(true)} variant="ghost">
                Edit Profile
              </Button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 items-start">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 text-sm">{error}</p>
                <button
                  onClick={() => clearError()}
                  className="text-xs text-red-600 hover:underline mt-1"
                >
                  Dismiss
                </button>
              </div>
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

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted">Loading profile...</p>
            </div>
          ) : isEditing && profile ? (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile(formData);
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <Select
                  id="goal"
                  label="Primary Goal"
                  options={goalOptions}
                  value={profile.goal || ''}
                  onChange={(e) => handleFormdataChange('goal', e.target.value)}
                  disabled={isSaving}
                />
                <Select
                  id="experience"
                  label="Experience Level"
                  options={experienceOptions}
                  value={profile.experience || ''}
                  onChange={(e) =>
                    handleFormdataChange('experience', e.target.value)
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  id="days_per_week"
                  label="Days Per Week"
                  options={daysOptions}
                  value={profile.days_per_week || ''}
                  onChange={(e) =>
                    handleFormdataChange('days_per_week', e.target.value)
                  }
                  disabled={isSaving}
                />
                <Select
                  id="session_length"
                  label="Session Length"
                  options={sessionOptions}
                  value={profile.session_length || ''}
                  onChange={(e) =>
                    handleFormdataChange('session_length', e.target.value)
                  }
                  disabled={isSaving}
                />
              </div>

              <Select
                id="equipment"
                label="Equipment Available"
                options={equipmentOptions}
                value={profile.equipment || ''}
                onChange={(e) =>
                  handleFormdataChange('equipment', e.target.value)
                }
                disabled={isSaving}
              />

              <Select
                id="preferred_split"
                label="Preferred Split"
                options={splitOptions}
                value={profile.preferred_split || ''}
                onChange={(e) =>
                  handleFormdataChange('preferred_split', e.target.value)
                }
                disabled={isSaving}
              />

              <Textarea
                id="injuries"
                label="Injuries or Limitations (optional)"
                rows={3}
                value={profile.injuries || ''}
                onChange={(e) =>
                  handleFormdataChange('injuries', e.target.value)
                }
                disabled={isSaving}
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isSaving} className="flex-1">
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
                  No profile data available. Complete onboarding to add your
                  preferences.
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
