#!/bin/bash

# Caribbean eMarket Backend Setup Script
# This script sets up the Supabase backend for email verification

set -e

echo "🏝️  Caribbean eMarket Backend Setup"
echo "=================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    echo "   or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Login to Supabase
echo "🔐 Logging into Supabase..."
supabase login

# Get project reference
read -p "📝 Enter your Supabase project reference (e.g., abcdefghijklmno): " PROJECT_REF
if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project reference is required"
    exit 1
fi

# Link project
echo "🔗 Linking to project..."
supabase link --project-ref "$PROJECT_REF"

# Get configuration
read -p "🌐 Enter your SUPABASE_URL (https://$PROJECT_REF.supabase.co): " SUPABASE_URL
read -p "🔑 Enter your Service Role key (starts with eyJ...): " SERVICE_ROLE_KEY

# Set secrets
echo "🔒 Setting up secrets..."
supabase secrets set SUPABASE_URL="$SUPABASE_URL"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY"

# Optional Resend configuration
read -p "📧 Enter Resend API key (optional, press Enter to skip): " RESEND_API_KEY
if [ ! -z "$RESEND_API_KEY" ]; then
    supabase secrets set RESEND_API_KEY="$RESEND_API_KEY"
    read -p "📨 Enter sender email (e.g., Caribbean eMarket <no-reply@yourdomain.com>): " RESEND_FROM
    if [ ! -z "$RESEND_FROM" ]; then
        supabase secrets set RESEND_FROM="$RESEND_FROM"
    fi
fi

# Deploy functions
echo "🚀 Deploying Edge Functions..."
supabase functions deploy send-verification-email
supabase functions deploy verify-email-code

# Database setup instructions
echo ""
echo "📊 Database Setup Required:"
echo "1. Open your Supabase Dashboard → SQL Editor"
echo "2. Copy and paste the following SQL:"
echo ""
echo "CREATE TABLE IF NOT EXISTS public.verification_codes ("
echo "  id bigserial PRIMARY KEY,"
echo "  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,"
echo "  code text NOT NULL,"
echo "  type text NOT NULL CHECK (type IN ('email', 'phone')),"
echo "  expires_at timestamptz NOT NULL,"
echo "  is_used boolean NOT NULL DEFAULT false,"
echo "  created_at timestamptz NOT NULL DEFAULT now()"
echo ");"
echo ""
echo "ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;"
echo ""
echo "CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id ON public.verification_codes(user_id);"
echo "CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON public.verification_codes(code);"
echo "CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON public.verification_codes(expires_at);"
echo ""
echo "3. Click 'Run' to execute the SQL"
echo ""

read -p "Press Enter after you've run the SQL in Supabase Dashboard..."

# Test the setup
echo "🧪 Testing the setup..."
read -p "📧 Enter a test email address: " TEST_EMAIL
read -p "🔑 Enter your Anon key (from Settings → API): " ANON_KEY

# Create test user if needed
echo "👤 Setting up test user..."
USER_RESPONSE=$(curl -s -X GET \
  "$SUPABASE_URL/auth/v1/admin/users?email=$(echo $TEST_EMAIL | sed 's/@/%40/g')" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "apikey: $SERVICE_ROLE_KEY")

USER_ID=$(echo $USER_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$USER_ID" ]; then
    echo "Creating test user..."
    CREATE_RESPONSE=$(curl -s -X POST \
      "$SUPABASE_URL/auth/v1/admin/users" \
      -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
      -H "apikey: $SERVICE_ROLE_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"TempPass12!@\",\"email_confirm\":false}")
    
    USER_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

if [ -z "$USER_ID" ]; then
    echo "❌ Could not create or find test user"
    exit 1
fi

echo "✅ User ID: $USER_ID"

# Test send verification email
echo "📤 Testing send verification email..."
SEND_RESPONSE=$(curl -s -X POST \
  "$SUPABASE_URL/functions/v1/send-verification-email" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"userId\":\"$USER_ID\"}")

echo "Send response: $SEND_RESPONSE"

# Extract code from response
DEV_CODE=$(echo $SEND_RESPONSE | grep -o '"devCode":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$DEV_CODE" ]; then
    echo "🔢 Development code: $DEV_CODE"
    VERIFICATION_CODE="$DEV_CODE"
else
    read -p "📧 Enter the verification code from your email: " VERIFICATION_CODE
fi

# Test verify email code
echo "✅ Testing verify email code..."
VERIFY_RESPONSE=$(curl -s -X POST \
  "$SUPABASE_URL/functions/v1/verify-email-code" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_ID\",\"code\":\"$VERIFICATION_CODE\"}")

echo "Verify response: $VERIFY_RESPONSE"

# Check if verification was successful
if echo "$VERIFY_RESPONSE" | grep -q '"success":true'; then
    echo "🎉 ALL SET: Email verification system is working! ✅"
else
    echo "❌ Verification failed. Check the function logs in Supabase."
fi

echo ""
echo "🏁 Setup complete! Your Caribbean eMarket backend is ready."
echo "📖 See README_BACKEND.md for more information."