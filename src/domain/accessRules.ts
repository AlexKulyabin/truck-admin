import { USER_STATUSES, type UserStatus } from '../constants/userStatuses'

const STATUS_ROUTES: Record<UserStatus, string> = {
  [USER_STATUSES.APPROVED]: '/app',
  [USER_STATUSES.PENDING]: '/review-status',
  [USER_STATUSES.REJECTED]: '/review-status',
}

export function canAccessDashboard(status: UserStatus | null) {
  return status === USER_STATUSES.APPROVED
}

export function getAuthRedirectPath(status: UserStatus) {
  return STATUS_ROUTES[status]
}

export function getReviewStatus(status: UserStatus | null): UserStatus {
  return status === USER_STATUSES.REJECTED
    ? USER_STATUSES.REJECTED
    : USER_STATUSES.PENDING
}

export function shouldShowRejectedRegistrationAction(status: UserStatus | null) {
  return status === USER_STATUSES.REJECTED
}
