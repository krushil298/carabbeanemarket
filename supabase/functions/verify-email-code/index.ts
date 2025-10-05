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
    const { userId, code } = await req.json()
    if (!userId || !code) return json({ error: 'Missing userId or code' }, { status: 400 })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    if (!supabaseUrl || !serviceKey) return json({ error: 'Server not configured' }, { status: 500 })

    const supabaseAdmin = createClient(supabaseUrl, serviceKey)
    const { data: rows, error } = await supabaseAdmin
      .from('verification_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .eq('type', 'email')
      .eq('is_used', false)
      .limit(1)

    if (error) return json({ error: 'Lookup failed' }, { status: 500 })

    const record = rows?.[0]
    if (!record) return json({ success: false, reason: 'invalid' })

    if (new Date() > new Date(record.expires_at)) return json({ success: false, reason: 'expired' })

    const { error: updateErr } = await supabaseAdmin
      .from('verification_codes')
      .update({ is_used: true })
      .eq('id', record.id)

    if (updateErr) return json({ error: 'Could not update code' }, { status: 500 })

    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { email_verified: true },
    })

    return json({ success: true })
  } catch (e) {
    console.error('Function error', e)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
})