import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface VerifyOTPRequest {
  email: string;
  code: string;
  type: 'signup' | 'login' | 'reset';
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, code, type }: VerifyOTPRequest = await req.json();

    if (!email || !code || !type) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email, code, and type are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: otpRecords, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('type', type)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError || !otpRecords || otpRecords.length === 0) {
      const { error: incrementError } = await supabase
        .from('otp_codes')
        .update({ attempts: supabase.raw('attempts + 1') })
        .eq('email', email)
        .eq('code', code);

      return new Response(
        JSON.stringify({
          success: false,
          reason: 'invalid',
          message: 'Invalid verification code'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const otpRecord = otpRecords[0];

    if (new Date() > new Date(otpRecord.expires_at)) {
      return new Response(
        JSON.stringify({
          success: false,
          reason: 'expired',
          message: 'Verification code has expired'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (otpRecord.attempts >= 5) {
      return new Response(
        JSON.stringify({
          success: false,
          reason: 'too_many_attempts',
          message: 'Too many failed attempts. Please request a new code.'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({ is_used: true })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('Update OTP error:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to verify code' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Code verified successfully',
        email: otpRecord.email
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});