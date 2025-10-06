import { supabase } from '../lib/supabase';
import { Rating, RatingWithProfiles } from '../types/database';

export async function getListingRatings(listingId: string): Promise<{ data: RatingWithProfiles[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        reviewer:profiles!ratings_reviewer_id_fkey(*),
        seller:profiles!ratings_seller_id_fkey(*)
      `)
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}

export async function getSellerRatings(sellerId: string): Promise<{ data: RatingWithProfiles[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        reviewer:profiles!ratings_reviewer_id_fkey(*),
        seller:profiles!ratings_seller_id_fkey(*)
      `)
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}

export async function getUserRatingForListing(
  listingId: string,
  reviewerId: string
): Promise<{ data: Rating | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('listing_id', listingId)
      .eq('reviewer_id', reviewerId)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function createRating(rating: Partial<Rating>): Promise<{ data: Rating | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('ratings')
      .insert([rating])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateRating(
  id: string,
  updates: { rating?: number; review?: string }
): Promise<{ data: Rating | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('ratings')
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

export async function getRatingDistribution(sellerId: string): Promise<{
  distribution: Record<number, number>;
  average: number;
  total: number;
  error: Error | null;
}> {
  if (!supabase) {
    return { distribution: {}, average: 0, total: 0, error: new Error('Supabase not initialized') };
  }

  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('seller_id', sellerId);

    if (error) throw error;

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    let sum = 0;

    (data || []).forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      sum += r.rating;
      total++;
    });

    const average = total > 0 ? sum / total : 0;

    return { distribution, average, total, error: null };
  } catch (error) {
    return { distribution: {}, average: 0, total: 0, error: error as Error };
  }
}