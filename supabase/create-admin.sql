-- Buat admin user langsung via SQL (skip email confirmation)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  raw_app_meta_data,
  raw_user_meta_data
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@seenight.studio',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb
);

-- Insert identity (required by Supabase Auth)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  id,
  format('{"sub":"%s","email":"admin@seenight.studio","email_verified":true,"phone_verified":false}', id)::jsonb,
  'email',
  now(),
  now(),
  now()
FROM auth.users
WHERE email = 'admin@seenight.studio';
