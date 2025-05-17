import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TeaStallDB {
  id: number;
  stall_name: string;
  latitude: number;
  longitude: number;
  rating: number;
  specialties_text: string;
  created_at?: string;
}

export async function addTeaStall(stall: Omit<TeaStallDB, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('tea_stalls')
    .insert([stall])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTeaStalls() {
  const { data, error } = await supabase
    .from('tea_stalls')
    .select('*');

  if (error) throw error;
  return data;
} 