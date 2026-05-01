import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'
import type { ReviewStatus } from './authTypes'

export type SignUpResult = {
  confirmationRequired: boolean
  status: ReviewStatus
}

export type UserProfile = {
  id: string
  created_at: string | null
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  is_premium: boolean | null
  referral_code: string | null
  theme: string | null
  updated_at: string | null
  status: ReviewStatus
}

export type AuthContextValue = {
  user: User | null
  profile: UserProfile | null
  status: ReviewStatus | null
  loading: boolean
  signIn: (_email: string, _password: string) => Promise<ReviewStatus>
  signUp: (_email: string, _password: string) => Promise<SignUpResult>
  resendSignUpConfirmation: (_email: string) => Promise<void>
  resetPassword: (_email: string) => Promise<void>
  updatePassword: (_password: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<UserProfile | null>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
