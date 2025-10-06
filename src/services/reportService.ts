import { supabase } from '../lib/supabase';
import { Report, ReportWithDetails, ReportStatus } from '../types/database';

export async function createReport(report: Partial<Report>): Promise<{ data: Report | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([report])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function getReports(filters?: {
  status?: ReportStatus;
  limit?: number;
  offset?: number;
}): Promise<{ data: ReportWithDetails[]; error: Error | null; count: number }> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized'), count: 0 };

  try {
    let query = supabase
      .from('reports')
      .select(`
        *,
        reporter:profiles!reports_reporter_id_fkey(*),
        reported_user:profiles!reports_reported_user_id_fkey(*),
        listing:listings(*),
        comment:comments(*)
      `, { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data || [], error: null, count: count || 0 };
  } catch (error) {
    return { data: [], error: error as Error, count: 0 };
  }
}

export async function getUserReports(userId: string): Promise<{ data: Report[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('reporter_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  resolution?: string,
  resolvedBy?: string
): Promise<{ data: Report | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const updates: Partial<Report> = {
      status,
      resolution,
      resolved_by: resolvedBy,
      resolved_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}