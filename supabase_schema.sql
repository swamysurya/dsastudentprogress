-- ==============================================================================
-- DSA TRACKER - COMPLETE SUPABASE DATABASE SCHEMA & POLICIES
-- Run this in your Supabase Project -> SQL Editor
-- ==============================================================================

-- 1. Create Profiles Table (Stores user roles: 'student' or 'teacher')
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  batch TEXT DEFAULT 'Batch 2026',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL
);

-- 3. Create Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  module_id TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
  module_title TEXT NOT NULL,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  lecture_video BOOLEAN DEFAULT false,
  url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- 4. Create Student Progress Table
CREATE TABLE IF NOT EXISTS public.student_progress (
  id BIGSERIAL PRIMARY KEY,
  student_id TEXT NOT NULL,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_completed' CHECK (status IN ('not_completed', 'completed', 'doubt')),
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, question_id)
);

-- 5. Row Level Security (RLS) Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are readable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Modules & Questions Policies (Readable by everyone)
CREATE POLICY "Modules readable by authenticated users"
  ON public.modules FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Questions readable by authenticated users"
  ON public.questions FOR SELECT TO authenticated
  USING (true);

-- Student Progress Policies
CREATE POLICY "Students can view and update their own progress"
  ON public.student_progress FOR ALL TO authenticated
  USING (student_id = auth.uid()::text OR EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
  ));

CREATE POLICY "Teachers can view all student progress"
  ON public.student_progress FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
  ));

-- 6. Insert Default Modules
INSERT INTO public.modules (id, title, description, order_index) VALUES
  ('stack-queue', 'Stacks & Queues', 'Implementations, Next Greater Element, Infix/Postfix notations, Monotonic Stacks & Simulations', 1),
  ('binary-trees', 'Binary Trees', 'Traversals, Properties, Diameter, Views, LCA, Construction & Multi-level Practice Sets', 2),
  ('bst', 'Binary Search Tree (BST)', 'Search, Insertion, Deletion, Validation, Predecessor/Successor & Median Queries', 3),
  ('heaps', 'Heaps & Priority Queue', 'Heapify, Convert Max to Min, Top K Frequent, Merge K Sorted & Stream Medians', 4),
  ('two-pointers-window', 'Hashing, Sliding Window & Two Pointers', 'Prefix Sums, Subarrays with Sum K, Two/Three/Four Sum, Dynamic Windows & Multi-stream Queries', 5),
  ('linked-list', 'Linked List', 'Singly, Doubly, Circular, Cycle Detection, Add Numbers, Flattening, Sorting & LRU Cache', 6)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

-- 7. Trigger to automatically create a profile when a new user signs up or is created via Admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
