import React, { useState, useEffect } from 'react';
import { StudentStats, ProgressStatus } from '../types';
import { RAW_QUESTIONS, MODULES } from '../data/dsaQuestionsData';
import { supabaseService } from '../services/supabase';
import { X } from 'lucide-react';

interface StudentDetailModalProps {
  student: StudentStats;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose
}) => {
  const [progressMap, setProgressMap] = useState<Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }>>({});
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await supabaseService.getStudentProgress(student.studentId);
      setProgressMap(data);
      setLoading(false);
    }
    load();
  }, [student.studentId]);

  const filteredQuestions = RAW_QUESTIONS.filter(q => {
    if (selectedModule !== 'all' && q.moduleId !== selectedModule) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      if (!q.title.toLowerCase().includes(s) && !q.topic.toLowerCase().includes(s)) return false;
    }
    const st = progressMap[q.id]?.status || 'not_completed';
    if (statusFilter !== 'all' && st !== statusFilter) return false;
    return true;
  });

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
      zIndex: 50,
      padding: '1.25rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
              {student.studentName} — Progress Sheet
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {student.studentEmail} • {student.percentage}% completed ({student.completed}/{student.total})
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.3rem'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter toolbar */}
        <div style={{
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          backgroundColor: 'var(--bg-subtle)'
        }}>
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, height: '32px', fontSize: '0.8rem' }}
          />

          <select
            value={selectedModule}
            onChange={e => setSelectedModule(e.target.value)}
            style={{ height: '32px', fontSize: '0.8rem' }}
          >
            <option value="all">All Modules</option>
            {MODULES.map(m => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ height: '32px', fontSize: '0.8rem' }}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="doubt">Doubts</option>
            <option value="not_completed">Not Completed</option>
          </select>
        </div>

        {/* Table Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Loading student records...
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderBottom: '1px solid var(--border-color)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase'
                }}>
                  <th style={{ padding: '0.6rem 1rem' }}>Problem</th>
                  <th style={{ padding: '0.6rem 1rem' }}>Topic</th>
                  <th style={{ padding: '0.6rem 1rem', width: '80px' }}>Difficulty</th>
                  <th style={{ padding: '0.6rem 1rem', width: '130px' }}>Status</th>
                  <th style={{ padding: '0.6rem 1rem' }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map(q => {
                  const prog = progressMap[q.id];
                  const st = prog?.status || 'not_completed';

                  return (
                    <tr key={q.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>
                        {q.title}
                      </td>
                      <td style={{ padding: '0.6rem 1rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {q.topic}
                      </td>
                      <td style={{ padding: '0.6rem 1rem' }}>
                        <span className={
                          q.difficulty === 'Easy' ? 'badge badge-easy' :
                          q.difficulty === 'Medium' ? 'badge badge-medium' : 'badge badge-hard'
                        }>
                          {q.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', fontWeight: 500 }}>
                        {st === 'completed' ? (
                          <span style={{ color: 'var(--color-completed)' }}>Completed</span>
                        ) : st === 'doubt' ? (
                          <span style={{ color: 'var(--color-doubt)' }}>Has Doubt</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Not Completed</span>
                        )}
                      </td>
                      <td style={{ padding: '0.6rem 1rem', fontSize: '0.78rem', color: prog?.notes ? 'var(--color-doubt)' : 'var(--text-muted)' }}>
                        {prog?.notes || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
