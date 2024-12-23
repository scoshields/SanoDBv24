/*
  # Add Client Relationships Support

  1. New Tables
    - `client_relationships`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients)
      - `related_client_id` (uuid, references clients)
      - `relationship_type` (text, e.g., 'mother', 'daughter')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `client_relationships` table
    - Add policies for CRUD operations
*/

-- Create relationship types enum
CREATE TYPE relationship_type AS ENUM (
  'parent',
  'child',
  'spouse',
  'sibling'
);

-- Create client relationships table
CREATE TABLE IF NOT EXISTS client_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  related_client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  relationship_type relationship_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Prevent duplicate relationships
  UNIQUE(client_id, related_client_id),
  -- Prevent self-relationships
  CONSTRAINT no_self_relationships CHECK (client_id != related_client_id)
);

-- Enable RLS
ALTER TABLE client_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read relationships for their clients"
  ON client_relationships
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE (clients.id = client_relationships.client_id
        OR clients.id = client_relationships.related_client_id)
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert relationships for their clients"
  ON client_relationships
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_relationships.client_id
      AND clients.user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_relationships.related_client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update relationships for their clients"
  ON client_relationships
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE (clients.id = client_relationships.client_id
        OR clients.id = client_relationships.related_client_id)
      AND clients.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients
      WHERE (clients.id = client_relationships.client_id
        OR clients.id = client_relationships.related_client_id)
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete relationships for their clients"
  ON client_relationships
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE (clients.id = client_relationships.client_id
        OR clients.id = client_relationships.related_client_id)
      AND clients.user_id = auth.uid()
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_client_relationships_updated_at
  BEFORE UPDATE ON client_relationships
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();