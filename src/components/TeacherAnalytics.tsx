import React, { useState, useEffect, useMemo } from 'react';
import { StudentStats, DoubtItem, User, ProgressStatus } from '../types';
import { MODULES, RAW_QUESTIONS } from '../data/dsaQuestionsData';
import { supabaseService } from '../services/supabase';
import { StudentDetailModal } from './StudentDetailModal';
import { Download, Check, Search, Eye, Copy, ExternalLink, CheckCircle2, ChevronDown, ChevronUp, HelpCircle, RotateCw } from 'lucide-react';

interface TeacherAnalyticsProps {
  currentUser: User;
  instructorProgress?: Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }>;
  onInstructorProgressUpdate?: (questionId: string, status: ProgressStatus, notes?: string) => void;
}

export const TeacherAnalytics: React.FC<TeacherAnalyticsProps> = ({ 
  currentUser: _currentUser,
  instructorProgress,
  onInstructorProgressUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'doubts' | 'students' | 'add-student'>('questions');
  const [studentsStats, setStudentsStats] = useState<StudentStats[]>([]);
  const [doubtsList, setDoubtsList] = useState<DoubtItem[]>([]);
  const [questionsStats, setQuestionsStats] = useState<Record<string, { completedCount: number; doubtCount: number; completedStudents: string[]; doubtStudents: string[] }>>({});
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentStats | null>(null);
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [doubtModuleFilter, setDoubtModuleFilter] = useState<string>('all');
  const [hideResolvedDoubts, setHideResolvedDoubts] = useState<boolean>(false);

  // Question Tracker state
  const [qSearch, setQSearch] = useState<string>('');
  const [qModuleFilter, setQModuleFilter] = useState<string>('all');
  const [qDifficultyFilter, setQDifficultyFilter] = useState<string>('all');
  const [qStatusFilter, setQStatusFilter] = useState<'all' | 'instructor_done' | 'instructor_pending' | 'has_students_done' | 'zero_done' | 'has_doubts'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // New Student Single state
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentEmail, setNewStudentEmail] = useState<string>('');
  const [newStudentBatch, setNewStudentBatch] = useState<string>('Batch 2026-A');
  const [createdSuccessMsg, setCreatedSuccessMsg] = useState<string | null>(null);

  // Bulk add state
  const [bulkMode, setBulkMode] = useState<'single' | 'bulk'>('single');
  const [bulkEmailsText, setBulkEmailsText] = useState<string>('');
  const [defaultPassword, setDefaultPassword] = useState<string>('dsa2026');
  const [generatedCredentialsList, setGeneratedCredentialsList] = useState<Array<{ name: string; email: string; pass: string }>>([]);
  const [copiedCredentials, setCopiedCredentials] = useState<boolean>(false);

  const [internalInstructorProgress, setInternalInstructorProgress] = useState<Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }>>(instructorProgress || {});
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (instructorProgress && Object.keys(instructorProgress).length > 0) {
      setInternalInstructorProgress(prev => ({ ...prev, ...instructorProgress }));
    }
  }, [instructorProgress]);

  const effectiveInstructorProgress = useMemo(() => {
    return {
      ...(instructorProgress || {}),
      ...internalInstructorProgress
    };
  }, [instructorProgress, internalInstructorProgress]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const [stats, doubts, qStats, instProg] = await Promise.all([
        supabaseService.getAllStudentsStats(),
        supabaseService.getAllDoubts(),
        supabaseService.getQuestionsCompletionStats(),
        supabaseService.getInstructorProgress()
      ]);
      setStudentsStats(stats);
      setDoubtsList(doubts);
      setQuestionsStats(qStats);
      if (instProg && Object.keys(instProg).length > 0) {
        setInternalInstructorProgress(instProg);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const instructorCoveredCount = useMemo(() => {
    if (!effectiveInstructorProgress) return 0;
    return Object.values(effectiveInstructorProgress).filter(p => p.status === 'completed').length;
  }, [effectiveInstructorProgress]);

  // Aggregates
  const batchMetrics = useMemo(() => {
    const totalStudents = studentsStats.length;
    if (totalStudents === 0) {
      return { totalStudents: 0, avgCompletion: 0, totalDoubts: 0 };
    }
    const sumPercentage = studentsStats.reduce((acc, s) => acc + s.percentage, 0);
    const avgCompletion = Math.round(sumPercentage / totalStudents);
    const totalDoubts = doubtsList.filter(d => !d.resolved).length;

    return { totalStudents, avgCompletion, totalDoubts };
  }, [studentsStats, doubtsList]);

  const handleToggleDoubtResolved = async (doubtId: string) => {
    setDoubtsList(prev => prev.map(d => d.id === doubtId ? { ...d, resolved: !d.resolved } : d));
    await supabaseService.toggleDoubtResolved(doubtId);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    supabaseService.addNewStudent({
      name: newStudentName.trim(),
      email: newStudentEmail.trim(),
      batch: newStudentBatch
    });

    setCreatedSuccessMsg(`Created account for ${newStudentName} (${newStudentEmail})`);
    setNewStudentName('');
    setNewStudentEmail('');
    refreshData();

    setTimeout(() => setCreatedSuccessMsg(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setBulkEmailsText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleBulkCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkEmailsText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const credentials: Array<{ name: string; email: string; pass: string }> = [];

    lines.forEach((line, index) => {
      // Check if this is a header row (e.g. email,password)
      const lower = line.toLowerCase();
      if (index === 0 && (lower.includes('email') || lower.includes('password'))) {
        return; // skip header row
      }

      // Format supported:
      // 1. email,password
      // 2. email,password,name
      // 3. email,password,name,batch
      const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
      const email = parts[0]?.toLowerCase();
      if (!email || !email.includes('@')) return;

      const pass = parts[1] || defaultPassword;
      const name = parts[2] || email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const batch = parts[3] || newStudentBatch;

      supabaseService.addNewStudent({
        name,
        email,
        password: pass,
        batch
      });

      credentials.push({ name, email, pass });
    });

    if (credentials.length === 0) {
      alert('No valid student email addresses found in the provided CSV text/file.');
      return;
    }

    setGeneratedCredentialsList(credentials);
    setCreatedSuccessMsg(`Successfully provisioned ${credentials.length} student accounts with assigned passwords!`);
    refreshData();
  };

  const copyCredentialsToClipboard = () => {
    const text = generatedCredentialsList.map(c => `Email: ${c.email} | Password: ${c.pass} | Name: ${c.name}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 2000);
  };

  const downloadCredentialsCSV = () => {
    const headers = ['Email', 'Password', 'Name'];
    const rows = generatedCredentialsList.map(c => [
      `"${c.email}"`,
      `"${c.pass}"`,
      `"${c.name}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `student_credentials_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    const headers = ['Student Name', 'Email', 'Batch', 'Completed', 'Doubts', 'Remaining', 'Percentage'];
    const rows = studentsStats.map(s => [
      `"${s.studentName}"`,
      `"${s.studentEmail}"`,
      `"${s.batch || 'N/A'}"`,
      s.completed,
      s.doubt,
      s.notCompleted,
      `${s.percentage}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dsa_progress_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredDoubts = doubtsList.filter(d => {
    if (hideResolvedDoubts && d.resolved) return false;
    if (doubtModuleFilter !== 'all' && d.moduleTitle !== doubtModuleFilter) return false;
    return true;
  });

  const filteredStudents = studentsStats.filter(s => {
    if (searchStudent.trim()) {
      const q = searchStudent.toLowerCase();
      return s.studentName.toLowerCase().includes(q) || s.studentEmail.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredQuestions = useMemo(() => {
    return RAW_QUESTIONS.filter(q => {
      if (qModuleFilter !== 'all' && q.moduleId !== qModuleFilter) return false;
      if (qDifficultyFilter !== 'all' && q.difficulty !== qDifficultyFilter) return false;
      
      if (qSearch.trim()) {
        const query = qSearch.toLowerCase();
        if (!q.title.toLowerCase().includes(query) && !q.topic.toLowerCase().includes(query)) {
          return false;
        }
      }

      const isInstructorDone = effectiveInstructorProgress?.[q.id]?.status === 'completed';
      const qStat = questionsStats[q.id];
      const studentsDone = qStat?.completedCount || 0;
      const doubtsCount = qStat?.doubtCount || 0;

      if (qStatusFilter === 'instructor_done' && !isInstructorDone) return false;
      if (qStatusFilter === 'instructor_pending' && isInstructorDone) return false;
      if (qStatusFilter === 'has_students_done' && studentsDone === 0) return false;
      if (qStatusFilter === 'zero_done' && studentsDone > 0) return false;
      if (qStatusFilter === 'has_doubts' && doubtsCount === 0) return false;

      return true;
    });
  }, [qModuleFilter, qDifficultyFilter, qSearch, qStatusFilter, effectiveInstructorProgress, questionsStats]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Simple Header & Metric Cards */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: '1.25rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>
              Instructor Dashboard & Analytics
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Track what questions you have covered, monitor student completions, and resolve concept doubts.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              onClick={refreshData} 
              disabled={isRefreshing}
              className="btn btn-secondary" 
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              title="Sync live analytics across all devices"
            >
              <RotateCw size={13} style={{ transform: isRefreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s ease' }} />
              {isRefreshing ? 'Syncing...' : 'Sync Live Data'}
            </button>
            <button onClick={handleExportCSV} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              <Download size={13} /> Export CSV
            </button>
            <button onClick={() => setActiveTab('add-student')} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              + Add Student Credentials
            </button>
          </div>
        </div>

        {/* Flat metrics row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginTop: '1.25rem'
        }}>
          <div 
            onClick={() => setActiveTab('questions')}
            style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Instructor Covered</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#38bdf8', marginTop: '0.2rem' }}>
              {instructorCoveredCount} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {RAW_QUESTIONS.length}</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('students')}
            style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Enrolled Students</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#fff', marginTop: '0.2rem' }}>{batchMetrics.totalStudents}</div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Student Progress</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--color-completed)', marginTop: '0.2rem' }}>{batchMetrics.avgCompletion}%</div>
          </div>

          <div 
            onClick={() => setActiveTab('doubts')}
            style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Doubts</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--color-doubt)', marginTop: '0.2rem' }}>{batchMetrics.totalDoubts}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.35rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.4rem',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('questions')}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius)',
            fontSize: '0.82rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'questions' ? 'var(--bg-hover)' : 'transparent',
            color: activeTab === 'questions' ? '#fff' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <span>Questions Tracker</span>
          <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', color: '#38bdf8' }}>
            {instructorCoveredCount}/{RAW_QUESTIONS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius)',
            fontSize: '0.82rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'overview' ? 'var(--bg-hover)' : 'transparent',
            color: activeTab === 'overview' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          Modules Overview
        </button>

        <button
          onClick={() => setActiveTab('doubts')}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius)',
            fontSize: '0.82rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'doubts' ? 'var(--bg-hover)' : 'transparent',
            color: activeTab === 'doubts' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          Doubts ({batchMetrics.totalDoubts})
        </button>

        <button
          onClick={() => setActiveTab('students')}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius)',
            fontSize: '0.82rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'students' ? 'var(--bg-hover)' : 'transparent',
            color: activeTab === 'students' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          Students ({studentsStats.length})
        </button>

        <button
          onClick={() => setActiveTab('add-student')}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius)',
            fontSize: '0.82rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'add-student' ? 'var(--bg-hover)' : 'transparent',
            color: activeTab === 'add-student' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          Add Student Credentials
        </button>
      </div>

      {/* TAB: QUESTION TRACKER */}
      {activeTab === 'questions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.6rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            padding: '0.75rem 1rem'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
              <div style={{ position: 'relative', minWidth: '220px', flex: 1, maxWidth: '320px' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search questions or topics..."
                  value={qSearch}
                  onChange={e => setQSearch(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2rem', fontSize: '0.8rem', height: '32px' }}
                />
              </div>

              <select
                value={qModuleFilter}
                onChange={e => setQModuleFilter(e.target.value)}
                style={{ fontSize: '0.8rem', height: '32px', backgroundColor: 'var(--bg-subtle)' }}
              >
                <option value="all">All Modules ({RAW_QUESTIONS.length})</option>
                {MODULES.map(m => {
                  const count = RAW_QUESTIONS.filter(q => q.moduleId === m.id).length;
                  return <option key={m.id} value={m.id}>{m.title} ({count})</option>;
                })}
              </select>

              <select
                value={qDifficultyFilter}
                onChange={e => setQDifficultyFilter(e.target.value)}
                style={{ fontSize: '0.8rem', height: '32px', backgroundColor: 'var(--bg-subtle)' }}
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={qStatusFilter}
                onChange={e => setQStatusFilter(e.target.value as any)}
                style={{ fontSize: '0.8rem', height: '32px', backgroundColor: 'var(--bg-subtle)' }}
              >
                <option value="all">All Statuses</option>
                <option value="instructor_done">✔ Instructor Covered ({instructorCoveredCount})</option>
                <option value="instructor_pending">⏳ Instructor Pending ({RAW_QUESTIONS.length - instructorCoveredCount})</option>
                <option value="has_students_done">👥 Solved by &ge; 1 Student</option>
                <option value="zero_done">⭕ Unsolved by Students (0)</option>
                <option value="has_doubts">❓ Questions with Doubts</option>
              </select>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredQuestions.length}</strong> of {RAW_QUESTIONS.length}
            </div>
          </div>

          {/* Table Container */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.65rem 0.9rem', width: '45px' }}>#</th>
                  <th style={{ padding: '0.65rem 0.9rem' }}>Question & Topic</th>
                  <th style={{ padding: '0.65rem 0.9rem', width: '85px' }}>Difficulty</th>
                  <th style={{ padding: '0.65rem 0.9rem', width: '150px' }}>Instructor Status</th>
                  <th style={{ padding: '0.65rem 0.9rem', width: '160px' }}>Students Done</th>
                  <th style={{ padding: '0.65rem 0.9rem', width: '100px' }}>Doubts</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No questions match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredQuestions.map((q, idx) => {
                    const isCovered = effectiveInstructorProgress?.[q.id]?.status === 'completed';
                    const stat = questionsStats[q.id] || { completedCount: 0, doubtCount: 0, completedStudents: [], doubtStudents: [] };
                    const totalStudents = Math.max(studentsStats.length, 1);
                    const completionPct = Math.round((stat.completedCount / totalStudents) * 100);
                    const isExpanded = expandedQuestionId === q.id;

                    const difficultyColor = q.difficulty === 'Easy' 
                      ? 'var(--color-completed)' 
                      : q.difficulty === 'Medium' 
                        ? '#eab308' 
                        : '#ef4444';

                    return (
                      <React.Fragment key={q.id}>
                        <tr style={{
                          borderBottom: '1px solid var(--border-color)',
                          backgroundColor: isCovered ? 'rgba(34, 197, 94, 0.02)' : 'transparent'
                        }}>
                          <td style={{ padding: '0.75rem 0.9rem', color: 'var(--text-muted)' }}>
                            {idx + 1}
                          </td>

                          <td style={{ padding: '0.75rem 0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                              {q.url ? (
                                <a
                                  href={q.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: '#fff',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.color = '#38bdf8')}
                                  onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
                                >
                                  {q.title}
                                  <ExternalLink size={11} style={{ color: 'var(--text-muted)' }} />
                                </a>
                              ) : (
                                <span style={{ color: '#fff', fontWeight: 500 }}>{q.title}</span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{q.moduleTitle}</span>
                              <span style={{ color: 'var(--border-color)' }}>•</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{q.topic}</span>
                            </div>
                          </td>

                          <td style={{ padding: '0.75rem 0.9rem' }}>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 500,
                              color: difficultyColor,
                              backgroundColor: `${difficultyColor}15`,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              display: 'inline-block'
                            }}>
                              {q.difficulty}
                            </span>
                          </td>

                          <td style={{ padding: '0.75rem 0.9rem' }}>
                            <button
                              type="button"
                              onClick={async () => {
                                const nextStatus = isCovered ? 'not_completed' : 'completed';
                                setInternalInstructorProgress(prev => ({
                                  ...prev,
                                  [q.id]: {
                                    status: nextStatus,
                                    updatedAt: new Date().toISOString()
                                  }
                                }));
                                if (onInstructorProgressUpdate) {
                                  onInstructorProgressUpdate(q.id, nextStatus);
                                } else {
                                  await supabaseService.saveInstructorProgress(q.id, nextStatus);
                                }
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.3rem 0.65rem',
                                borderRadius: 'var(--radius)',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                border: isCovered ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--border-color)',
                                backgroundColor: isCovered ? 'rgba(34, 197, 94, 0.12)' : 'var(--bg-subtle)',
                                color: isCovered ? 'var(--color-completed)' : 'var(--text-secondary)'
                              }}
                              title={isCovered ? 'Click to mark as pending' : 'Click to mark as covered/completed'}
                            >
                              <CheckCircle2 size={13} style={{ color: isCovered ? 'var(--color-completed)' : 'var(--text-muted)' }} />
                              <span>{isCovered ? 'Covered' : 'Mark Done'}</span>
                            </button>
                          </td>

                          <td style={{ padding: '0.75rem 0.9rem' }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                                <span style={{ fontWeight: 600, color: stat.completedCount > 0 ? '#fff' : 'var(--text-muted)' }}>
                                  {stat.completedCount} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>/ {studentsStats.length}</span>
                                </span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{completionPct}%</span>
                              </div>
                              <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: `${completionPct}%`, height: '100%', backgroundColor: 'var(--color-completed)' }} />
                              </div>
                              {stat.completedCount > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#38bdf8',
                                    fontSize: '0.7rem',
                                    padding: '0.2rem 0 0 0',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.2rem'
                                  }}
                                >
                                  {isExpanded ? 'Hide' : 'Students'}
                                  {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                </button>
                              )}
                            </div>
                          </td>

                          <td style={{ padding: '0.75rem 0.9rem' }}>
                            {stat.doubtCount > 0 ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.72rem',
                                color: 'var(--color-doubt)',
                                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                                padding: '0.2rem 0.45rem',
                                borderRadius: '4px'
                              }}>
                                <HelpCircle size={12} />
                                {stat.doubtCount} doubt{stat.doubtCount > 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                            )}
                          </td>
                        </tr>

                        {/* Expandable row showing student names */}
                        {isExpanded && (
                          <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                            <td colSpan={6} style={{ padding: '0.75rem 1rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>
                                  Students who completed this question ({stat.completedStudents.length}):
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                  {stat.completedStudents.map((name, sIdx) => (
                                    <span
                                      key={sIdx}
                                      style={{
                                        fontSize: '0.72rem',
                                        backgroundColor: 'var(--bg-hover)',
                                        border: '1px solid var(--border-color)',
                                        padding: '0.15rem 0.45rem',
                                        borderRadius: '4px',
                                        color: 'var(--text-secondary)'
                                      }}
                                    >
                                      {name}
                                    </span>
                                  ))}
                                </div>
                                {stat.doubtStudents.length > 0 && (
                                  <div style={{ marginTop: '0.3rem' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-doubt)' }}>
                                      Students with doubts ({stat.doubtStudents.length}):
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                                      {stat.doubtStudents.map((name, sIdx) => (
                                        <span
                                          key={sIdx}
                                          style={{
                                            fontSize: '0.72rem',
                                            backgroundColor: 'rgba(234, 179, 8, 0.12)',
                                            border: '1px solid rgba(234, 179, 8, 0.25)',
                                            padding: '0.15rem 0.45rem',
                                            borderRadius: '4px',
                                            color: '#facc15'
                                          }}
                                        >
                                          {name}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
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
      )}

      {/* TAB 1: MODULES OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '0.75rem'
        }}>
          {MODULES.map(m => {
            const qs = RAW_QUESTIONS.filter(q => q.moduleId === m.id);
            const doubts = doubtsList.filter(d => d.moduleTitle === m.title && !d.resolved);
            const coveredInModule = qs.filter(q => effectiveInstructorProgress?.[q.id]?.status === 'completed').length;

            return (
              <div
                key={m.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>{m.title}</span>
                    <span style={{ fontSize: '0.75rem', color: doubts.length > 0 ? 'var(--color-doubt)' : 'var(--text-muted)' }}>
                      {doubts.length} doubts
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {m.description}
                  </p>
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>{qs.length} questions • <strong style={{ color: '#38bdf8' }}>{coveredInModule} covered</strong></span>
                  <button
                    onClick={() => {
                      setQModuleFilter(m.id);
                      setActiveTab('questions');
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    View Questions →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: DOUBTS */}
      {activeTab === 'doubts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={doubtModuleFilter}
                onChange={e => setDoubtModuleFilter(e.target.value)}
                style={{ fontSize: '0.8rem', height: '32px' }}
              >
                <option value="all">All Modules</option>
                {MODULES.map(m => (
                  <option key={m.id} value={m.title}>{m.title}</option>
                ))}
              </select>

              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={hideResolvedDoubts}
                  onChange={e => setHideResolvedDoubts(e.target.checked)}
                />
                Hide resolved
              </label>
            </div>

            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {filteredDoubts.length} doubts listed
            </span>
          </div>

          {filteredDoubts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No doubts to display.
            </div>
          ) : (
            filteredDoubts.map(doubt => (
              <div
                key={doubt.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius)',
                  padding: '0.85rem 1rem',
                  opacity: doubt.resolved ? 0.6 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{doubt.studentName}</span>
                      <span style={{ color: 'var(--text-muted)' }}>({doubt.studentEmail})</span>
                      <span style={{ color: 'var(--text-muted)' }}>• {doubt.moduleTitle}</span>
                    </div>

                    <div style={{ fontWeight: 500, fontSize: '0.88rem', color: '#fff', marginTop: '0.3rem' }}>
                      {doubt.questionTitle}
                    </div>

                    {doubt.notes && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-doubt)', marginTop: '0.3rem' }}>
                        Note: {doubt.notes}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleDoubtResolved(doubt.id)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                  >
                    {doubt.resolved ? <Check size={12} color="var(--color-completed)" /> : null}
                    {doubt.resolved ? 'Resolved' : 'Mark Resolved'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: STUDENTS DIRECTORY */}
      {activeTab === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ position: 'relative', maxWidth: '320px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by student name or email..."
              value={searchStudent}
              onChange={e => setSearchStudent(e.target.value)}
              style={{ width: '100%', paddingLeft: '2rem', height: '34px' }}
            />
          </div>

          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden'
          }}>
            <table>
              <thead>
                <tr style={{
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-subtle)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase'
                }}>
                  <th style={{ padding: '0.65rem 1rem' }}>Student</th>
                  <th style={{ padding: '0.65rem 1rem' }}>Batch</th>
                  <th style={{ padding: '0.65rem 1rem' }}>Completed</th>
                  <th style={{ padding: '0.65rem 1rem' }}>Doubts</th>
                  <th style={{ padding: '0.65rem 1rem', width: '160px' }}>Progress</th>
                  <th style={{ padding: '0.65rem 1rem', width: '90px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.studentId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>{student.studentName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{student.studentEmail}</div>
                    </td>
                    <td style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {student.batch || 'Batch 2026'}
                    </td>
                    <td style={{ padding: '0.65rem 1rem', fontSize: '0.82rem', color: 'var(--color-completed)', fontWeight: 600 }}>
                      {student.completed} / {student.total}
                    </td>
                    <td style={{ padding: '0.65rem 1rem', fontSize: '0.82rem', color: 'var(--color-doubt)', fontWeight: 600 }}>
                      {student.doubt}
                    </td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--bg-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${student.percentage}%`, height: '100%', backgroundColor: 'var(--color-completed)' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{student.percentage}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <button
                        onClick={() => setSelectedStudentForModal(student)}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ADD STUDENT (SINGLE & BULK PROVISIONING) */}
      {activeTab === 'add-student' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem',
          maxWidth: '620px'
        }}>
          {/* Header & Mode Switch */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                Create Student Credentials
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                Provision logins directly so students do not need a sign-up page.
              </p>
            </div>

            <div style={{ display: 'flex', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '2px' }}>
              <button
                type="button"
                onClick={() => setBulkMode('single')}
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: bulkMode === 'single' ? 'var(--bg-hover)' : 'transparent',
                  color: bulkMode === 'single' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Single
              </button>
              <button
                type="button"
                onClick={() => setBulkMode('bulk')}
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: bulkMode === 'bulk' ? 'var(--bg-hover)' : 'transparent',
                  color: bulkMode === 'bulk' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Bulk Import
              </button>
            </div>
          </div>

          {createdSuccessMsg && (
            <div style={{ padding: '0.6rem 0.8rem', backgroundColor: 'var(--color-completed-bg)', border: '1px solid var(--color-completed-border)', color: 'var(--color-completed)', borderRadius: 'var(--radius)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              {createdSuccessMsg}
            </div>
          )}

          {bulkMode === 'single' ? (
            /* Single Student Form */
            <form onSubmit={handleCreateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rohit Verma"
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Email (Student Login)
                </label>
                <input
                  type="email"
                  placeholder="e.g. rohit.verma@example.com"
                  value={newStudentEmail}
                  onChange={e => setNewStudentEmail(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Batch
                </label>
                <select
                  value={newStudentBatch}
                  onChange={e => setNewStudentBatch(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Batch 2026-A">Batch 2026-A</option>
                  <option value="Batch 2026-B">Batch 2026-B</option>
                  <option value="FastTrack Batch">FastTrack Batch</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                Create Credential
              </button>
            </form>
          ) : (
            /* Bulk Students CSV Form */
            <form onSubmit={handleBulkCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Paste CSV or Upload a .CSV File (Format: <code>email,password</code>)
                  </label>
                  <label style={{
                    fontSize: '0.75rem',
                    color: '#fff',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer'
                  }}>
                    📁 Choose .CSV File
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                <textarea
                  rows={6}
                  placeholder={`email,password\nstudent1@example.com,pass123\nstudent2@example.com,secret456\nstudent3@example.com,student@2026`}
                  value={bulkEmailsText}
                  onChange={e => setBulkEmailsText(e.target.value)}
                  style={{ width: '100%', fontSize: '0.82rem', fontFamily: 'monospace' }}
                  required
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  Supported formats per line: <code>email,password</code> or <code>email,password,name</code>. Header row (<code>email,password</code>) is automatically detected and skipped.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Assign to Batch
                </label>
                <select
                  value={newStudentBatch}
                  onChange={e => setNewStudentBatch(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Batch 2026-A">Batch 2026-A</option>
                  <option value="Batch 2026-B">Batch 2026-B</option>
                  <option value="FastTrack Batch">FastTrack Batch</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.25rem' }}>
                Provision All Accounts From CSV
              </button>
            </form>
          )}

          {/* List of provisioned credentials with Copy & Download buttons */}
          {generatedCredentialsList.length > 0 && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Provisioned Student Accounts ({generatedCredentialsList.length})
                </span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={downloadCredentialsCSV}
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    <Download size={12} /> Download CSV
                  </button>
                  <button
                    type="button"
                    onClick={copyCredentialsToClipboard}
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    {copiedCredentials ? <Check size={12} color="var(--color-completed)" /> : <Copy size={12} />}
                    {copiedCredentials ? 'Copied!' : 'Copy All'}
                  </button>
                </div>
              </div>

              <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '0.5rem' }}>
                {generatedCredentialsList.map((c, i) => (
                  <div key={i} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      <strong style={{ color: '#fff' }}>{c.email}</strong> • Password: <code>{c.pass}</code>
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedStudentForModal && (
        <StudentDetailModal
          student={selectedStudentForModal}
          onClose={() => setSelectedStudentForModal(null)}
        />
      )}
    </div>
  );
};
