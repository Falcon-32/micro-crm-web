export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: 'New' | 'In Talks' | 'Closed';
  notes: string | null;
  created_at: string;
  updated_at: string;
}