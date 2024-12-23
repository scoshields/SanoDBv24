export type USState = 
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD'
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ'
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC'
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY'
  | 'DC' | 'PR' | 'VI' | 'GU' | 'MP' | 'AS';

export interface WorkingHours {
  monday?: { start: string; end: string };
  tuesday?: { start: string; end: string };
  wednesday?: { start: string; end: string };
  thursday?: { start: string; end: string };
  friday?: { start: string; end: string };
  saturday?: { start: string; end: string };
  sunday?: { start: string; end: string };
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  avatar_url: string | null;
  years_experience: number | null;
  certifications: string[] | null;
  licensing_state: USState | null;
  specialty: string | null;
  specialties: string[] | null;
  phone: string | null;
  clinic_name: string | null;
  clinic_address: string | null;
  clinic_phone: string | null;
  bio: string | null;
  languages_spoken: string[] | null;
  working_hours: WorkingHours | null;
  license_number: string | null;
  created_at: string;
  updated_at: string;
}