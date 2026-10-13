export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  batch?: string;
  avatar?: string;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProgressStatus = 'not_completed' | 'completed' | 'doubt';

export interface Question {
  id: string;
  moduleId: string;
  moduleTitle: string;
  topic: string;
  title: string;
  difficulty: Difficulty;
  lectureVideo: boolean;
  url?: string;
  isDoneDefault?: boolean;
}

export interface ModuleInfo {
  id: string;
  title: string;
  description: string;
  order: number;
  iconName: string;
}

export interface QuestionProgress {
  questionId: string;
  status: ProgressStatus;
  notes?: string;
  updatedAt: string;
}

export interface StudentProgressRecord {
  studentId: string;
  studentName: string;
  studentEmail: string;
  progress: Record<string, QuestionProgress>; // questionId -> progress
  lastActive: string;
}

export interface StudentStats {
  studentId: string;
  studentName: string;
  studentEmail: string;
  batch?: string;
  completed: number;
  doubt: number;
  notCompleted: number;
  total: number;
  percentage: number;
  lastActive: string;
}

export interface DoubtItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  questionId: string;
  questionTitle: string;
  moduleTitle: string;
  topic: string;
  difficulty: Difficulty;
  notes?: string;
  updatedAt: string;
  resolved?: boolean;
}
