import React, { useState } from 'react';
import { User } from '../types';
import { supabaseService } from '../services/supabase';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);

    const { user, error: loginError } = await supabaseService.login(email, password || 'password123');
    setLoading(false);

    if (loginError || !user) {
      setError(loginError || 'Authentication failed. Please check your credentials.');
    } else {
      onLoginSuccess(user);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setLoading(true);
    setEmail(userEmail);
    setPassword('demoPass123');
    const { user } = await supabaseService.login(userEmail, 'demoPass123');
    setLoading(false);
    if (user) {
      onLoginSuccess(user);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      backgroundColor: 'var(--bg-app)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>
            DSA Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Sign in with your assigned credentials
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem'
        }}>
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius)',
              marginBottom: '1rem',
              fontSize: '0.8rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.6rem', marginTop: '0.25rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Logins for immediate testing */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Quick Demo Access
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('instructor@dsatracker.com')}
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.4rem 0.7rem' }}
              >
                <span>Instructor View</span>
                <span style={{ color: 'var(--text-muted)' }}>Analytics</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('rahul.sharma@dsatracker.com')}
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.4rem 0.7rem' }}
              >
                <span>Student View</span>
                <span style={{ color: 'var(--text-muted)' }}>Questions</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
