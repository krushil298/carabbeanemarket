import { supabase } from '../lib/supabase';
import { Message, MessageWithProfiles } from '../types/database';

export async function getUserConversations(userId: string): Promise<{
  data: MessageWithProfiles[];
  error: Error | null;
}> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(*),
        recipient:profiles!messages_recipient_id_fkey(*),
        listing:listings(*)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const conversationMap = new Map<string, MessageWithProfiles>();

    (data || []).forEach((message: any) => {
      const otherUserId = message.sender_id === userId ? message.recipient_id : message.sender_id;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, message);
      }
    });

    return { data: Array.from(conversationMap.values()), error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}

export async function getConversationMessages(
  userId: string,
  otherUserId: string
): Promise<{ data: MessageWithProfiles[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(*),
        recipient:profiles!messages_recipient_id_fkey(*),
        listing:listings(*)
      `)
      .or(
        `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`
      )
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}

export async function sendMessage(message: Partial<Message>): Promise<{
  data: Message | null;
  error: Error | null;
}> {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function markMessageAsRead(messageId: string): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not initialized') };

  try {
    const { error } = await supabase
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function markConversationAsRead(
  userId: string,
  otherUserId: string
): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not initialized') };

  try {
    const { error } = await supabase
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('sender_id', otherUserId)
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function getUnreadMessageCount(userId: string): Promise<{
  count: number;
  error: Error | null;
}> {
  if (!supabase) return { count: 0, error: new Error('Supabase not initialized') };

  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return { count: count || 0, error: null };
  } catch (error) {
    return { count: 0, error: error as Error };
  }
}

export function subscribeToMessages(
  userId: string,
  callback: (message: Message) => void
) {
  if (!supabase) return null;

  const subscription = supabase
    .channel(`messages:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();

  return subscription;
}