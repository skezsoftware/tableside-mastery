'use client';

import { useState } from 'react';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    console.log('Login attempt:', { email, password });
  };

  return (
    <main className="login-container" role="main">
      <section className="login-form-container" aria-labelledby="login-title">
        <h1 className="login-title">Sign in to your account</h1>
        <form
          className="login-form"
          onSubmit={handleSubmit}
          aria-label="Login form"
        >
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
            />
            <div id="email-help" className="help-text">
              Enter the email address associated with your account
            </div>
          </div>
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
            />
            <div id="password-help" className="help-text">
              Enter your account password
            </div>
          </div>
          <button
            type="submit"
            className="submit-button"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
} 