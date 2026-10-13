-- ==============================================================================
-- IMMEDIATE FIX: "Database error querying schema" (HTTP 500)
-- Run this in your Supabase Dashboard -> SQL Editor -> Click "Run"
-- ==============================================================================

-- 1. Fix NULL token columns in auth.users
-- (Supabase GoTrue auth crashes when scanning NULL values for text tokens)
UPDATE auth.users
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  email_change = COALESCE(email_change, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  reauthentication_token = COALESCE(reauthentication_token, '')
WHERE 
  confirmation_token IS NULL
  OR recovery_token IS NULL
  OR email_change_token_new IS NULL
  OR email_change IS NULL;

-- 2. Ensure each user in auth.users has a linked identity in auth.identities
-- (Required by Supabase GoTrue to identify login credentials for email provider)
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  u.id::text,
  json_build_object('sub', u.id::text, 'email', u.email)::jsonb,
  'email',
  now(),
  now(),
  now()
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM auth.identities i WHERE i.user_id = u.id AND i.provider = 'email'
);

-- Verification: Show users that are now ready to log in
SELECT id, email, role, confirmation_token FROM auth.users LIMIT 5;
