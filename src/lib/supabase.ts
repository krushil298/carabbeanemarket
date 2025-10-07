import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export const STORAGE_BUCKETS = {
  LISTING_IMAGES: 'listing-images',
  LISTING_VIDEOS: 'listing-videos',
  EVENT_IMAGES: 'event-images',
  AVATARS: 'avatars'
} as const

export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> {
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
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}