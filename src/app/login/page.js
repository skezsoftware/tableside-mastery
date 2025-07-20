// LOGIN PAGE
'use client';

import { useState } from 'react';
import Link from 'next/link';
import './login.css';

export default function LoginPage() {
  // FORM STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // HANDLE LOGIN FORM SUBMISSION
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
        <h1 className="login-title">Sign in to your account</h1>
        
        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
          aria-label="Login form"
        >
          {/* EMAIL INPUT */}
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
            />
            <div id="email-help" className="help-text">
              Enter the email address associated with your account
            </div>
          </div>

          {/* PASSWORD INPUT */}
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
            />
            <div id="password-help" className="help-text">
              Enter your account password
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* NAVIGATION LINKS */}
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