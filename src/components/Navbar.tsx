import React from 'react';
import { User } from '../types';
import { LogOut, Database, BarChart3, BookOpen, Settings } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  activeView: 'student' | 'teacher';
  onViewChange: (view: 'student' | 'teacher') => void;
  onOpenSettings: () => void;
  isSupabaseConfigured: boolean;
  studentStats?: { completed: number; doubt: number; total: number };
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  activeView,
  onViewChange,
  onOpenSettings,
  isSupabaseConfigured,
  studentStats
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 600, fontSize: '1rem', color: '#fff', letterSpacing: '-0.01em' }}>
            DSA Tracker
          </span>

          {user.role === 'teacher' && (
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              padding: '2px',
              marginLeft: '0.75rem'
            }}>
              <button
                onClick={() => onViewChange('student')}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeView === 'student' ? 'var(--bg-hover)' : 'transparent',
                  color: activeView === 'student' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Practice Tracker
              </button>
              <button
                onClick={() => onViewChange('teacher')}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeView === 'teacher' ? 'var(--bg-hover)' : 'transparent',
                  color: activeView === 'teacher' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Instructor Analytics
              </button>
            </div>
          )}
        </div>

        {/* Quick summary stats */}
        {studentStats && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <span>
              {user.role === 'teacher' ? 'Instructor Done: ' : 'Done: '}
              <strong style={{ color: user.role === 'teacher' ? '#38bdf8' : 'var(--color-completed)' }}>
                {studentStats.completed}
              </strong>
            </span>
            {user.role !== 'teacher' && (
              <span>
                Doubts: <strong style={{ color: 'var(--color-doubt)' }}>{studentStats.doubt}</strong>
              </span>
            )}
            <span>
              Total: <strong style={{ color: 'var(--text-primary)' }}>{studentStats.total}</strong>
            </span>
          </div>
        )}

        {/* Right tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Supabase status */}
          <button
            onClick={onOpenSettings}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-subtle)',
              color: isSupabaseConfigured ? 'var(--color-completed)' : 'var(--text-muted)'
            }}
            title="Supabase settings"
          >
            <Database size={13} />
            <span>{isSupabaseConfigured ? 'Supabase' : 'Offline'}</span>
          </button>

          {/* User info */}
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            padding: '0.2rem 0.5rem',
            borderLeft: '1px solid var(--border-color)'
          }}>
            <span style={{ color: '#fff', fontWeight: 500 }}>{user.name}</span>
            <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem', fontSize: '0.75rem' }}>
              ({user.role})
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Sign out"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius)',
              padding: '0.35rem 0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
