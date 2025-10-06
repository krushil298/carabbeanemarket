import { supabase } from '../lib/supabase';
import { Comment, CommentWithProfile } from '../types/database';

export async function getListingComments(listingId: string): Promise<{ data: CommentWithProfile[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(*)')
      .eq('listing_id', listingId)
      .is('parent_id', null)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const commentsWithReplies = await Promise.all(
      (data || []).map(async (comment) => {
        const replies = await getCommentReplies(comment.id);
        return {
          ...comment,
          replies: replies.data
        };
      })
    );

    return { data: commentsWithReplies, error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}

export async function getCommentReplies(parentId: string): Promise<{ data: CommentWithProfile[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(*)')
      .eq('parent_id', parentId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}

export async function createComment(comment: Partial<Comment>): Promise<{ data: Comment | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateComment(
  id: string,
  content: string
): Promise<{ data: Comment | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function deleteComment(id: string): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not initialized') };

  try {
    const { error } = await supabase
      .from('comments')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}