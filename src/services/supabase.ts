import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, ProgressStatus, DoubtItem, StudentStats } from '../types';
import { RAW_QUESTIONS } from '../data/dsaQuestionsData';

// Local storage keys
const STORAGE_KEY_SUPABASE_URL = 'dsa_tracker_supabase_url';
const STORAGE_KEY_SUPABASE_ANON = 'dsa_tracker_supabase_anon';
const STORAGE_KEY_AUTH_USER = 'dsa_tracker_auth_user';
const STORAGE_KEY_STUDENTS_PROGRESS = 'dsa_tracker_mock_progress';
const STORAGE_KEY_RESOLVED_DOUBTS = 'dsa_tracker_resolved_doubts';

import { PRELOADED_STUDENTS } from '../data/preloadedStudents';

// Default mock users
const initialPreloadedUsers: User[] = PRELOADED_STUDENTS.map((s, idx) => ({
  id: `student-preloaded-${idx + 1}`,
  email: s.email,
  name: s.name,
  role: 'student' as const,
  batch: 'Batch 2026'
}));

export const DEFAULT_USERS: User[] = [
  {
    id: 'user-teacher-1',
    email: 'instructor@dsatracker.com',
    name: 'Prof. Swamy (DSA Lead)',
    role: 'teacher',
    batch: 'Faculty Lead',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
  },
  ...initialPreloadedUsers
];

// Seed initial instructor credentials in local storage if not present
if (typeof window !== 'undefined' && !localStorage.getItem('dsa_tracker_passwords')) {
  const initialPasswords: Record<string, string> = {
    'instructor@dsatracker.com': 'swamy@2026'
  };
  localStorage.setItem('dsa_tracker_passwords', JSON.stringify(initialPasswords));
}

// Initialize default mock progress
function getInitialMockProgress(): Record<string, Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }>> {
  const stored = localStorage.getItem(STORAGE_KEY_STUDENTS_PROGRESS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }
  return {};
}

class SupabaseService {
  private client: SupabaseClient | null = null;
  private url: string = '';
  private anonKey: string = '';
  private isConfigured: boolean = false;
  private mockProgress = getInitialMockProgress();

  constructor() {
    this.initClient();
  }

  private initClient() {
    const envUrl = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || '';
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem(STORAGE_KEY_SUPABASE_ANON) || '';

    this.url = envUrl;
    this.anonKey = envKey;

    if (envUrl && envKey && envUrl.startsWith('http')) {
      try {
        this.client = createClient(envUrl, envKey);
        this.isConfigured = true;
      } catch (err) {
        console.warn('Could not initialize Supabase client:', err);
        this.isConfigured = false;
      }
    } else {
      this.isConfigured = false;
    }
  }

  public getConfiguration() {
    return {
      url: this.url,
      anonKey: this.anonKey,
      isConfigured: this.isConfigured
    };
  }

