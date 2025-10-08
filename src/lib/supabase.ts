import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co')
const isValidKey = supabaseAnonKey && supabaseAnonKey.startsWith('eyJ')

if (!isValidUrl || !isValidKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  console.log('Please check your .env file and ensure it contains:')
  console.log('VITE_SUPABASE_URL=your-project-url')
  console.log('VITE_SUPABASE_ANON_KEY=your-anon-key')
}

export const supabase: SupabaseClient | null = isValidUrl && isValidKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null

export const STORAGE_BUCKETS = {
  LISTING_IMAGES: 'listing-images',
  LISTING_VIDEOS: 'listing-videos',
  EVENT_IMAGES: 'event-images',
  AVATARS: 'avatars'
} as const

export function getPublicUrl(bucket: string, path: string): string {
  if (!supabase) return ''
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> {
  if (!supabase) {
    return { url: null, error: new Error('Supabase client not initialized') }
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const url = getPublicUrl(bucket, data.path)
    return { url, error: null }
  } catch (error) {
    return { url: null, error: error as Error }
  }
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ error: Error | null }> {
  if (!supabase) {
    return { error: new Error('Supabase client not initialized') }
  }

  try {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}