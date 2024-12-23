/*
  # Add Profile Fields

  1. New Fields
    - Profile Picture URL
    - Years of Experience
    - Certifications
    - Licensing State
    - Contact Information
    - Languages Spoken
    - Working Hours
    - Additional Details

  2. Changes
    - Add new columns to profiles table
    - Add validation for state codes
*/

-- Create enum for US states
CREATE TYPE us_state AS ENUM (
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC', 'PR', 'VI', 'GU', 'MP', 'AS'
);

-- Add new columns to profiles table
ALTER TABLE profiles
  ADD COLUMN avatar_url text,
  ADD COLUMN years_experience integer CHECK (years_experience >= 0),
  ADD COLUMN certifications text[],
  ADD COLUMN licensing_state us_state,
  ADD COLUMN specialties text[],
  ADD COLUMN phone text,
  ADD COLUMN clinic_name text,
  ADD COLUMN clinic_address text,
  ADD COLUMN clinic_phone text,
  ADD COLUMN bio text,
  ADD COLUMN languages_spoken text[] DEFAULT ARRAY['English'],
  ADD COLUMN working_hours jsonb;