  public saveConfiguration(url: string, anonKey: string) {
    localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url);
    localStorage.setItem(STORAGE_KEY_SUPABASE_ANON, anonKey);
    this.initClient();
    return this.isConfigured;
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  // Auth: Get current session user
  public getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH_USER);
    }
  }

  // Helper to get expected password for local/offline auth
  public getExpectedPassword(email: string): string | null {
    const norm = email.toLowerCase().trim();

    // 1. Instructor password
    if (norm === 'instructor@dsatracker.com') {
      return 'swamy@2026';
    }

    // 2. Check localStorage dsa_tracker_passwords
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('dsa_tracker_passwords');
        if (stored) {
          const map = JSON.parse(stored);
          if (map && map[norm]) {
            return map[norm];
          }
        }
      } catch {}
    }

    return null;
  }

  // Login handler
  public async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = (password || '').trim();

    if (!trimmedEmail) {
      return { user: null, error: 'Please enter your email address.' };
    }
    if (!trimmedPassword) {
      return { user: null, error: 'Please enter your password.' };
    }

    // 1. If Supabase is connected, authenticate strictly against Supabase Auth
    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword
        });

        if (error) {
          // Strictly reject if credentials are invalid on Supabase
          return { user: null, error: error.message || 'Invalid email or password.' };
        }

        if (data?.user) {
          // Fetch user profile from Supabase profiles table
          const { data: profile } = await this.client
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const role = (profile?.role as 'student' | 'teacher') || 'student';
          const userObj: User = {
            id: data.user.id,
            email: data.user.email || trimmedEmail,
            name: profile?.full_name || trimmedEmail.split('@')[0],
            role: role,
            batch: profile?.batch || 'DSA Batch 2026',
            avatar: profile?.avatar_url
          };

          this.setCurrentUser(userObj);
          return { user: userObj, error: null };
        }
      } catch (e: any) {
        console.error('Supabase authentication error:', e);
        return { user: null, error: e.message || 'Authentication service error.' };
      }
    }

    // 2. Strict Offline / Local / Demo Authentication
    // Only registered accounts (instructor, preloaded 80 students, and teacher-uploaded CSV students) with their EXACT passwords can log in!
    const allUsers = this.getAllRegisteredUsers();
    const matched = allUsers.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!matched) {
      return { user: null, error: 'No account registered with this email. Please check your email or contact the instructor.' };
    }

    const expectedPassword = this.getExpectedPassword(trimmedEmail);
    if (!expectedPassword) {
      return { user: null, error: 'No password found for this account. Please contact the instructor.' };
    }

    if (expectedPassword !== trimmedPassword) {
      return { user: null, error: 'Incorrect password. Please verify your credentials.' };
    }

    // Valid credentials verified!
    this.setCurrentUser(matched);
    return { user: matched, error: null };
  }

  public logout() {
    this.setCurrentUser(null);
    if (this.client) {
      this.client.auth.signOut().catch(() => {});
    }
  }

  // Get all registered users (for teacher student manager)
  public getAllRegisteredUsers(): User[] {
    const extra = localStorage.getItem('dsa_tracker_extra_users');
    let extraUsers: User[] = [];
    if (extra) {
      try {
        extraUsers = JSON.parse(extra);
      } catch {
        // ignore
      }
    }
    return [...DEFAULT_USERS, ...extraUsers];
  }

  // Add new student credential (used by Teacher)
  public addNewStudent(student: { name?: string; email: string; password?: string; batch?: string }): User {
    const trimmedEmail = student.email.trim().toLowerCase();
    const newUser: User = {
      id: 'student-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: student.name || trimmedEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: trimmedEmail,
      role: 'student',
      batch: student.batch || 'Batch 2026'
    };

    // Store custom password if provided
    if (student.password) {
      const storedPasswords = localStorage.getItem('dsa_tracker_passwords') || '{}';
      try {
        const pwMap = JSON.parse(storedPasswords);
        pwMap[trimmedEmail] = student.password;
        localStorage.setItem('dsa_tracker_passwords', JSON.stringify(pwMap));
      } catch {}
    }

    const extra = localStorage.getItem('dsa_tracker_extra_users');
    let extraUsers: User[] = [];
    if (extra) {
      try {
        extraUsers = JSON.parse(extra);
      } catch {
        extraUsers = [];
      }
    }
    extraUsers.push(newUser);
    localStorage.setItem('dsa_tracker_extra_users', JSON.stringify(extraUsers));

    // Also initialize student progress
    if (!this.mockProgress[newUser.id]) {
      this.mockProgress[newUser.id] = {};
      RAW_QUESTIONS.forEach(q => {
        this.mockProgress[newUser.id][q.id] = {
          status: 'not_completed',
          updatedAt: new Date().toISOString()
        };
      });
      this.persistMockProgress();
    }

    // Sync to Supabase profiles if configured
    if (this.isConfigured && this.client) {
      this.client
        .from('profiles')
        .upsert({
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.name,
          role: 'student',
          batch: newUser.batch
        })
        .catch(() => {});
    }

    return newUser;
  }

  // Student Progress: Get progress map for a student
  public async getStudentProgress(studentId: string): Promise<Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }>> {
    // 1. If Supabase configured, query directly from DB for this specific student
    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client
          .from('student_progress')
          .select('question_id, status, notes, updated_at')
          .eq('student_id', studentId);

        if (!error && data) {
          const map: Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }> = {};
          data.forEach(item => {
            map[item.question_id] = {
              status: item.status as ProgressStatus,
              notes: item.notes,
              updatedAt: item.updated_at
            };
          });
          return map;
        }
      } catch (err) {
        console.warn('Error fetching progress from Supabase:', err);
      }
    }

    // 2. Fallback to mock / local progress strictly isolated per studentId
    if (!this.mockProgress[studentId]) {
      this.mockProgress[studentId] = {};
      this.persistMockProgress();
    }

    return this.mockProgress[studentId];
  }

  // Update question status for a student
  public async updateQuestionProgress(
    studentId: string,
    questionId: string,
    status: ProgressStatus,
    notes?: string
  ): Promise<boolean> {
    const updatedAt = new Date().toISOString();

    // Update in memory/local
    if (!this.mockProgress[studentId]) {
      this.mockProgress[studentId] = {};
    }
    this.mockProgress[studentId][questionId] = {
      status,
      notes: notes !== undefined ? notes : this.mockProgress[studentId][questionId]?.notes,
      updatedAt
    };
    this.persistMockProgress();

    // 2. If Supabase configured, upsert into DB
    if (this.isConfigured && this.client) {
      try {
        const { error } = await this.client
          .from('student_progress')
          .upsert({
            student_id: studentId,
            question_id: questionId,
            status: status,
            notes: notes || null,
            updated_at: updatedAt
          }, { onConflict: 'student_id, question_id' });

        if (error) {
          console.warn('Could not sync to Supabase student_progress:', error.message);
        }
      } catch (err) {
        console.warn('Could not sync to Supabase:', err);
      }
    }

    return true;
  }

  // Instructor Progress: Dedicated persistent methods syncing across deployment & local
  public async getInstructorProgress(): Promise<Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }>> {
    const INSTRUCTOR_KEY = 'instructor';
    
    // 1. If Supabase configured, fetch instructor progress from DB
    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client
          .from('student_progress')
          .select('question_id, status, notes, updated_at')
          .in('student_id', [INSTRUCTOR_KEY, 'user-teacher-1']);

        if (!error && data && data.length > 0) {
          const map: Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }> = {};
          data.forEach(item => {
            map[item.question_id] = {
              status: item.status as ProgressStatus,
              notes: item.notes,
              updatedAt: item.updated_at
            };
          });
          // Cache in localStorage
          localStorage.setItem('dsa_tracker_instructor_progress', JSON.stringify(map));
          return map;
        }
      } catch (err) {
        console.warn('Error fetching instructor progress from Supabase:', err);
      }
    }

    // 2. Fallback to localStorage
    const stored = localStorage.getItem('dsa_tracker_instructor_progress');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }

    if (this.mockProgress[INSTRUCTOR_KEY] && Object.keys(this.mockProgress[INSTRUCTOR_KEY]).length > 0) {
      return this.mockProgress[INSTRUCTOR_KEY];
    }
    if (this.mockProgress['user-teacher-1'] && Object.keys(this.mockProgress['user-teacher-1']).length > 0) {
      return this.mockProgress['user-teacher-1'];
    }

    return {};
  }

  public async saveInstructorProgress(
    questionId: string,
    status: ProgressStatus,
    notes?: string
  ): Promise<boolean> {
    const INSTRUCTOR_KEY = 'instructor';
    const updatedAt = new Date().toISOString();

    // 1. Update in local storage cache
    let currentMap: Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }> = {};
    const stored = localStorage.getItem('dsa_tracker_instructor_progress');
    if (stored) {
      try {
        currentMap = JSON.parse(stored);
      } catch {}
    }
    currentMap[questionId] = {
      status,
      notes: notes !== undefined ? notes : currentMap[questionId]?.notes,
      updatedAt
    };
    localStorage.setItem('dsa_tracker_instructor_progress', JSON.stringify(currentMap));

    // Also update mockProgress for both 'instructor' and 'user-teacher-1'
    if (!this.mockProgress[INSTRUCTOR_KEY]) this.mockProgress[INSTRUCTOR_KEY] = {};
    this.mockProgress[INSTRUCTOR_KEY][questionId] = currentMap[questionId];
    if (!this.mockProgress['user-teacher-1']) this.mockProgress['user-teacher-1'] = {};
    this.mockProgress['user-teacher-1'][questionId] = currentMap[questionId];
    this.persistMockProgress();

    // 2. If Supabase configured, save to Supabase student_progress table
    if (this.isConfigured && this.client) {
      try {
        const { error } = await this.client
          .from('student_progress')
          .upsert({
            student_id: INSTRUCTOR_KEY,
            question_id: questionId,
            status: status,
            notes: notes || null,
            updated_at: updatedAt
          }, { onConflict: 'student_id, question_id' });

        if (error) {
          console.warn('Could not sync instructor progress to Supabase:', error.message);
        }
      } catch (err) {
        console.warn('Could not sync instructor progress to Supabase:', err);
      }
    }

    return true;
  }

  private persistMockProgress() {
    localStorage.setItem(STORAGE_KEY_STUDENTS_PROGRESS, JSON.stringify(this.mockProgress));
  }

  // Analytics for Teacher: Get stats for all students
  public async getAllStudentsStats(): Promise<StudentStats[]> {
    const totalQ = RAW_QUESTIONS.length;

    // 1. If Supabase configured, query Supabase profiles & student_progress directly
    if (this.isConfigured && this.client) {
      try {
        const { data: profiles, error: pError } = await this.client
          .from('profiles')
          .select('id, email, full_name, role, batch')
          .eq('role', 'student');

        const { data: allProgress, error: progError } = await this.client
          .from('student_progress')
          .select('student_id, question_id, status, notes, updated_at');

        if (!pError && profiles && profiles.length > 0) {
          const progressByStudent: Record<string, Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }>> = {};
          if (!progError && allProgress) {
            allProgress.forEach(row => {
              if (!progressByStudent[row.student_id]) {
                progressByStudent[row.student_id] = {};
              }
              progressByStudent[row.student_id][row.question_id] = {
                status: row.status as ProgressStatus,
                notes: row.notes,
                updatedAt: row.updated_at
              };
            });
          }

          const stats: StudentStats[] = profiles.map(student => {
            const prog = progressByStudent[student.id] || {};
            let completed = 0;
            let doubt = 0;
            let notCompleted = 0;
            let latestTime = '';

            Object.values(prog).forEach(item => {
              if (item.status === 'completed') completed++;
              else if (item.status === 'doubt') doubt++;
              else notCompleted++;

              if (!latestTime || (item.updatedAt && item.updatedAt > latestTime)) {
                latestTime = item.updatedAt;
              }
            });

            const countedTotal = completed + doubt + notCompleted;
            const effectiveTotal = Math.max(countedTotal, totalQ);
            const remaining = effectiveTotal - completed - doubt;

            return {
              studentId: student.id,
              studentName: student.full_name || student.email.split('@')[0],
              studentEmail: student.email,
              batch: student.batch || 'Batch 2026',
              completed,
              doubt,
              notCompleted: remaining > 0 ? remaining : notCompleted,
              total: totalQ,
              percentage: Math.round((completed / totalQ) * 100),
              lastActive: latestTime || new Date().toISOString()
            };
          });

          return stats.sort((a, b) => b.percentage - a.percentage);
        }
      } catch (err) {
        console.warn('Error fetching student stats from Supabase:', err);
      }
    }

    // 2. Fallback to registered local users
    const allUsers = this.getAllRegisteredUsers().filter(u => u.role === 'student');
    const stats: StudentStats[] = [];

    for (const student of allUsers) {
      const prog = await this.getStudentProgress(student.id);
      let completed = 0;
      let doubt = 0;
      let notCompleted = 0;
      let latestTime = '';

      Object.values(prog).forEach(item => {
        if (item.status === 'completed') completed++;
        else if (item.status === 'doubt') doubt++;
        else notCompleted++;

        if (!latestTime || (item.updatedAt && item.updatedAt > latestTime)) {
          latestTime = item.updatedAt;
        }
      });

      const countedTotal = completed + doubt + notCompleted;
      const effectiveTotal = Math.max(countedTotal, totalQ);
      const remaining = effectiveTotal - completed - doubt;

      stats.push({
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        batch: student.batch,
        completed,
        doubt,
        notCompleted: remaining > 0 ? remaining : notCompleted,
        total: totalQ,
        percentage: Math.round((completed / totalQ) * 100),
        lastActive: latestTime || new Date().toISOString()
      });
    }

    return stats.sort((a, b) => b.percentage - a.percentage);
  }

  // Get all questions where students flagged "Have Doubt in this Concept"
  public async getAllDoubts(): Promise<DoubtItem[]> {
    // 1. If Supabase configured, query directly
    if (this.isConfigured && this.client) {
      try {
        const { data: doubtRows } = await this.client
          .from('student_progress')
          .select('student_id, question_id, status, notes, updated_at')
          .eq('status', 'doubt');

        if (doubtRows && doubtRows.length > 0) {
          const { data: profiles } = await this.client
            .from('profiles')
            .select('id, email, full_name');
          const profileMap = new Map((profiles || []).map(p => [p.id, p]));
          const qMap = new Map(RAW_QUESTIONS.map(q => [q.id, q]));
          const resolvedIds = this.getResolvedDoubtIds();

          const doubts: DoubtItem[] = [];
          doubtRows.forEach(row => {
            const q = qMap.get(row.question_id);
            const prof = profileMap.get(row.student_id);
            if (q) {
              const doubtId = `${row.student_id}_${row.question_id}`;
              doubts.push({
                id: doubtId,
                studentId: row.student_id,
                studentName: prof?.full_name || prof?.email?.split('@')[0] || 'Student',
                studentEmail: prof?.email || '',
                questionId: q.id,
                questionTitle: q.title,
                moduleTitle: q.moduleTitle,
                topic: q.topic,
                difficulty: q.difficulty,
                notes: row.notes,
                updatedAt: row.updated_at,
                resolved: resolvedIds.includes(doubtId)
              });
            }
          });
          return doubts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        } else if (doubtRows) {
          return [];
        }
      } catch (err) {
        console.warn('Error fetching doubts from Supabase:', err);
      }
    }

    // 2. Local fallback
    const doubts: DoubtItem[] = [];
    const allUsers = this.getAllRegisteredUsers().filter(u => u.role === 'student');
    const resolvedIds = this.getResolvedDoubtIds();
    const qMap = new Map(RAW_QUESTIONS.map(q => [q.id, q]));

    for (const student of allUsers) {
      const prog = await this.getStudentProgress(student.id);
      Object.entries(prog).forEach(([qId, item]) => {
        if (item.status === 'doubt') {
          const q = qMap.get(qId);
          if (q) {
            const doubtId = `${student.id}_${qId}`;
            doubts.push({
              id: doubtId,
              studentId: student.id,
              studentName: student.name,
              studentEmail: student.email,
              questionId: q.id,
              questionTitle: q.title,
              moduleTitle: q.moduleTitle,
              topic: q.topic,
              difficulty: q.difficulty,
              notes: item.notes,
              updatedAt: item.updatedAt,
              resolved: resolvedIds.includes(doubtId)
            });
          }
        }
      });
    }

    return doubts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  // Question-by-question completion analytics across all students
  public async getQuestionsCompletionStats(): Promise<Record<string, { completedCount: number; doubtCount: number; completedStudents: string[]; doubtStudents: string[] }>> {
    const result: Record<string, { completedCount: number; doubtCount: number; completedStudents: string[]; doubtStudents: string[] }> = {};
    
    RAW_QUESTIONS.forEach(q => {
      result[q.id] = {
        completedCount: 0,
        doubtCount: 0,
        completedStudents: [],
        doubtStudents: []
      };
    });

    if (this.isConfigured && this.client) {
      try {
        const { data: progressRows } = await this.client
          .from('student_progress')
          .select('student_id, question_id, status');

        const { data: profiles } = await this.client
          .from('profiles')
          .select('id, full_name, email, role')
          .eq('role', 'student');

        const profileMap = new Map((profiles || []).map(p => [p.id, p.full_name || p.email.split('@')[0]]));

        if (progressRows) {
          progressRows.forEach(row => {
            if (row.student_id !== 'instructor' && row.student_id !== 'user-teacher-1' && result[row.question_id]) {
              const studentName = profileMap.get(row.student_id) || `Student (${row.student_id.substring(0, 8)})`;
              if (row.status === 'completed') {
                result[row.question_id].completedCount++;
                if (!result[row.question_id].completedStudents.includes(studentName)) {
                  result[row.question_id].completedStudents.push(studentName);
                }
              } else if (row.status === 'doubt') {
                result[row.question_id].doubtCount++;
                if (!result[row.question_id].doubtStudents.includes(studentName)) {
                  result[row.question_id].doubtStudents.push(studentName);
                }
              }
            }
          });
        }
        return result;
      } catch (err) {
        console.warn('Error fetching question stats from Supabase:', err);
      }
    }

    // Local fallback
    const allStudents = this.getAllRegisteredUsers().filter(u => u.role === 'student');
    for (const s of allStudents) {
      const p = await this.getStudentProgress(s.id);
      Object.entries(p).forEach(([qId, item]) => {
        if (result[qId]) {
          if (item.status === 'completed') {
            result[qId].completedCount++;
            result[qId].completedStudents.push(s.name);
          } else if (item.status === 'doubt') {
            result[qId].doubtCount++;
            result[qId].doubtStudents.push(s.name);
          }
        }
      });
    }

    return result;
  }

  public getResolvedDoubtIds(): string[] {
    const raw = localStorage.getItem(STORAGE_KEY_RESOLVED_DOUBTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public async toggleDoubtResolved(doubtId: string): Promise<boolean> {
    const current = this.getResolvedDoubtIds();
    let updated: string[];
    const isNowResolved = !current.includes(doubtId);
    if (current.includes(doubtId)) {
      updated = current.filter(id => id !== doubtId);
    } else {
      updated = [...current, doubtId];
    }
    localStorage.setItem(STORAGE_KEY_RESOLVED_DOUBTS, JSON.stringify(updated));

    if (this.isConfigured && this.client) {
      try {
        if (isNowResolved) {
          await this.client.from('resolved_doubts').upsert({ id: doubtId });
        } else {
          await this.client.from('resolved_doubts').delete().eq('id', doubtId);
        }
      } catch {}
    }

    return isNowResolved;
  }
}

export const supabaseService = new SupabaseService();
