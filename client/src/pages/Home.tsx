import { useAuth } from '../hooks/useAuth';

/**
 * Home Page Component
 * Public page that adapts content based on auth state
 * Routing logic is handled by ProtectedRoute - this component focuses on presentation
 */
const Home = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mb-8">Ready to find your next workout?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">My Profile</h2>
              <p className="text-gray-500 mb-4">View and edit your profile</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Recent Workouts</h2>
              <p className="text-gray-500 mb-4">Track your fitness journey</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Settings</h2>
              <p className="text-gray-500 mb-4">Manage your preferences</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to GymSuggestor</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Your personal gym recommendation engine
        </p>
        <p className="text-gray-500">Sign in to get started</p>
      </div>
    </div>
  );
};

export default Home;
