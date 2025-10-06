import { supabase } from '../lib/supabase';
import { Profile } from '../types/database';

export async function getProfile(userId: string): Promise<{ data: Profile | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function createProfile(profile: Partial<Profile>): Promise<{ data: Profile | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ data: Profile | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function searchProfiles(query: string, filters?: {
  country?: string;
  is_verified?: boolean;
}): Promise<{ data: Profile[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };

  try {
    let queryBuilder = supabase
      .from('profiles')
      .select('*');

    if (query) {
      queryBuilder = queryBuilder.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
    }

    if (filters?.country) {
      queryBuilder = queryBuilder.eq('country', filters.country);
    }

    if (filters?.is_verified !== undefined) {
      queryBuilder = queryBuilder.eq('is_verified', filters.is_verified);
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}