export interface UserSettings {
  id: string;
  user_id: string;
  note_format: string;
  theme: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
}

export type ThemeType = 'light' | 'dark' | 'system';