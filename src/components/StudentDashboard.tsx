import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Question, 
  ProgressStatus, 
  Difficulty, 
  User 
} from '../types';
import { MODULES, RAW_QUESTIONS } from '../data/dsaQuestionsData';
import { 
  Search, 
  Video, 
  MessageSquare, 
  Check
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: User;
  progressMap: Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }>;
  onProgressUpdate: (questionId: string, status: ProgressStatus, notes?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  progressMap,
  onProgressUpdate
}) => {
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProgressStatus>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | Difficulty>('all');
  const [hasVideoFilter, setHasVideoFilter] = useState<boolean>(false);
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');
  const [savedId, setSavedId] = useState<string | null>(null);

  // Overall stats
  const stats = useMemo(() => {
    let completed = 0;
    let doubt = 0;
    let notCompleted = 0;

    RAW_QUESTIONS.forEach(q => {
      const p = progressMap[q.id];
      if (p?.status === 'completed') completed++;
      else if (p?.status === 'doubt') doubt++;
      else notCompleted++;
    });

    const total = RAW_QUESTIONS.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, doubt, notCompleted, total, percentage };
  }, [progressMap]);

  // Module stats for simple tab counts
  const moduleStats = useMemo(() => {
    const map: Record<string, { completed: number; total: number }> = {};
    MODULES.forEach(m => {
      const qs = RAW_QUESTIONS.filter(q => q.moduleId === m.id);
      let comp = 0;
      qs.forEach(q => {
        if (progressMap[q.id]?.status === 'completed') comp++;
      });
      map[m.id] = { completed: comp, total: qs.length };
    });
    return map;
  }, [progressMap]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return RAW_QUESTIONS.filter(q => {
      if (selectedModule !== 'all' && q.moduleId !== selectedModule) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!q.title.toLowerCase().includes(query) && !q.topic.toLowerCase().includes(query)) {
          return false;
        }
      }
      const qStatus = progressMap[q.id]?.status || 'not_completed';
      if (statusFilter !== 'all' && qStatus !== statusFilter) {
        return false;
      }
      if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) {
        return false;
      }
      if (hasVideoFilter && !q.lectureVideo) {
        return false;
      }
      return true;
    });
  }, [selectedModule, searchQuery, statusFilter, difficultyFilter, hasVideoFilter, progressMap]);

  const handleStatusChange = (question: Question, newStatus: ProgressStatus) => {
    if (newStatus === 'doubt' && expandedNotesId !== question.id) {
      setExpandedNotesId(question.id);
      setTempNoteText(progressMap[question.id]?.notes || '');
    }

    onProgressUpdate(question.id, newStatus, progressMap[question.id]?.notes);

    if (newStatus === 'completed') {
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
      } catch {}
    }

    setSavedId(question.id);
    setTimeout(() => setSavedId(null), 1200);
  };

  const handleSaveNote = (questionId: string) => {
    const currentStatus = progressMap[questionId]?.status || 'doubt';
    onProgressUpdate(questionId, currentStatus, tempNoteText);
    setExpandedNotesId(null);
    setSavedId(questionId);
    setTimeout(() => setSavedId(null), 1200);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Simple Header & Metrics */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: '1.25rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>
              {currentUser.role === 'teacher' ? 'DSA Curriculum Practice Tracker' : 'DSA Coding Practice'}
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {currentUser.role === 'teacher' ? (
                <>Instructor: <span style={{ color: '#fff' }}>{currentUser.name}</span> (Curriculum Lead)</>
              ) : (
                <>Student: <span style={{ color: '#fff' }}>{currentUser.name}</span> ({currentUser.email})</>
              )}
            </p>
          </div>

          {/* Simple metrics row */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>{stats.total}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-completed)' }}>{stats.completed}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Doubts</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-doubt)' }}>{stats.doubt}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Progress</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>{stats.percentage}%</div>
            </div>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-subtle)', borderRadius: '2px', marginTop: '1rem', overflow: 'hidden' }}>
          <div style={{
            width: `${stats.percentage}%`,
            height: '100%',
            backgroundColor: 'var(--color-completed)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Clean Module Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.4rem',
        overflowX: 'auto',
        paddingBottom: '0.2rem'
      }}>
        <button
          onClick={() => setSelectedModule('all')}
          style={{
            padding: '0.45rem 0.8rem',
            borderRadius: 'var(--radius)',
            fontSize: '0.8rem',
            fontWeight: 500,
            border: '1px solid',
            borderColor: selectedModule === 'all' ? '#52525b' : 'var(--border-color)',
            backgroundColor: selectedModule === 'all' ? 'var(--bg-hover)' : 'var(--bg-surface)',
            color: selectedModule === 'all' ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          All Modules ({stats.completed}/{stats.total})
        </button>

        {MODULES.map(m => {
          const isSelected = selectedModule === m.id;
          const mStat = moduleStats[m.id] || { completed: 0, total: 0 };
          return (
            <button
              key={m.id}
              onClick={() => setSelectedModule(m.id)}
              style={{
                padding: '0.45rem 0.8rem',
                borderRadius: 'var(--radius)',
                fontSize: '0.8rem',
                fontWeight: 500,
                border: '1px solid',
                borderColor: isSelected ? '#52525b' : 'var(--border-color)',
                backgroundColor: isSelected ? 'var(--bg-hover)' : 'var(--bg-surface)',
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {m.title} ({mStat.completed}/{mStat.total})
            </button>
          );
        })}
      </div>

      {/* Filter Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.6rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 240px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Filter by question or topic..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2rem', height: '34px' }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            style={{ height: '34px', fontSize: '0.8rem' }}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="doubt">Have Doubt</option>
            <option value="not_completed">Not Completed</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value as any)}
            style={{ height: '34px', fontSize: '0.8rem' }}
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button
            onClick={() => setHasVideoFilter(!hasVideoFilter)}
            style={{
              height: '34px',
              padding: '0 0.65rem',
              borderRadius: 'var(--radius)',
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              backgroundColor: hasVideoFilter ? 'var(--bg-hover)' : 'var(--bg-surface)',
              color: hasVideoFilter ? '#fff' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Video size={13} /> Video Only
          </button>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {filteredQuestions.length} questions
        </div>
      </div>

      {/* Clean Minimalist Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr style={{
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase'
              }}>
                <th style={{ padding: '0.65rem 1rem', width: '45px' }}>#</th>
                <th style={{ padding: '0.65rem 1rem' }}>Problem</th>
                <th style={{ padding: '0.65rem 1rem' }}>Topic</th>
                <th style={{ padding: '0.65rem 1rem', width: '90px' }}>Difficulty</th>
                <th style={{ padding: '0.65rem 1rem', width: '70px' }}>Video</th>
                <th style={{ padding: '0.65rem 1rem', width: '220px' }}>Status</th>
                <th style={{ padding: '0.65rem 1rem', width: '50px' }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No matching questions found.
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((question, index) => {
                  const currentProg = progressMap[question.id] || { status: 'not_completed' };
                  const currentStatus = currentProg.status;
                  const hasNote = Boolean(currentProg.notes);
                  const isExpanded = expandedNotesId === question.id;
                  const isSaved = savedId === question.id;

                  return (
                    <React.Fragment key={question.id}>
                      <tr style={{
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: currentStatus === 'completed' 
                          ? 'rgba(34, 197, 94, 0.03)' 
                          : currentStatus === 'doubt' 
                          ? 'rgba(245, 158, 11, 0.03)' 
                          : 'transparent'
                      }}>
                        {/* Index */}
                        <td style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {index + 1}
                        </td>

                        {/* Title */}
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#fff' }}>
                            {question.title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {question.moduleTitle}
                          </div>
                        </td>

                        {/* Topic */}
                        <td style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {question.topic}
                        </td>

                        {/* Difficulty */}
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <span className={
                            question.difficulty === 'Easy' ? 'badge badge-easy' :
                            question.difficulty === 'Medium' ? 'badge badge-medium' : 'badge badge-hard'
                          }>
                            {question.difficulty}
                          </span>
                        </td>

                        {/* Video */}
                        <td style={{ padding: '0.65rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {question.lectureVideo ? 'Yes' : '—'}
                        </td>

                        {/* Simple Status Dropdown */}
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <select
                              value={currentStatus}
                              onChange={e => handleStatusChange(question, e.target.value as ProgressStatus)}
                              style={{
                                width: '100%',
                                padding: '0.4rem 0.55rem',
                                fontSize: '0.8rem',
                                backgroundColor: 'var(--bg-subtle)',
                                color: currentStatus === 'completed' 
                                  ? 'var(--color-completed)' 
                                  : currentStatus === 'doubt' 
                                  ? 'var(--color-doubt)' 
                                  : 'var(--text-secondary)',
                                borderColor: currentStatus === 'completed'
                                  ? 'var(--color-completed-border)'
                                  : currentStatus === 'doubt'
                                  ? 'var(--color-doubt-border)'
                                  : 'var(--border-color)'
                              }}
                            >
                              <option value="not_completed">Not Completed</option>
                              <option value="completed">Completed</option>
                              <option value="doubt">Have Doubt in this Concept</option>
                            </select>

                            {isSaved && (
                              <Check size={13} color="var(--color-completed)" />
                            )}
                          </div>
                        </td>

                        {/* Note Icon */}
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <button
                            onClick={() => {
                              if (isExpanded) {
                                setExpandedNotesId(null);
                              } else {
                                setExpandedNotesId(question.id);
                                setTempNoteText(currentProg.notes || '');
                              }
                            }}
                            title={hasNote ? 'Edit doubt note' : 'Add doubt note'}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: hasNote ? 'var(--color-doubt)' : 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '0.2rem'
                            }}
                          >
                            <MessageSquare size={14} />
                          </button>
                        </td>
                      </tr>

                      {/* Simple Drawer for doubt comment */}
                      {isExpanded && (
                        <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                          <td colSpan={7} style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-doubt)', fontWeight: 500 }}>
                                What is your doubt in "{question.title}"?
                              </span>
                              <textarea
                                rows={2}
                                placeholder="Explain your doubt here (visible to your teacher)..."
                                value={tempNoteText}
                                onChange={e => setTempNoteText(e.target.value)}
                                style={{ width: '100%', fontSize: '0.82rem' }}
                              />
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                <button
                                  onClick={() => setExpandedNotesId(null)}
                                  className="btn btn-outline"
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveNote(question.id)}
                                  className="btn btn-secondary"
                                  style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                                >
                                  Save Note
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
