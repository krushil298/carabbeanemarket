import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OTPRequest {
  email: string;
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
    const { email, type }: OTPRequest = await req.json();

    if (!email || !type) {
      return new Response(
        JSON.stringify({ error: 'Email and type are required' }),
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
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentCodes } = await supabase
      .from('otp_codes')
      .select('id')
      .eq('email', email)
      .gte('created_at', oneHourAgo);

    if (recentCodes && recentCodes.length >= 5) {
      return new Response(
        JSON.stringify({
          error: 'Too many attempts. Please try again in an hour.',
          code: 'RATE_LIMIT_EXCEEDED'
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase
      .from('otp_codes')
      .insert({
        email,
        code,
        type,
        expires_at: expiresAt,
        is_used: false,
        attempts: 0
      });

    if (insertError) {
      console.error('Insert OTP error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP code' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    let emailSent = false;

    if (resendApiKey) {
      try {
        const emailSubject = type === 'signup'
          ? 'Verify Your Caribbean eMarket Account'
          : type === 'reset'
          ? 'Reset Your Password'
          : 'Login to Caribbean eMarket';

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px; }
                .code-box { background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; border: 2px solid #06b6d4; }
                .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0891b2; }
                .footer { text-align: center; color: #6b7280; margin-top: 20px; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🌴 Caribbean eMarket</h1>
                </div>
                <div class="content">
                  <h2>Your Verification Code</h2>
                  <p>Enter this code to ${type === 'signup' ? 'complete your registration' : type === 'reset' ? 'reset your password' : 'login to your account'}:</p>
                  <div class="code-box">
                    <div class="code">${code}</div>
                  </div>
                  <p><strong>This code expires in 10 minutes.</strong></p>
                  <p>If you didn't request this code, please ignore this email.</p>
                </div>
                <div class="footer">
                  <p>Caribbean eMarket - Connecting the Caribbean Community</p>
                </div>
              </div>
            </body>
          </html>
        `;

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: Deno.env.get('RESEND_FROM') || 'Caribbean eMarket <noreply@caribbeanemarket.com>',
            to: email,
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        emailSent = emailResponse.ok;
        if (!emailResponse.ok) {
          console.error('Email send error:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Email exception:', emailError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailSent,
        devCode: !resendApiKey ? code : undefined,
        expiresAt
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});