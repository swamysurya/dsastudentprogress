-- ==============================================================================
-- FIX ANALYTICS & INSTRUCTOR PERSISTENCE ACROSS ALL DEVICES AND DEPLOYMENTS
-- Run this in your Supabase Project -> SQL Editor -> Click "Run"
-- ==============================================================================

-- 1. DROP THE FOREIGN KEY THAT BLOCKS QUESTION PROGRESS INSERTS
-- (Because public.questions may not have all question IDs, this constraint causes
-- inserts into student_progress to fail with a foreign key violation)
ALTER TABLE IF EXISTS public.student_progress 
  DROP CONSTRAINT IF EXISTS student_progress_question_id_fkey;

-- 2. CREATE student_progress TABLE IF NOT EXISTS WITH TEXT COLUMNS
CREATE TABLE IF NOT EXISTS public.student_progress (
  id BIGSERIAL PRIMARY KEY,
  student_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_completed' CHECK (status IN ('not_completed', 'completed', 'doubt')),
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, question_id)
);

-- Ensure index exists for fast lookup by student_id
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON public.student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_question_id ON public.student_progress(question_id);

-- 3. FIX ROW LEVEL SECURITY (RLS) POLICIES ON student_progress
-- Allows both authenticated users AND the anon API key to read and save progress
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view and update their own progress" ON public.student_progress;
DROP POLICY IF EXISTS "Teachers can view all student progress" ON public.student_progress;
DROP POLICY IF EXISTS "Anyone can read progress" ON public.student_progress;
DROP POLICY IF EXISTS "Anyone can insert or update progress" ON public.student_progress;
DROP POLICY IF EXISTS "Allow all access to student_progress" ON public.student_progress;

CREATE POLICY "Allow all access to student_progress"
  ON public.student_progress FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 4. CREATE RESOLVED DOUBTS TABLE SO TEACHER RESOLVED FLAGS PERSIST IN SUPABASE
CREATE TABLE IF NOT EXISTS public.resolved_doubts (
  id TEXT PRIMARY KEY,
  resolved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.resolved_doubts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to resolved_doubts" ON public.resolved_doubts;
CREATE POLICY "Allow all access to resolved_doubts"
  ON public.resolved_doubts FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 5. ENSURE PROFILES TABLE ACCEPTS NEW STUDENTS & PERMITS FULL ACCESS
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  batch TEXT DEFAULT 'Batch 2026',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are readable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow all access to profiles" ON public.profiles;

CREATE POLICY "Allow all access to profiles"
  ON public.profiles FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 6. ENSURE INSTRUCTOR PROFILE EXISTS IN PROFILES TABLE
INSERT INTO public.profiles (id, email, full_name, role, batch)
VALUES (
  'user-teacher-1',
  'instructor@dsatracker.com',
  'Prof. Swamy (DSA Lead)',
  'teacher',
  'Faculty Lead'
)
ON CONFLICT (email) DO UPDATE 
SET role = 'teacher', full_name = 'Prof. Swamy (DSA Lead)';

-- 7. VERIFY EVERYTHING IS WORKING
SELECT 'student_progress count:' as metric, COUNT(*)::text as value FROM public.student_progress
UNION ALL
SELECT 'profiles count:' as metric, COUNT(*)::text as value FROM public.profiles;
