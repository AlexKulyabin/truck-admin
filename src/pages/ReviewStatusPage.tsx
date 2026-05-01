import { AuthPageLayout } from '../features/auth/AuthPageLayout'
import { useAuth } from '../features/auth/useAuth'
import { getAuthLocale } from '../features/auth/authLocale'
import {
  getReviewStatus,
  shouldShowRejectedRegistrationAction,
} from '../domain/accessRules'
import { ReviewStatusCard } from '../features/review/ReviewStatusCard'
import { reviewStatusCopy } from '../features/review/reviewStatusCopy'
import { useNavigate } from 'react-router-dom'

export function ReviewStatusPage() {
  const navigate = useNavigate()
  const { logout, status } = useAuth()
  const reviewStatus = getReviewStatus(status)
  const copy = reviewStatusCopy[getAuthLocale()][reviewStatus]

  async function handleAction() {
    if (shouldShowRejectedRegistrationAction(status)) {
      await logout()
      navigate('/register')
    }
  }

  return (
    <AuthPageLayout>
      <ReviewStatusCard
        action={copy.action}
        description={copy.description}
        onAction={handleAction}
        status={reviewStatus}
        title={copy.title}
      />
    </AuthPageLayout>
  )
}
