# ⚡ DSATrack Pro — Algorithmic Practice & Student Progress Tracker

A full-stack DSA learning and progress tracking platform built with **React**, **TypeScript**, and **Supabase**. Designed specifically for DSA instructors and their students.

---

## 🌟 Key Features

### 👨‍🎓 For Students
- **Full Curriculum Pre-loaded (180+ curated questions):**
  - Stacks & Queues (Implementation, Next Greater Element, Infix/Prefix/Postfix, Monotonic Stacks, Simulation sets)
  - Binary Trees (Traversals, Properties, Views, LCA, Multi-level sets)
  - Binary Search Trees - BST (Insertion, Deletion, Validation, Pred/Succ, Median sets)
  - Heaps & Priority Queues (Max Heap, Convert, Kth Largest, Merge K Sorted, Stream Median sets)
  - Hashing, Sliding Window & Two Pointers (Prefix Sums, Subarrays with Sum K, Two/Three/Four Sum)
  - Linked Lists (Singly, Doubly, Circular, Cycle Detection, Flattening, LRU Cache)
- **Status Dropdown for Each Question:**
  - ✅ **Completed** (triggers celebration confetti milestone)
  - ⏳ **Not Completed**
  - ❓ **Have Doubt in this Concept** (opens an inline note drawer so students can explain their doubt)
- **Live Search & Multi-Filters:**
  - Filter by Module, Status, Difficulty (Easy, Medium, Hard), or Lecture Video tag.
- **Auto-Sync:**
  - Changes save instantly to Supabase and cache locally.

### 👨‍🏫 For Instructors / Teachers
- **Command Center & Batch KPIs:**
  - Batch Average Completion Rate across all curriculum modules.
  - Total Enrolled Students.
  - Active Unresolved Doubts count.
- **Doubt Resolution Center:**
  - View all questions where students flagged "Have Doubt in this Concept".
  - See student name, email, module, question, and the student's exact doubt note.
  - "Mark as Discussed / Resolved in Class" toggle.
- **Student Leaderboard & Individual Progress Sheets:**
  - Rank-ordered list of all students with solved counts and progress bars.
  - **Drilldown Modal:** Click "View Sheet" on any student to inspect their exact progress across every single question.
- **Student Credential Generator (No Sign-Up Page needed):**
  - Teacher can provision student login credentials directly from the instructor dashboard.
- **Export to CSV:**
  - 1-click download of batch progress reports.

---

## 🚀 Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Instant Pre-configured Logins
To test right away without setting up passwords:
- **Instructor / Teacher View:** Click **"Prof. Swamy (DSA Lead / Instructor)"** or log in with `instructor@dsatracker.com`
- **Student View:** Click **"Rahul Sharma (Student)"** or **"Priya Patel (Student)"**

---

## 🗄️ Supabase Backend Setup

The application works seamlessly in **Offline / Local Demo Mode** by default. To connect your live Supabase database:

1. Open your Supabase project dashboard at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** and paste the contents of `supabase_schema.sql`. Run the query.
3. In the application, click the **"Configure DB"** button in the header or login screen.
4. Paste your **Supabase URL** and **Anon Public Key**.
5. Click **Connect Supabase**. All student updates will now sync directly with your PostgreSQL database!
