// LOGIN PAGE
// Authentication page for existing users to sign in to Tableside Mastery
'use client';

import { useState } from 'react';
import Link from 'next/link';
import './login.css';

// LOGIN PAGE COMPONENT
// Handles user authentication with email and password
export default function LoginPage() {
  // FORM STATE MANAGEMENT
  // Tracks form inputs, loading state, and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // HANDLE LOGIN FORM SUBMISSION
  // Processes form submission and calls authentication API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement authentication logic here
      console.log('Login attempt:', { email, password });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Redirect to dashboard on successful login
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-container" role="main">
      <section className="login-form-container" aria-labelledby="login-title">
        <h1 id="login-title" className="login-title">Sign in to your account</h1>
        
        {/* ERROR MESSAGE DISPLAY */}
        {/* Shows validation and API errors to the user */}
        {error && (
          <div className="error-message" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {/* Main authentication form with email and password inputs */}
        <form
          className="login-form"
          onSubmit={handleSubmit}
          aria-label="Login form"
        >
          {/* EMAIL INPUT FIELD */}
          {/* Email address input with validation and help text */}
          <div className="input-group">
            <label htmlFor="email-input" className="input-label">
              Email address
            </label>
            <input
              id="email-input"
              type="email"
              required
              className="input-field"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="email-help"
              aria-required="true"
              disabled={isLoading}
              autoComplete="email"
            />
            <div id="email-help" className="help-text">
              Enter the email address associated with your account
            </div>
          </div>

          {/* PASSWORD INPUT FIELD */}
          {/* Password input with validation and help text */}
          <div className="input-group">
            <label htmlFor="password-input" className="input-label">
              Password
            </label>
            <input
              id="password-input"
              type="password"
              required
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby="password-help"
              aria-required="true"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <div id="password-help" className="help-text">
              Enter your account password
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          {/* Form submission button with loading state */}
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
            aria-describedby={isLoading ? "loading-status" : undefined}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
          {isLoading && (
            <div id="loading-status" className="sr-only">
              Processing login request
            </div>
          )}
        </form>

        {/* NAVIGATION LINKS */}
        {/* Links to home page and registration page */}
        <div className="login-links">
          <Link href="/" className="back-link">
            Back to Home
          </Link>
          <Link href="/register" className="register-link">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </section>
    </main>
  );
} 