/*
  # Add client status tracking

  1. Changes
    - Add status field to clients table with default 'active'
    - Add inactive_date timestamp field
    - Add trigger to automatically set inactive_date when status changes to 'inactive'
*/

-- Add status field with default value
ALTER TABLE clients 
ADD COLUMN status text NOT NULL DEFAULT 'active' 
CHECK (status IN ('active', 'inactive'));

-- Add inactive_date field
ALTER TABLE clients 
ADD COLUMN inactive_date timestamptz;

-- Create function to handle status changes
CREATE OR REPLACE FUNCTION handle_client_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'inactive' AND OLD.status = 'active' THEN
    NEW.inactive_date = now();
  ELSIF NEW.status = 'active' THEN
    NEW.inactive_date = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status changes
CREATE TRIGGER update_client_inactive_date
  BEFORE UPDATE ON clients
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION handle_client_status_change();