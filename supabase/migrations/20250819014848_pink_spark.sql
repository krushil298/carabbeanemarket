/*
  # Fix verification codes table foreign key

  1. Changes
    - Drop existing foreign key constraint that references non-existent users table
    - Add correct foreign key constraint to auth.users table

  2. Security
    - Maintain existing RLS policies
*/

-- Drop the incorrect foreign key constraint
ALTER TABLE verification_codes 
DROP CONSTRAINT IF EXISTS verification_codes_user_id_fkey;

-- Add the correct foreign key constraint to auth.users
ALTER TABLE verification_codes 
ADD CONSTRAINT verification_codes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;