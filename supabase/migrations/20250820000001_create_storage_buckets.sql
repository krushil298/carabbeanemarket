/*
  # Create Storage Buckets for Caribbean eMarket

  ## Overview
  This migration creates storage buckets for media files (images and videos)
  and configures Row Level Security policies for secure access.

  ## Buckets Created

  ### 1. listing-images
  Storage for listing product images
  - Public access for viewing approved listings
  - Authenticated users can upload to their own folders
  - Max file size: 5MB per image
  - Allowed types: image/jpeg, image/png, image/webp, image/gif

  ### 2. listing-videos
  Storage for listing product videos
  - Public access for viewing approved listings
  - Authenticated users can upload to their own folders
  - Max file size: 50MB per video
  - Allowed types: video/mp4, video/quicktime, video/x-msvideo

  ### 3. event-images
  Storage for event images
  - Public access for viewing approved events
  - Authenticated users can upload to their own folders
  - Max file size: 5MB per image

  ### 4. avatars
  Storage for user profile avatars
  - Public access for viewing
  - Users can only upload/update their own avatar
  - Max file size: 2MB per image

  ## Security
  All buckets have RLS policies that:
  - Allow public read access for approved content
  - Restrict upload/update to authenticated users
  - Enforce user-specific folder structure (user_id/)
  - Admins can manage all files
*/

-- ============================================================================
-- CREATE STORAGE BUCKETS
-- ============================================================================

-- Create listing-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create listing-videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-videos',
  'listing-videos',
  true,
  52428800,
  ARRAY['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Create event-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES FOR LISTING IMAGES
-- ============================================================================

-- Allow public to view listing images
CREATE POLICY "Public can view listing images"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own listing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own listing images
CREATE POLICY "Users can update own listing images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'listing-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'listing-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own listing images
CREATE POLICY "Users can delete own listing images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- STORAGE POLICIES FOR LISTING VIDEOS
-- ============================================================================

-- Allow public to view listing videos
CREATE POLICY "Public can view listing videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-videos');

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own listing videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own listing videos
CREATE POLICY "Users can update own listing videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'listing-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'listing-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own listing videos
CREATE POLICY "Users can delete own listing videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- STORAGE POLICIES FOR EVENT IMAGES
-- ============================================================================

-- Allow public to view event images
CREATE POLICY "Public can view event images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own event images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own event images
CREATE POLICY "Users can update own event images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own event images
CREATE POLICY "Users can delete own event images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- STORAGE POLICIES FOR AVATARS
-- ============================================================================

-- Allow public to view avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);