import type { UserStatus } from '../constants/userStatuses'
import type { Tables } from '../../types/supabase'

export type UserProfileRow = Tables<'users'>

export type UserProfile = Omit<UserProfileRow, 'status'> & {
  status: UserStatus
}
