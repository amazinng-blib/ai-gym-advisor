import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Login Component
 * Handles user authentication with email and password
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, error, isLoading, clearError } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  /**
   * Handle form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      // Redirect to profile on successful login
      navigate('/profile');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl backdrop-blur-xl">
          <div className="mb-8">
            <h2 className="text-2xl md:text-4xl mb-3 font-medium">Sign In</h2>
            <span className="text-sm text-muted">
              Enter your credentials to login to your account.
            </span>
          </div>

          {/* Global Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-md">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  validationErrors.email
                    ? 'border-red-500 bg-red-500/5 focus:ring-red-500'
                    : 'border-border bg-gray-300/10 focus:ring-accent'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {validationErrors.email && (
                <p className="text-xs text-red-400">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="current-password"
                data-lpignore="true"
                data-form-type="other"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  validationErrors.password
                    ? 'border-red-500 bg-red-500/5 focus:ring-red-500'
                    : 'border-border bg-gray-300/10 focus:ring-accent'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {validationErrors.password && (
                <p className="text-xs text-red-400">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted">Don't have an account? </span>
            <Link
              to="/auth/sign-up"
              className="text-accent hover:text-accent/80 font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
