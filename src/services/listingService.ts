import { supabase } from '../lib/supabase';
import { Listing, ListingWithProfile, ListingStatus } from '../types/database';

export async function getListings(filters?: {
  status?: ListingStatus;
  category?: string;
  country?: string;
  parish?: string;
  user_id?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}): Promise<{ data: ListingWithProfile[]; error: Error | null; count: number }> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized'), count: 0 };

  try {
    let queryBuilder = supabase
      .from('listings')
      .select('*, profiles(*)', { count: 'exact' });

    if (filters?.status) {
      queryBuilder = queryBuilder.eq('status', filters.status);
    }

    if (filters?.category) {
      queryBuilder = queryBuilder.eq('category', filters.category);
    }

    if (filters?.country) {
      queryBuilder = queryBuilder.eq('country', filters.country);
    }

    if (filters?.parish) {
      queryBuilder = queryBuilder.eq('parish', filters.parish);
    }

    if (filters?.user_id) {
      queryBuilder = queryBuilder.eq('user_id', filters.user_id);
    }

    if (filters?.minPrice !== undefined) {
      queryBuilder = queryBuilder.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      queryBuilder = queryBuilder.lte('price', filters.maxPrice);
    }

    queryBuilder = queryBuilder.order('created_at', { ascending: false });

    if (filters?.limit) {
      queryBuilder = queryBuilder.limit(filters.limit);
    }

    if (filters?.offset) {
      queryBuilder = queryBuilder.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await queryBuilder;

    if (error) throw error;
    return { data: data || [], error: null, count: count || 0 };
  } catch (error) {
    return { data: [], error: error as Error, count: 0 };
  }
}

export async function getListing(id: string): Promise<{ data: ListingWithProfile | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*, profiles(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      await supabase.rpc('increment_listing_views', { listing_id: id }).catch(() => {});
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function createListing(listing: Partial<Listing>): Promise<{ data: Listing | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('listings')
      .insert([listing])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateListing(
  id: string,
  updates: Partial<Listing>
): Promise<{ data: Listing | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function deleteListing(id: string): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not initialized') };

  try {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function searchListings(query: string): Promise<{ data: ListingWithProfile[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*, profiles(*)')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}