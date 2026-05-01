import type { Session, User } from '@supabase/supabase-js'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { getSupabaseClient, supabase } from '../../lib/supabase'
import {
  AuthContext,
  type AuthContextValue,
  type SignUpResult,
  type UserProfile,
} from './AuthContext'

const AUTH_INIT_TIMEOUT_MS = 1500
const PROFILE_RETRY_ATTEMPTS = 8
const PROFILE_RETRY_DELAY_MS = 500

function getUnknownErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (error && typeof error === 'object') {
    const details = 'details' in error ? String(error.details) : ''
    const message = 'message' in error ? String(error.message) : ''

    return [message, details].filter(Boolean).join(' ')
  }

  return ''
}

function normalizeProfile(profile: UserProfile) {
  return {
    ...profile,
    status: profile.status ?? 'pending',
  }
}

async function loadProfile(userId: string) {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('users')
    .select(
      'id, created_at, full_name, avatar_url, phone, is_premium, referral_code, theme, updated_at, status',
    )
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }

  return normalizeProfile(data as UserProfile)
}

function getUserFromSession(session: Session | null) {
  return session?.user ?? null
}

async function waitForProfile(userId: string) {
  let lastError: unknown

  for (let attempt = 0; attempt < PROFILE_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await loadProfile(userId)
    } catch (error) {
      lastError = error

      if (attempt < PROFILE_RETRY_ATTEMPTS - 1) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, PROFILE_RETRY_DELAY_MS)
        })
      }
    }
  }

  const errorMessage = getUnknownErrorMessage(lastError)

  throw new Error(
    errorMessage
      ? `PROFILE_UNAVAILABLE: ${errorMessage}`
      : 'PROFILE_UNAVAILABLE',
  )
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => {
        reject(new Error('Authentication request timed out'))
      }, timeoutMs)
    }),
  ])
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  const setProfileFromUser = useCallback(async (currentUser: User | null) => {
    setUser(currentUser)

    if (!currentUser) {
      setProfile(null)
      return null
    }

    const nextProfile = await loadProfile(currentUser.id)
    setProfile(nextProfile)
    return nextProfile
  }, [])

  useEffect(() => {
    let isMounted = true

    if (!supabase) {
      return
    }

    withTimeout(supabase.auth.getSession(), AUTH_INIT_TIMEOUT_MS)
      .then(async ({ data }) => {
        if (!isMounted) {
          return
        }

        const currentUser = getUserFromSession(data.session)

        if (!currentUser) {
          setUser(null)
          setProfile(null)
          return
        }

        await withTimeout(setProfileFromUser(currentUser), AUTH_INIT_TIMEOUT_MS)
      })
      .catch(() => {
        if (isMounted) {
          setUser(null)
          setProfile(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setProfileFromUser(getUserFromSession(session)).catch(() => {
        setProfile(null)
      })
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [setProfileFromUser])

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      return null
    }

    const nextProfile = await loadProfile(user.id)
    setProfile(nextProfile)
    return nextProfile
  }, [user])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const client = getSupabaseClient()
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data.user) {
        throw error ?? new Error('Unable to sign in')
      }

      const nextProfile = await loadProfile(data.user.id)
      setUser(data.user)
      setProfile(nextProfile)
      return nextProfile.status
    },
    [],
  )

  const signUp = useCallback(async (email: string, password: string): Promise<SignUpResult> => {
    const client = getSupabaseClient()
    const { data, error } = await client.auth.signUp({
      email,
      password,
    })

    if (error || !data.user) {
      throw error ?? new Error('Unable to sign up')
    }

    if (!data.session) {
      return { confirmationRequired: true, status: 'pending' }
    }

    const nextProfile = await waitForProfile(data.user.id)
    setUser(data.user)
    setProfile(nextProfile)
    return { confirmationRequired: false, status: nextProfile.status }
  }, [])

  const resendSignUpConfirmation = useCallback(async (email: string) => {
    const client = getSupabaseClient()
    const { error } = await client.auth.resend({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
      type: 'signup',
    })

    if (error) {
      throw error
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const client = getSupabaseClient()
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      throw error
    }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    const client = getSupabaseClient()
    const { error } = await client.auth.updateUser({ password })

    if (error) {
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    const client = getSupabaseClient()
    const { error } = await client.auth.signOut()

    if (error) {
      throw error
    }

    setUser(null)
    setProfile(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      status: profile?.status ?? null,
      loading,
      signIn,
      signUp,
      resendSignUpConfirmation,
      resetPassword,
      updatePassword,
      logout,
      refreshProfile,
    }),
    [
      loading,
      logout,
      profile,
      refreshProfile,
      resendSignUpConfirmation,
      resetPassword,
      signIn,
      signUp,
      updatePassword,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
