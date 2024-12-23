/*
  # Add Bidirectional Client Relationships

  1. Changes
    - Add trigger to automatically create reciprocal relationships
    - Add function to determine reciprocal relationship type
    - Add function to handle relationship deletions
    - Update existing relationships to include reciprocals

  2. Security
    - Maintains existing RLS policies
    - Ensures data consistency
*/

-- Function to get the reciprocal relationship type
CREATE OR REPLACE FUNCTION get_reciprocal_relationship_type(rel_type relationship_type)
RETURNS relationship_type AS $$
BEGIN
  RETURN CASE rel_type
    WHEN 'parent' THEN 'child'
    WHEN 'child' THEN 'parent'
    WHEN 'spouse' THEN 'spouse'
    WHEN 'sibling' THEN 'sibling'
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to handle relationship creation
CREATE OR REPLACE FUNCTION handle_relationship_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if reciprocal relationship already exists
  IF NOT EXISTS (
    SELECT 1 FROM client_relationships
    WHERE client_id = NEW.related_client_id
    AND related_client_id = NEW.client_id
  ) THEN
    -- Create reciprocal relationship
    INSERT INTO client_relationships (
      client_id,
      related_client_id,
      relationship_type
    ) VALUES (
      NEW.related_client_id,
      NEW.client_id,
      get_reciprocal_relationship_type(NEW.relationship_type)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle relationship deletion
CREATE OR REPLACE FUNCTION handle_relationship_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete reciprocal relationship if it exists
  DELETE FROM client_relationships
  WHERE client_id = OLD.related_client_id
  AND related_client_id = OLD.client_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for relationship creation
CREATE TRIGGER create_reciprocal_relationship
  AFTER INSERT ON client_relationships
  FOR EACH ROW
  EXECUTE FUNCTION handle_relationship_creation();

-- Create trigger for relationship deletion
CREATE TRIGGER delete_reciprocal_relationship
  BEFORE DELETE ON client_relationships
  FOR EACH ROW
  EXECUTE FUNCTION handle_relationship_deletion();

-- Update existing relationships to include reciprocals
DO $$ 
BEGIN
  INSERT INTO client_relationships (
    client_id,
    related_client_id,
    relationship_type
  )
  SELECT 
    r.related_client_id,
    r.client_id,
    get_reciprocal_relationship_type(r.relationship_type)
  FROM client_relationships r
  WHERE NOT EXISTS (
    SELECT 1 FROM client_relationships r2
    WHERE r2.client_id = r.related_client_id
    AND r2.related_client_id = r.client_id
  );
END $$;