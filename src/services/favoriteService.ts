import { supabase } from '../lib/supabase';
import { Favorite, ListingWithProfile } from '../types/database';

export async function getUserFavorites(userId: string): Promise<{ data: ListingWithProfile[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('listing_id, listings(*, profiles(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const listings = (data || [])
      .map((fav: any) => fav.listings)
      .filter(Boolean);

    return { data: listings, error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}

export async function isFavorited(
  userId: string,
  listingId: string
): Promise<{ isFavorited: boolean; error: Error | null }> {
  if (!supabase) return { isFavorited: false, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .maybeSingle();

    if (error) throw error;
    return { isFavorited: !!data, error: null };
  } catch (error) {
    return { isFavorited: false, error: error as Error };
  }
}

export async function addFavorite(
  userId: string,
  listingId: string
): Promise<{ data: Favorite | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, listing_id: listingId }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function removeFavorite(
  userId: string,
  listingId: string
): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not initialized') };

  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function toggleFavorite(
  userId: string,
  listingId: string
): Promise<{ isFavorited: boolean; error: Error | null }> {
  const { isFavorited: currentlyFavorited } = await isFavorited(userId, listingId);

  if (currentlyFavorited) {
    const { error } = await removeFavorite(userId, listingId);
    return { isFavorited: false, error };
  } else {
    const { error } = await addFavorite(userId, listingId);
    return { isFavorited: true, error };
  }
}