import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}), ...corsHeaders },
  })

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { email, userId } = await req.json()
    if (!email || !userId) return json({ error: 'Missing email or userId' }, { status: 400 })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    if (!supabaseUrl || !serviceKey) return json({ error: 'Server not configured' }, { status: 500 })

    const supabaseAdmin = createClient(supabaseUrl, serviceKey)

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: insertError } = await supabaseAdmin
      .from('verification_codes')
      .insert({ user_id: userId, code, type: 'email', expires_at: expiresAt, is_used: false })

    if (insertError) {
      console.error('Insert code error', insertError)
      return json({ error: 'Could not store verification code' }, { status: 500 })
    }

    // Optional email delivery via Resend
    const resendKey = Deno.env.get('RESEND_API_KEY')
    const resendFrom = Deno.env.get('RESEND_FROM') || 'no-reply@example.com'
    let delivered = false

    if (resendKey) {
      const subject = 'Your verification code'
      const html = `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
          <h2>Verify your email</h2>
          <p>Your verification code is:</p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px;">${code}</div>
          <p>This code expires in 10 minutes.</p>
        </div>`

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: resendFrom, to: email, subject, html }),
      })
      delivered = res.ok
      if (!res.ok) console.error('Resend error', res.status, await res.text())
    }

    return json({ success: true, delivered, devCode: resendKey ? undefined : code })
  } catch (e) {
    console.error('Function error', e)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
})