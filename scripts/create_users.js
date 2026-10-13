/**
 * Bulk User Creation Script for Supabase Auth
 * 
 * Usage:
 *   node scripts/create_users.js
 * 
 * Prerequisites:
 *   Set your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (from Supabase Settings -> API -> service_role secret key)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY';

// Add all your students here:
const STUDENTS = [
  // { email: 'student1@example.com', password: 'password123', name: 'Student Name' },
];

const TEACHER = {
  email: 'instructor@dsatracker.com',
  password: 'teacherPassword123',
  name: 'Prof. Swamy (DSA Lead)',
  role: 'teacher'
};

async function createAccounts() {
  if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // 1. Create Teacher Account
  console.log(`Creating teacher account: ${TEACHER.email}...`);
  const { data: teacherUser, error: teacherErr } = await supabase.auth.admin.createUser({
    email: TEACHER.email,
    password: TEACHER.password,
    email_confirm: true,
    user_metadata: { full_name: TEACHER.name, role: 'teacher' }
  });

  if (teacherErr) {
    console.warn(`Teacher create note: ${teacherErr.message}`);
  } else {
    console.log(`Teacher created with ID: ${teacherUser.user.id}`);
    await supabase.from('profiles').upsert({
      id: teacherUser.user.id,
      email: TEACHER.email,
      full_name: TEACHER.name,
      role: 'teacher',
      batch: 'Faculty Lead'
    });
  }

  // 2. Create Student Accounts
  for (const s of STUDENTS) {
    console.log(`Creating student: ${s.email}...`);
    const { data, error } = await supabase.auth.admin.createUser({
      email: s.email,
      password: s.password || 'dsa2026',
      email_confirm: true,
      user_metadata: { full_name: s.name || s.email.split('@')[0], role: 'student' }
    });

    if (error) {
      console.warn(`Failed for ${s.email}: ${error.message}`);
    } else {
      console.log(`Created ${s.email} (ID: ${data.user.id})`);
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: s.email,
        full_name: s.name || s.email.split('@')[0],
        role: 'student',
        batch: 'Batch 2026'
      });
    }
  }

  console.log('Finished provisioning all accounts!');
}

createAccounts();
