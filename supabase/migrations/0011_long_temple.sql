/*
  # Add email field to profiles table

  This migration adds an email field to store the user's contact email.

  1. New Fields
    - email: Text field for storing contact email
*/

-- Add email field to profiles table
ALTER TABLE profiles
  ADD COLUMN email text;