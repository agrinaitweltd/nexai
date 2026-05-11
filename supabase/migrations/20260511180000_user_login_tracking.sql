-- Add login tracking columns to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_login_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_login_location  TEXT,
  ADD COLUMN IF NOT EXISTS last_password_changed_at TIMESTAMPTZ;

-- Allow users to update their own login tracking fields
CREATE POLICY IF NOT EXISTS "Users can update own login tracking"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
