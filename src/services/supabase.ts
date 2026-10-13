import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, ProgressStatus, DoubtItem, StudentStats } from '../types';
import { RAW_QUESTIONS } from '../data/dsaQuestionsData';

// Local storage keys
const STORAGE_KEY_SUPABASE_URL = 'dsa_tracker_supabase_url';
const STORAGE_KEY_SUPABASE_ANON = 'dsa_tracker_supabase_anon';
const STORAGE_KEY_AUTH_USER = 'dsa_tracker_auth_user';
const STORAGE_KEY_STUDENTS_PROGRESS = 'dsa_tracker_mock_progress';
const STORAGE_KEY_RESOLVED_DOUBTS = 'dsa_tracker_resolved_doubts';

// Default mock users
export const DEFAULT_USERS: User[] = [
  {
    id: 'user-student-1',
    email: 'rahul.sharma@dsatracker.com',
    name: 'Rahul Sharma',
    role: 'student',
    batch: 'Batch 2026-A',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'user-student-2',
    email: 'priya.patel@dsatracker.com',
    name: 'Priya Patel',
    role: 'student',
    batch: 'Batch 2026-A',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'user-student-3',
    email: 'amit.kumar@dsatracker.com',
    name: 'Amit Kumar',
    role: 'student',
    batch: 'Batch 2026-B',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'user-student-4',
    email: 'sneha.reddy@dsatracker.com',
    name: 'Sneha Reddy',
    role: 'student',
    batch: 'Batch 2026-A',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'user-teacher-1',
    email: 'instructor@dsatracker.com',
    name: 'Prof. Swamy (DSA Lead)',
    role: 'teacher',
    batch: 'Faculty Lead',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
  }
];

