/*
  # Add Working Hours Validation

  1. Changes
    - Add validation function for working hours JSON structure
    - Add constraint to profiles table for working hours validation
*/

-- Add validation for working hours JSON structure
CREATE OR REPLACE FUNCTION validate_working_hours(hours jsonb)
RETURNS boolean AS $$
DECLARE
  valid_days text[] := ARRAY['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  day text;
BEGIN
  -- Check if hours is an object
  IF jsonb_typeof(hours) != 'object' THEN
    RETURN false;
  END IF;

  -- Check each day's structure
  FOREACH day IN ARRAY valid_days LOOP
    IF hours ? day THEN
      -- Check if day has start and end times
      IF NOT (
        jsonb_typeof(hours->day) = 'object' AND
        (hours->day) ? 'start' AND
        (hours->day) ? 'end' AND
        jsonb_typeof(hours->day->'start') = 'string' AND
        jsonb_typeof(hours->day->'end') = 'string'
      ) THEN
        RETURN false;
      END IF;
    END IF;
  END LOOP;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Add constraint for working hours validation
ALTER TABLE profiles
  ADD CONSTRAINT working_hours_valid 
  CHECK (working_hours IS NULL OR validate_working_hours(working_hours));