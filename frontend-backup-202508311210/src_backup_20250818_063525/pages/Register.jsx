// src/pages/Register.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fix: Use correct property names from AuthContext
  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    try {
      const result = await register(username, email, password);
      if (result.success) {
        navigate("/app/dashboard");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Register for Fast Eddie's</h2>
        {error && (
          <div className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 border border-red-700 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-gray-300 text-sm font-semibold mb-2">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder="Choose a username"
              required
              disabled={submitting || loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder="your@email.com"
              required
              disabled={submitting || loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder="Create a password"
              required
              disabled={submitting || loading}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-semibold mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder="Re-enter your password"
              required
              disabled={submitting || loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
            disabled={submitting || loading}
          >
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
