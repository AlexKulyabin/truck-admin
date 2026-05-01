export type FriendlyAuthError =
  | 'credentials'
  | 'duplicate'
  | 'profile_unavailable'
  | 'rate_limit'
  | 'same_password'
  | 'session_expired'
  | 'unknown'

export function toFriendlyAuthError(message?: string): FriendlyAuthError {
  if (!message) {
    return 'unknown'
  }

  const normalizedMessage = message.toLowerCase()

  if (
    normalizedMessage.includes('invalid login credentials') ||
    normalizedMessage.includes('invalid credentials') ||
    normalizedMessage.includes('email not confirmed')
  ) {
    return 'credentials'
  }

  if (
    normalizedMessage.includes('already registered') ||
    normalizedMessage.includes('already exists') ||
    normalizedMessage.includes('user exists')
  ) {
    return 'duplicate'
  }

  if (
    normalizedMessage.includes('profile_unavailable') ||
    normalizedMessage.includes('profile not found') ||
    normalizedMessage.includes('multiple (or no) rows returned') ||
    normalizedMessage.includes('permission denied') ||
    normalizedMessage.includes('row-level security') ||
    normalizedMessage.includes('violates row-level security')
  ) {
    return 'profile_unavailable'
  }

  if (
    normalizedMessage.includes('rate limit') ||
    normalizedMessage.includes('too many requests') ||
    normalizedMessage.includes('over email send rate limit')
  ) {
    return 'rate_limit'
  }

  if (
    normalizedMessage.includes('same password') ||
    normalizedMessage.includes('different from the old password') ||
    normalizedMessage.includes('different from the current') ||
    normalizedMessage.includes('should be different') ||
    normalizedMessage.includes('must be different')
  ) {
    return 'same_password'
  }

  if (
    normalizedMessage.includes('session missing') ||
    normalizedMessage.includes('session not found') ||
    normalizedMessage.includes('session expired') ||
    normalizedMessage.includes('invalid refresh token') ||
    normalizedMessage.includes('jwt expired')
  ) {
    return 'session_expired'
  }

  return 'unknown'
}
