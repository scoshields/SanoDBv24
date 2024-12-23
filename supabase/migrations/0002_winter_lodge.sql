/*
  # Add insert policy for profiles table

  1. Changes
    - Add policy for users to insert their own profile

  Note: Other policies already exist from previous migration
*/

-- Policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);