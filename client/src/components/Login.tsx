import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center ">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl backdrop:blur-xl">
          <div>
            <h2 className="text-2xl md:text-4xl mb-3 font-medium">Sign In</h2>
            <span className="text-sm text-muted">
              Enter your Credentials to login to your account.
            </span>
          </div>

          <form className="space-y-8 mt-8" autoComplete="off">
            <div className="flex flex-col gap-4">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                className="w-full px-4 py-2 border border-border bg-gray-300/10 shadow-2xl rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                data-lpignore="true"
                data-form-type="other"
                className="w-full px-4 py-2 border border-border bg-gray-300/10 shadow-2xl rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Sign In
            </button>
          </form>

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
