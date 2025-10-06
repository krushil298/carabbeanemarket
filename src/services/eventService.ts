import { supabase } from '../lib/supabase';
import { Event, EventWithProfile, EventRSVP, EventStatus, RSVPStatus } from '../types/database';

export async function getEvents(filters?: {
  status?: EventStatus;
  category?: string;
  country?: string;
  parish?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: EventWithProfile[]; error: Error | null; count: number }> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized'), count: 0 };

  try {
    let queryBuilder = supabase
      .from('events')
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

    if (filters?.startDate) {
      queryBuilder = queryBuilder.gte('start_date', filters.startDate);
    }

    if (filters?.endDate) {
      queryBuilder = queryBuilder.lte('start_date', filters.endDate);
    }

    queryBuilder = queryBuilder.order('start_date', { ascending: true });

    if (filters?.limit) {
      queryBuilder = queryBuilder.limit(filters.limit);
    }

    if (filters?.offset) {
      queryBuilder = queryBuilder.range(filters?.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await queryBuilder;

    if (error) throw error;
    return { data: data || [], error: null, count: count || 0 };
  } catch (error) {
    return { data: [], error: error as Error, count: 0 };
  }
}

export async function getEvent(id: string): Promise<{ data: EventWithProfile | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*, profiles(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function createEvent(event: Partial<Event>): Promise<{ data: Event | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateEvent(
  id: string,
  updates: Partial<Event>
): Promise<{ data: Event | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('events')
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

export async function deleteEvent(id: string): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not initialized') };

  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function getUserRSVP(eventId: string, userId: string): Promise<{ data: EventRSVP | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('event_rsvps')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function createOrUpdateRSVP(
  eventId: string,
  userId: string,
  status: RSVPStatus
): Promise<{ data: EventRSVP | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('event_rsvps')
      .upsert({
        event_id: eventId,
        user_id: userId,
        status
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function deleteRSVP(eventId: string, userId: string): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not initialized') };

  try {
    const { error } = await supabase
      .from('event_rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}