/*
  # Create verification codes table

  1. New Tables
    - `verification_codes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `code` (text, the verification code)
      - `type` (text, 'email' or 'phone')
      - `expires_at` (timestamptz, when the code expires)
      - `is_used` (boolean, whether the code has been used)
      - `created_at` (timestamptz, when the code was created)

  2. Security
    - Enable RLS on `verification_codes` table
    - Add policies for secure access
*/

CREATE TABLE IF NOT EXISTS verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'phone')),
  expires_at timestamptz NOT NULL,
  is_used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own verification codes"
  ON verification_codes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can manage all verification codes (for the Edge Functions)
CREATE POLICY "Service role can manage verification codes"
  ON verification_codes
  FOR ALL
  TO service_role
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id ON verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);

-- Create function to clean up expired codes
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM verification_codes 
  WHERE expires_at < now() - interval '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired codes (runs every hour)
-- Note: This requires the pg_cron extension to be enabled
-- SELECT cron.schedule('cleanup-expired-codes', '0 * * * *', 'SELECT cleanup_expired_verification_codes();');