import { createClient } from '@supabase/supabase-js'

export interface DbMemory {
  id: string
  title: string
  storage_path: string
  user_id: string
  uploader_name: string
  created_at: string
}

export interface DbLetter {
  id: string
  letter_key: string // 'letter_navy' | 'letter_ifa'
  title: string
  subtitle?: string
  content: string
  author_role: 'navy' | 'ifa'
  author_name: string
  recipient_name: string
  updated_by?: string
  updated_at: string
}

export interface CoupleMember {
  user_id: string
  role: 'navy' | 'ifa'
  display_name: 'Navy' | 'Ifa'
  created_at: string
}

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string || '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string || '').trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://')
)

// Inisialisasi client Supabase dengan URL & Anon Key yang aman
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key', {
      auth: {
        persistSession: false,
      },
    })
