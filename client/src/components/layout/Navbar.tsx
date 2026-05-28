import { Dumbbell, LogOut } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

/**
 * Navbar Component
 * Displays navigation with authentication state and user initials
 */
const Navbar = () => {
  const { user, logout } = useAuth();

  console.log('user', user);

  /**
   * Extract user initials from name
   * Example: "John Doe" -> "JD"
   */
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  /**
   * Handle logout with error handling
   */
  const handleLogout = async () => {
    try {
      await logout();
      // Router will handle navigation after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <Dumbbell className="w-6 h-6 text-accent" />
          <span className="font-semibold text-lg">Gym AI - Instructor</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  My Plan
                </Button>
              </Link>

              {/* User Initials Badge */}
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-semibold">
                  {getUserInitials(user.name)}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted">{user.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-accent/10 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/sign-in">
                <Button size="sm" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/sign-up" className="ml-4">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
