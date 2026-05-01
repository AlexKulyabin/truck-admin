import { USER_STATUSES } from '../constants/userStatuses'
import { SUPABASE_TABLES } from '../constants/supabaseTables'
import { getSupabaseClient } from '../lib/supabase'
import type { UserProfile } from '../types/user'

const USER_PROFILE_FIELDS =
  'id, created_at, full_name, avatar_url, phone, is_premium, referral_code, theme, updated_at, status'

type WaitForUserProfileOptions = {
  attempts?: number
  delayMs?: number
}

function normalizeUserProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    status: profile.status ?? USER_STATUSES.PENDING,
  }
}

export async function getUserProfile(userId: string) {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from(SUPABASE_TABLES.USERS)
    .select(USER_PROFILE_FIELDS)
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }

  return normalizeUserProfile(data as UserProfile)
}

export async function waitForUserProfile(
  userId: string,
  options: WaitForUserProfileOptions = {},
) {
  const { attempts = 8, delayMs = 500 } = options
  let lastError: unknown

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await getUserProfile(userId)
    } catch (error) {
      lastError = error

      if (attempt < attempts - 1) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, delayMs)
        })
      }
    }
  }

  throw lastError
}
