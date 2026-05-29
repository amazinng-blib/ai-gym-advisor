import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import { useState } from 'react';
import Textarea from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';

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

const Onboarding = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    goal: 'bulk',
    experience: 'intermediate',
    daysPerWeek: '4',
    sessionLength: '60',
    equipment: 'full_gym',
    // split: 'upper_lower',
    injuries: '',
    preferredSplit: 'upper_lower',
  });

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const updateFormData = (field: string, value: string) => {
    return setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionaire = async () => {};

  return (
    <div className="min-h-screen pt-24 px-6">
      {/* container of the screen */}
      <div className="max-w-xl mx-auto">
        {/* progress i ndicator */}

        {/* Steps: 1 Questionaire */}

        <Card variant="bordered">
          <h1 className="text-2xl font-bold mb-2">Tell Us About Yourself</h1>
          <p className="text-muted mb-6">
            Help us create the perfect plan for you
          </p>
          <form onSubmit={handleQuestionaire} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Select
                id="goal"
                label="What's Your Primary Goal"
                options={goalOptions}
                value={formData.goal}
                onChange={(e) => updateFormData('goal', e.target.value)}
                className="mb-4"
              />
              <Select
                id="experience"
                label="Training Experience Level"
                options={experienceOptions}
                value={formData.experience}
                onChange={(e) => updateFormData('experience', e.target.value)}
                className="mb-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                id="daysPerWeek"
                label="How Many Days Per Week"
                options={daysOptions}
                value={formData.daysPerWeek}
                onChange={(e) => updateFormData('daysPerWeek', e.target.value)}
                className="mb-4"
              />
              <Select
                id="sessionLength"
                label="Session Length"
                options={sessionOptions}
                value={formData.sessionLength}
                onChange={(e) =>
                  updateFormData('sessionLength', e.target.value)
                }
                className="mb-4"
              />
            </div>

            <Select
              id="equipment"
              label="Preferred Equipment"
              options={equipmentOptions}
              value={formData.equipment}
              onChange={(e) => updateFormData('equipment', e.target.value)}
              className="mb-4"
            />

            <Select
              id="preferredSplit"
              label="Preferred Workout Split"
              options={splitOptions}
              value={formData.preferredSplit}
              onChange={(e) => updateFormData('preferredSplit', e.target.value)}
              className="mb-4"
            />

            <Textarea
              id="injuries"
              label="Any Injuries or Limitations(optional)"
              rows={3}
              value={formData.injuries}
              onChange={(e) => updateFormData('injuries', e.target.value)}
              className="mb-4"
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 gap-2">
                Generate My Plan <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>

        {/* Steps: 2 Generating plan */}
      </div>
    </div>
  );
};

export default Onboarding;
