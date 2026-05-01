import type { Enums } from '../../types/supabase'

export type UserStatus = Enums<'user_status'>
export type ParkingStatus = Enums<'parking_status'>

export const USER_STATUSES = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected',
} as const satisfies Record<string, UserStatus>

export const PARKING_STATUSES = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected',
} as const satisfies Record<string, ParkingStatus>
