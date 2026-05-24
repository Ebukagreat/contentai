import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
  if (error) throw error

  // Supabase may require email confirmation — data.user can be null until confirmed.
  // We create the profile only when we have a real user id.
  if (data.user && data.user.id) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      email,
      plan: 'free',
      credits: 5,
    })
    // Ignore duplicate — profile may already exist
    if (profileError && !profileError.message.includes('duplicate')) throw profileError
  }

  return data
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() { await supabase.auth.signOut() }

export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

export async function useCredit(userId) {
  const { error } = await supabase.rpc('use_credit', { user_id: userId })
  if (error) throw error
}

export async function saveGeneration(userId, type, prompt, output) {
  await supabase.from('generations').insert({ user_id: userId, type, prompt, output, word_count: output.split(/\s+/).length })
}

export async function getGenerations(userId, limit = 20) {
  const { data, error } = await supabase.from('generations').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit)
  if (error) throw error
  return data
}

export async function upgradePlan(userId, plan) {
  const credits = plan === 'starter' ? 50 : 999999
  await supabase.from('profiles').update({ plan, credits }).eq('id', userId)
}
