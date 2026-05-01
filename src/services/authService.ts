import type { Session } from '@supabase/supabase-js'
import { getSupabaseClient } from '../lib/supabase'

export function getCurrentSession() {
  return getSupabaseClient().auth.getSession()
}

export function onAuthSessionChange(
  callback: (_session: Session | null) => void,
) {
  const {
    data: { subscription },
  } = getSupabaseClient().auth.onAuthStateChange((_event, session) => {
    callback(session)
  })

  return subscription
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    throw error ?? new Error('Unable to sign in')
  }

  return data
}

export async function signUpWithPassword(email: string, password: string) {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email,
    password,
  })

  if (error || !data.user) {
    throw error ?? new Error('Unable to sign up')
  }

  return data
}

export async function resendSignUpEmail(email: string) {
  const { error } = await getSupabaseClient().auth.resend({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
    type: 'signup',
  })

  if (error) {
    throw error
  }
}

export async function requestPasswordReset(email: string) {
  const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) {
    throw error
  }
}

export async function updateCurrentUserPassword(password: string) {
  const { error } = await getSupabaseClient().auth.updateUser({ password })

  if (error) {
    throw error
  }
}

export async function signOut() {
  const { error } = await getSupabaseClient().auth.signOut()

  if (error) {
    throw error
  }
}
