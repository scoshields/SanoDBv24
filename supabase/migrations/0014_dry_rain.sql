/*
  # Update working hours validation

  1. Changes
    - Drop existing constraint if it exists
    - Update validation function for working hours
    - Re-add constraint with updated validation

  2. Validation Rules
    - Working hours must be a JSON object
    - Each day must have start and end times as strings
    - Only valid days of the week are allowed
*/

-- Drop existing constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'working_hours_valid' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT working_hours_valid;
  END IF;
END $$;

-- Update validation function with improved checks
CREATE OR REPLACE FUNCTION validate_working_hours(hours jsonb)
RETURNS boolean AS $$
DECLARE
  valid_days text[] := ARRAY['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  day text;
  time_pattern text := '^\d{2}:\d{2}$';  -- HH:MM format
BEGIN
  -- Handle null case
  IF hours IS NULL THEN
    RETURN true;
  END IF;

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
        jsonb_typeof(hours->day->'end') = 'string' AND
        (hours->day->>'start') ~ time_pattern AND
        (hours->day->>'end') ~ time_pattern
      ) THEN
        RETURN false;
      END IF;
    END IF;
  END LOOP;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Add constraint with updated validation
ALTER TABLE profiles
  ADD CONSTRAINT working_hours_valid 
  CHECK (validate_working_hours(working_hours));