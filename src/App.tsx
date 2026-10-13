import React, { useState, useEffect, useCallback } from 'react';
import { User, ProgressStatus } from './types';
import { supabaseService } from './services/supabase';
import { RAW_QUESTIONS } from './data/dsaQuestionsData';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherAnalytics } from './components/TeacherAnalytics';
import { LoginPage } from './components/LoginPage';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => supabaseService.getCurrentUser());
  const [activeView, setActiveView] = useState<'student' | 'teacher'>('student');
  const [progressMap, setProgressMap] = useState<Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }>>({});
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState<boolean>(() => supabaseService.getConfiguration().isConfigured);
  const [loadingProgress, setLoadingProgress] = useState<boolean>(false);

  // Sync active view based on user role when user changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'teacher') {
        setActiveView('teacher');
      } else {
        setActiveView('student');
      }
    }
  }, [currentUser]);

  // Load current user's progress (student or instructor)
  const loadUserProgress = useCallback(async (user: User) => {
    setLoadingProgress(true);
    if (user.role === 'teacher') {
      const data = await supabaseService.getInstructorProgress();
      setProgressMap(data);
    } else {
      const data = await supabaseService.getStudentProgress(user.id);
      setProgressMap(data);
    }
    setLoadingProgress(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUserProgress(currentUser);
    }
  }, [currentUser, loadUserProgress]);

  // Handle question progress update
  const handleProgressUpdate = async (questionId: string, status: ProgressStatus, notes?: string) => {
    if (!currentUser) return;

    // Optimistic UI update
    setProgressMap(prev => ({
      ...prev,
      [questionId]: {
        status,
        notes: notes !== undefined ? notes : prev[questionId]?.notes,
        updatedAt: new Date().toISOString()
      }
    }));

    if (currentUser.role === 'teacher') {
      await supabaseService.saveInstructorProgress(questionId, status, notes);
    } else {
      await supabaseService.updateQuestionProgress(currentUser.id, questionId, status, notes);
    }
  };

  // Quick student stats for Navbar badge
  const studentStats = React.useMemo(() => {
    if (!currentUser) return undefined;
    let completed = 0;
    let doubt = 0;
    RAW_QUESTIONS.forEach(q => {
      const p = progressMap[q.id];
      if (p?.status === 'completed') completed++;
      else if (p?.status === 'doubt') doubt++;
    });
    return {
      completed,
      doubt,
      total: RAW_QUESTIONS.length
    };
  }, [currentUser, progressMap]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    supabaseService.logout();
    setCurrentUser(null);
    setProgressMap({});
  };

  const handleConfigSaved = () => {
    setIsSupabaseConfigured(supabaseService.getConfiguration().isConfigured);
    if (currentUser) {
      loadUserProgress(currentUser);
    }
  };

  // If user is not logged in, render the clean login page without DB config controls
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Header (Only authenticated users see the app header) */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSupabaseConfigured={isSupabaseConfigured}
        studentStats={studentStats}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {activeView === 'student' ? (
          <StudentDashboard
            currentUser={currentUser}
            progressMap={progressMap}
            onProgressUpdate={handleProgressUpdate}
          />
        ) : (
          <TeacherAnalytics
            currentUser={currentUser}
            instructorProgress={progressMap}
            onInstructorProgressUpdate={handleProgressUpdate}
          />
        )}
      </main>

      {/* Supabase Config Modal (Accessible only from inside the app by instructor) */}
      {isSettingsOpen && (
        <SupabaseConfigModal
          onClose={() => setIsSettingsOpen(false)}
          onConfigSaved={handleConfigSaved}
        />
      )}
    </div>
  );
};

export default App;
