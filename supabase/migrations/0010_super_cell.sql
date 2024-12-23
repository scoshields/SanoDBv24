-- Add searchable field to profiles table
ALTER TABLE profiles
  ADD COLUMN is_searchable boolean NOT NULL DEFAULT false;

-- Add policy for public profile search
CREATE POLICY "Anyone can view searchable profiles"
  ON profiles
  FOR SELECT
  USING (is_searchable = true);