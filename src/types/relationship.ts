export type RelationshipType = 'parent' | 'child' | 'spouse' | 'sibling';

export interface ClientRelationship {
  id: string;
  client_id: string;
  related_client_id: string;
  relationship_type: RelationshipType;
  created_at: string;
  updated_at: string;
}

export interface RelatedClient {
  id: string;
  first_name: string;
  last_name: string;
  relationship_type: RelationshipType;
}