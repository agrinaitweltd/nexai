// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify caller is super admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: callerUser }, error: authErr } = await supabaseAdmin.auth.getUser(token);
    if (authErr || !callerUser) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: corsHeaders });

    const { data: callerProfile } = await supabaseAdmin.from('profiles').select('role').eq('id', callerUser.id).single();
    if (callerProfile?.role !== 'SUPER_ADMIN') {
      return new Response(JSON.stringify({ error: 'Forbidden: Super admin only' }), { status: 403, headers: corsHeaders });
    }

    const { pendingId } = await req.json();
    if (!pendingId) return new Response(JSON.stringify({ error: 'pendingId required' }), { status: 400, headers: corsHeaders });

    // Look up the pending registration
    const { data: pending, error: pendingErr } = await supabaseAdmin
      .from('pending_registrations')
      .select('*')
      .eq('id', pendingId)
      .single();

    if (pendingErr || !pending) {
      return new Response(JSON.stringify({ error: 'Pending registration not found' }), { status: 404, headers: corsHeaders });
    }



    // Use the _tmp_password from pending_registrations to create the user
    if (!pending._tmp_password) {
      return new Response(JSON.stringify({ error: 'No password found for this registration.' }), { status: 400, headers: corsHeaders });
    }
    const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: pending.email,
      password: pending._tmp_password,
      email_confirm: true,
      user_metadata: {
        full_name: pending.full_name,
        role: 'ADMIN',
        phone: pending.phone || null,
        country: pending.country || null,
        sector: pending.sector || 'GENERAL',
        business_category: pending.business_category || null,
        business_type: pending.business_type || null,
        company_name: pending.company_name || null,
        preferred_currency: pending.preferred_currency || 'USD',
        activation_status: 'ACTIVE',
      }
    });
    if (createErr || !newUser.user) {
      return new Response(JSON.stringify({ error: createErr?.message || 'Failed to create user' }), { status: 500, headers: corsHeaders });
    }

    // Upsert profile to ensure activation status and metadata
    await supabaseAdmin
      .from('profiles')
      .upsert({
        id: newUser.user.id,
        email: pending.email,
        full_name: pending.full_name,
        role: 'ADMIN',
        phone: pending.phone || null,
        country: pending.country || null,
        sector: pending.sector || 'GENERAL',
        business_category: pending.business_category || null,
        business_type: pending.business_type || null,
        company_name: pending.company_name || null,
        preferred_currency: pending.preferred_currency || 'USD',
        dashboard_theme: 'emerald',
        setup_complete: false,
        activation_status: 'ACTIVE',
        rejection_count: 0,
      }, { onConflict: 'id' });

    // Delete the pending registration
    await supabaseAdmin.from('pending_registrations').delete().eq('id', pendingId);

    return new Response(JSON.stringify({ success: true, userId: newUser.user.id }), { headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});