// Initialize default mock progress for the students to have realistic analytics out of the box
function getInitialMockProgress(): Record<string, Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }>> {
  const stored = localStorage.getItem(STORAGE_KEY_STUDENTS_PROGRESS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }

  // Pre-seed some realistic progress for demo students
  const initial: Record<string, Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }>> = {
    'user-student-1': {},
    'user-student-2': {},
    'user-student-3': {},
    'user-student-4': {}
  };

  // Seed Rahul Sharma (active student, completed some stack/queue & binary tree)
  RAW_QUESTIONS.forEach((q, idx) => {
    const now = new Date(Date.now() - (idx % 10) * 86400000).toISOString();
    if (q.isDoneDefault) {
      initial['user-student-1'][q.id] = { status: 'completed', updatedAt: now };
    } else if (idx === 0 || idx === 13 || idx === 21) {
      initial['user-student-1'][q.id] = {
        status: 'doubt',
        notes: idx === 21 ? 'Need help optimizing time complexity from O(N^2) to O(N)' : 'Confused with edge condition',
        updatedAt: now
      };
    } else {
      initial['user-student-1'][q.id] = { status: 'not_completed', updatedAt: now };
    }
  });

  // Seed Priya Patel (high achiever)
  RAW_QUESTIONS.forEach((q, idx) => {
    const now = new Date(Date.now() - (idx % 5) * 86400000).toISOString();
    if (idx < 50 || q.isDoneDefault) {
      initial['user-student-2'][q.id] = { status: 'completed', updatedAt: now };
    } else if (idx === 52 || idx === 65) {
      initial['user-student-2'][q.id] = {
        status: 'doubt',
        notes: 'Inorder/Postorder tree reconstruction edge case when array has duplicates',
        updatedAt: now
      };
    } else {
      initial['user-student-2'][q.id] = { status: 'not_completed', updatedAt: now };
    }
  });

  // Seed Amit Kumar (needs help with heaps & two pointers)
  RAW_QUESTIONS.forEach((q, idx) => {
    const now = new Date(Date.now() - (idx % 8) * 86400000).toISOString();
    if (idx < 25) {
      initial['user-student-3'][q.id] = { status: 'completed', updatedAt: now };
    } else if (idx === 75 || idx === 76 || idx === 90) {
      initial['user-student-3'][q.id] = {
        status: 'doubt',
        notes: 'Doubt in Heapify bottom-up vs top-down complexity calculation',
        updatedAt: now
      };
    } else {
      initial['user-student-3'][q.id] = { status: 'not_completed', updatedAt: now };
    }
  });

  // Seed Sneha Reddy
  RAW_QUESTIONS.forEach((q, idx) => {
    const now = new Date().toISOString();
    if (idx < 35) {
      initial['user-student-4'][q.id] = { status: 'completed', updatedAt: now };
    } else if (idx === 36) {
      initial['user-student-4'][q.id] = {
        status: 'doubt',
        notes: 'How to calculate maximum power score in sliding window?',
        updatedAt: now
      };
    } else {
      initial['user-student-4'][q.id] = { status: 'not_completed', updatedAt: now };
    }
  });

  localStorage.setItem(STORAGE_KEY_STUDENTS_PROGRESS, JSON.stringify(initial));
  return initial;
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

  // Login handler
  public async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. If Supabase is connected, try Supabase Auth first
    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client.auth.signInWithPassword({
          email: trimmedEmail,
          password: password
        });

        if (!error && data.user) {
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
        console.warn('Supabase auth failed, falling back to credentials list:', e);
      }
    }

    // 2. Mock / Default Users Authentication
    // Check registered or default users
    const allUsers = this.getAllRegisteredUsers();
    const matched = allUsers.find(u => u.email.toLowerCase() === trimmedEmail);

    if (matched) {
      // In default mode any non-empty password matches or "password123"
      this.setCurrentUser(matched);
      return { user: matched, error: null };
    }

    // Fallback: If user enters an email that ends with @teacher.com or includes 'admin' / 'instructor'
    if (trimmedEmail.includes('teacher') || trimmedEmail.includes('instructor') || trimmedEmail.includes('admin')) {
      const teacherUser: User = {
        id: 'user-' + Date.now(),
        email: trimmedEmail,
        name: trimmedEmail.split('@')[0].toUpperCase(),
        role: 'teacher',
        batch: 'Faculty Lead'
      };
      this.setCurrentUser(teacherUser);
      return { user: teacherUser, error: null };
    }

    // Fallback: allow student login with any email
    if (trimmedEmail.includes('@')) {
      const studentUser: User = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email: trimmedEmail,
        name: trimmedEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'student',
        batch: 'DSA Batch 2026'
      };
      this.setCurrentUser(studentUser);
      return { user: studentUser, error: null };
    }

    return { user: null, error: 'Invalid credentials. Please enter a valid email address.' };
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
  public addNewStudent(student: { name: string; email: string; batch?: string }): User {
    const newUser: User = {
      id: 'student-' + Date.now(),
      name: student.name,
      email: student.email.trim().toLowerCase(),
      role: 'student',
      batch: student.batch || 'Batch 2026'
    };

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

    return newUser;
  }

  // Student Progress: Get progress map for a student
  public async getStudentProgress(studentId: string): Promise<Record<string, { status: ProgressStatus; notes?: string; updatedAt: string }>> {
    // 1. If Supabase configured, attempt to query
    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client
          .from('student_progress')
          .select('question_id, status, notes, updated_at')
          .eq('student_id', studentId);

        if (!error && data && data.length > 0) {
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

    // 2. Fallback to mock / local progress
    if (!this.mockProgress[studentId]) {
      this.mockProgress[studentId] = {};
      RAW_QUESTIONS.forEach(q => {
        this.mockProgress[studentId][q.id] = {
          status: q.isDoneDefault ? 'completed' : 'not_completed',
          updatedAt: new Date().toISOString()
        };
      });
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
        await this.client
          .from('student_progress')
          .upsert({
            student_id: studentId,
            question_id: questionId,
            status: status,
            notes: notes || null,
            updated_at: updatedAt
          }, { onConflict: 'student_id, question_id' });
      } catch (err) {
        console.warn('Could not sync to Supabase:', err);
      }
    }

    return true;
  }

  private persistMockProgress() {
    localStorage.setItem(STORAGE_KEY_STUDENTS_PROGRESS, JSON.stringify(this.mockProgress));
  }

  // Analytics for Teacher: Get stats for all students
  public async getAllStudentsStats(): Promise<StudentStats[]> {
    const allUsers = this.getAllRegisteredUsers().filter(u => u.role === 'student');
    const totalQ = RAW_QUESTIONS.length;

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

      // Total could also account for unvisited questions
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

    // Sort descending by percentage
    return stats.sort((a, b) => b.percentage - a.percentage);
  }

  // Get all questions where students flagged "Have Doubt in this Concept"
  public async getAllDoubts(): Promise<DoubtItem[]> {
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

  public getResolvedDoubtIds(): string[] {
    const raw = localStorage.getItem(STORAGE_KEY_RESOLVED_DOUBTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public toggleDoubtResolved(doubtId: string): boolean {
    const current = this.getResolvedDoubtIds();
    let updated: string[];
    if (current.includes(doubtId)) {
      updated = current.filter(id => id !== doubtId);
    } else {
      updated = [...current, doubtId];
    }
    localStorage.setItem(STORAGE_KEY_RESOLVED_DOUBTS, JSON.stringify(updated));
    return updated.includes(doubtId);
  }
}

export const supabaseService = new SupabaseService();
