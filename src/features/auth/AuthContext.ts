import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'
import type { UserStatus } from '../../constants/userStatuses'
import type { UserProfile } from '../../types/user'

export type { UserProfile }

export type SignUpResult = {
  confirmationRequired: boolean
  status: UserStatus
}

export type AuthContextValue = {
  user: User | null
  profile: UserProfile | null
  status: UserStatus | null
  loading: boolean
  signIn: (_email: string, _password: string) => Promise<UserStatus>
  signUp: (_email: string, _password: string) => Promise<SignUpResult>
  resendSignUpConfirmation: (_email: string) => Promise<void>
  resetPassword: (_email: string) => Promise<void>
  updatePassword: (_password: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<UserProfile | null>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
