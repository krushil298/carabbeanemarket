import { createClient } from '@supabase/supabase-js'

/**
  Supabase client (browser-side)
  Reads URL and anon key from Vite env. Do NOT hardcode secrets.
*/
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Validate that we have proper Supabase credentials (not placeholders)
const isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co')
const isValidKey = supabaseAnonKey && supabaseAnonKey.startsWith('eyJ')

if (!isValidUrl || !isValidKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  console.log('Please check your .env file and ensure it contains:')
  console.log('VITE_SUPABASE_URL=your-project-url')
  console.log('VITE_SUPABASE_ANON_KEY=your-anon-key')
}

// Only create client if we have valid credentials (not placeholders)
export const supabase = isValidUrl && isValidKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null