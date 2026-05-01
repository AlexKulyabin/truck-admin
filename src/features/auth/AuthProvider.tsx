import type { Session, User } from '@supabase/supabase-js'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { USER_STATUSES } from '../../constants/userStatuses'
import { supabase } from '../../lib/supabase'
import {
  getCurrentSession,
  onAuthSessionChange,
  requestPasswordReset,
  resendSignUpEmail,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  updateCurrentUserPassword,
} from '../../services/authService'
import { getUserProfile, waitForUserProfile } from '../../services/userService'
import {
  AuthContext,
  type AuthContextValue,
  type SignUpResult,
  type UserProfile,
} from './AuthContext'

const AUTH_INIT_TIMEOUT_MS = 1500

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

function getUserFromSession(session: Session | null) {
  return session?.user ?? null
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

    const nextProfile = await getUserProfile(currentUser.id)
    setProfile(nextProfile)
    return nextProfile
  }, [])

  useEffect(() => {
    let isMounted = true

    if (!supabase) {
      return
    }

    withTimeout(getCurrentSession(), AUTH_INIT_TIMEOUT_MS)
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

    const subscription = onAuthSessionChange((session) => {
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

    const nextProfile = await getUserProfile(user.id)
    setProfile(nextProfile)
    return nextProfile
  }, [user])

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await signInWithPassword(email, password)
    const nextProfile = await getUserProfile(data.user.id)

    setUser(data.user)
    setProfile(nextProfile)

    return nextProfile.status
  }, [])

  const signUp = useCallback(
    async (email: string, password: string): Promise<SignUpResult> => {
      const data = await signUpWithPassword(email, password)

      if (!data.session) {
        return {
          confirmationRequired: true,
          status: USER_STATUSES.PENDING,
        }
      }

      const signedUpUser = data.user

      if (!signedUpUser) {
        throw new Error('Unable to sign up')
      }

      let nextProfile: UserProfile

      try {
        nextProfile = await waitForUserProfile(signedUpUser.id)
      } catch (error) {
        const errorMessage = getUnknownErrorMessage(error)

        throw new Error(
          errorMessage
            ? `PROFILE_UNAVAILABLE: ${errorMessage}`
            : 'PROFILE_UNAVAILABLE',
          { cause: error },
        )
      }

      setUser(signedUpUser)
      setProfile(nextProfile)

      return {
        confirmationRequired: false,
        status: nextProfile.status,
      }
    },
    [],
  )

  const resendSignUpConfirmation = useCallback(async (email: string) => {
    await resendSignUpEmail(email)
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    await requestPasswordReset(email)
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    await updateCurrentUserPassword(password)
  }, [])

  const logout = useCallback(async () => {
    await signOut()
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
