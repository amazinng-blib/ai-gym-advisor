import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  type?: 'public' | 'protected' | 'auth';
}

/**
 * ProtectedRoute Component - Senior-level implementation
 * Clear route protection pattern with semantic type naming
 *
 * @param type
 *   - 'public': Accessible to all (authenticated & unauthenticated)
 *   - 'protected': Requires authentication
 *   - 'auth': Only for unauthenticated users (sign-in/sign-up)
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  type = 'protected',
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (type === 'public') {
    return <>{children}</>;
  }

  if (type === 'protected' && !user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (type === 'auth' && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
