import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateEmployeeRequest {
  email: string
  full_name: string
  role: 'admin' | 'hr' | 'manager' | 'employee'
  department_id?: string | null
  manager_id?: string | null
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Create client for caller validation (uses anon key with auth header)
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    })

    // Create admin client for user creation (uses service role key)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Step 1: Validate caller authorization (admin or hr only)
    const {
      data: { user: callerUser },
      error: callerError,
    } = await supabaseClient.auth.getUser()

    if (callerError || !callerUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get caller's profile to check role
    const { data: callerProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', callerUser.id)
      .single()

    if (profileError || !callerProfile) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Caller profile not found' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const callerRole = callerProfile.role
    if (callerRole !== 'admin' && callerRole !== 'hr') {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Only admin or hr can create employees' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 2: Parse and validate input
    const body: CreateEmployeeRequest = await req.json()

    if (!body.email || typeof body.email !== 'string' || !body.email.trim()) {
      return new Response(
        JSON.stringify({ error: 'Invalid input: email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const validRoles: Array<'admin' | 'hr' | 'manager' | 'employee'> = [
      'admin',
      'hr',
      'manager',
      'employee',
    ]
    if (!body.role || !validRoles.includes(body.role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid input: role must be admin, hr, manager, or employee' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 3: Create auth user using Admin API
    // Generate a random secure password (not sent to user)
    const randomPassword =
      Math.random().toString(36).slice(-12) +
      Math.random().toString(36).slice(-12) +
      Math.random().toString(36).slice(-12).toUpperCase() +
      '!@#$%^&*'

    const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: body.email.trim(),
      email_confirm: false,
      password: randomPassword,
      user_metadata: {},
    })

    if (authError || !newUser.user) {
      return new Response(
        JSON.stringify({ error: 'Failed to create auth user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const newUserId = newUser.user.id

    // Step 4: Update profiles table
    // Note: profiles.id = auth.users.id (shared primary key)
    // A trigger should have already created the profiles row, so we update it
    const profileUpdateData: {
      full_name: string
      role: string
      department_id?: string | null
      manager_id?: string | null
    } = {
      full_name: body.full_name?.trim() || null,
      role: body.role,
    }

    if (body.department_id !== undefined) {
      profileUpdateData.department_id = body.department_id || null
    }
    if (body.manager_id !== undefined) {
      profileUpdateData.manager_id = body.manager_id || null
    }

    const { error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .update(profileUpdateData)
      .eq('id', newUserId)

    if (profileUpdateError) {
      // Note: Rollback is NOT required per requirements
      // The auth user exists but profile update failed
      return new Response(
        JSON.stringify({ error: 'Failed to update profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 5: Return success
    return new Response(
      JSON.stringify({
        success: true,
        user_id: newUserId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    // Handle unexpected errors
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})