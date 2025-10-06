import { supabase } from '../lib/supabase';

export async function uploadImage(file: File, userId: string): Promise<{ url: string | null; error: Error | null }> {
  if (!supabase) return { url: null, error: new Error('Supabase not initialized') };

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('listing-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('listing-images')
      .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: null, error: error as Error };
  }
}

export async function uploadVideo(file: File, userId: string): Promise<{ url: string | null; error: Error | null }> {
  if (!supabase) return { url: null, error: new Error('Supabase not initialized') };

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('listing-videos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('listing-videos')
      .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: null, error: error as Error };
  }
}

export async function deleteImage(url: string, userId: string): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not initialized') };

  try {
    const path = url.split('/listing-images/').pop();
    if (!path || !path.startsWith(userId)) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase.storage
      .from('listing-images')
      .remove([path]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function deleteVideo(url: string, userId: string): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not initialized') };

  try {
    const path = url.split('/listing-videos/').pop();
    if (!path || !path.startsWith(userId)) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase.storage
      .from('listing-videos')
      .remove([path]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function uploadMultipleImages(
  files: File[],
  userId: string,
  onProgress?: (progress: number) => void
): Promise<{ urls: string[]; errors: Error[] }> {
  const urls: string[] = [];
  const errors: Error[] = [];

  for (let i = 0; i < files.length; i++) {
    const { url, error } = await uploadImage(files[i], userId);

    if (url) {
      urls.push(url);
    }
    if (error) {
      errors.push(error);
    }

    if (onProgress) {
      onProgress(((i + 1) / files.length) * 100);
    }
  }

  return { urls, errors };
}

export async function uploadMultipleVideos(
  files: File[],
  userId: string,
  onProgress?: (progress: number) => void
): Promise<{ urls: string[]; errors: Error[] }> {
  const urls: string[] = [];
  const errors: Error[] = [];

  for (let i = 0; i < files.length; i++) {
    const { url, error } = await uploadVideo(files[i], userId);

    if (url) {
      urls.push(url);
    }
    if (error) {
      errors.push(error);
    }

    if (onProgress) {
      onProgress(((i + 1) / files.length) * 100);
    }
  }

  return { urls, errors };
}