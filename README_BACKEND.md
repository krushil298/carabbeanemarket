# Caribbean eMarket Backend

This backend provides email verification functionality for the Caribbean eMarket application.

## Features

- **Email Verification**: Send and verify email codes via Supabase Edge Functions
- **Supabase Integration**: Uses Supabase for authentication and database operations
- **Optional Email Delivery**: Supports Resend for email delivery (optional)

## Setup

1. **Environment Variables**: Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

2. **Supabase Configuration**: 
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for frontend
   - Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for backend functions

3. **Email Delivery (Optional)**:
   - Set `RESEND_API_KEY` to enable email delivery
   - Set `RESEND_FROM` for the sender email address

## Database Schema

The backend expects a `verification_codes` table with the following structure:

```sql
CREATE TABLE verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'phone')),
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Edge Functions

### send-verification-email
- **Endpoint**: `/functions/v1/send-verification-email`
- **Method**: POST
- **Body**: `{ email: string, userId: string }`
- **Response**: `{ success: boolean, delivered: boolean, devCode?: string }`

### verify-email-code
- **Endpoint**: `/functions/v1/verify-email-code`
- **Method**: POST
- **Body**: `{ userId: string, code: string }`
- **Response**: `{ success: boolean, reason?: string }`

## Development

Use the provided Makefile for common tasks:

```bash
make dev    # Start development server
make build  # Build for production
make fmt    # Format code
make lint   # Lint code
```

## Security

- All sensitive configuration is handled via environment variables
- CORS headers are properly configured for cross-origin requests
- Verification codes expire after 10 minutes
- Codes are marked as used after successful verification