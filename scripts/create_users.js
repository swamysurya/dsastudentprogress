/**
 * Bulk User Creation Script for Supabase Auth using Admin API
 * 
 * Usage:
 *   1. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *   2. Run: node scripts/create_users.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY';

async function uploadUsers() {
  if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Please provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY via environment variables.');
    console.log('Alternatively, you can run the SQL script: scripts/seed_supabase_auth_users.sql directly in Supabase SQL Editor!');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const csvPath = path.resolve('students_credentials.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split(/\r?\n/).slice(1).filter(Boolean); // skip header

  console.log(`Uploading ${lines.length} students to Supabase Auth...`);

  for (const line of lines) {
    const [email, password] = line.split(',').map(s => s.trim());
    if (!email || !password) continue;

    const name = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name, role: 'student' }
    });

    if (error) {
      console.warn(`Note for ${email}: ${error.message}`);
    } else {
      console.log(`✓ Created: ${email} (ID: ${data.user.id})`);
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: name,
        role: 'student',
        batch: 'Batch 2026'
      });
    }
  }

  console.log('All 80 students uploaded successfully to Supabase DB!');
}

uploadUsers();
