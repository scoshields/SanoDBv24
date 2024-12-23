export interface Client {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  status: 'active' | 'inactive';
  inactive_date?: string;
  date_of_birth?: string;
  therapy_start_date?: string;
  email?: string;
  phone?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  created_at: string;
  updated_at: string;
}