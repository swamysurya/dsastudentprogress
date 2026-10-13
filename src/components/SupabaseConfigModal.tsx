import React, { useState } from 'react';
import { supabaseService } from '../services/supabase';
import { X, Check } from 'lucide-react';

interface SupabaseConfigModalProps {
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  onClose,
  onConfigSaved
}) => {
  const currentConfig = supabaseService.getConfiguration();
  const [url, setUrl] = useState<string>(currentConfig.url);
  const [anonKey, setAnonKey] = useState<string>(currentConfig.anonKey);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setStatusMsg({ type: 'error', text: 'Both Supabase URL and Anon Key are required.' });
      return;
    }

    const isSuccess = supabaseService.saveConfiguration(url.trim(), anonKey.trim());
    if (isSuccess) {
      setStatusMsg({ type: 'success', text: 'Supabase connected successfully.' });
      onConfigSaved();
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setStatusMsg({ type: 'error', text: 'Invalid URL or key format.' });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 60,
      padding: '1.25rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        width: '100%',
        maxWidth: '520px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
            Supabase Settings
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1.25rem' }}>
          {statusMsg && (
            <div style={{
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius)',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              backgroundColor: statusMsg.type === 'success' ? 'var(--color-completed-bg)' : 'rgba(239, 68, 68, 0.1)',
              color: statusMsg.type === 'success' ? 'var(--color-completed)' : '#f87171',
              border: `1px solid ${statusMsg.type === 'success' ? 'var(--color-completed-border)' : 'rgba(239, 68, 68, 0.25)'}`
            }}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://xyzproject.supabase.co"
                value={url}
                onChange={e => setUrl(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Anon Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOi..."
                value={anonKey}
                onChange={e => setAnonKey(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Schema setup script is located in <code>supabase_schema.sql</code> in the project root.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                Save & Connect
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
