-- Run this in the Supabase Dashboard SQL Editor
-- Makes announcements visible to ALL authenticated users (system broadcasts)

-- Remove existing restrictive SELECT policy
DROP POLICY IF EXISTS "Owner access" ON announcements;
DROP POLICY IF EXISTS "owner_access" ON announcements;
DROP POLICY IF EXISTS "Users can view own announcements" ON announcements;

-- Allow all authenticated users to READ all announcements
CREATE POLICY "All users can read announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to INSERT (the UI restricts this to admins)
DROP POLICY IF EXISTS "Users can create announcements" ON announcements;
CREATE POLICY "Users can create announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Only authors can update/delete their own
DROP POLICY IF EXISTS "Users can update own announcements" ON announcements;
CREATE POLICY "Users can update own announcements"
  ON announcements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own announcements" ON announcements;
CREATE POLICY "Users can delete own announcements"
  ON announcements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
