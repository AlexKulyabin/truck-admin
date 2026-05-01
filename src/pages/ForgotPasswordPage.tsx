import { AuthPageLayout } from '../features/auth/AuthPageLayout'
import { authCopy } from '../features/auth/authCopy'
import { getAuthLocale } from '../features/auth/authLocale'
import { ForgotPasswordForm } from '../features/auth/ForgotPasswordForm'

export function ForgotPasswordPage() {
  const copy = authCopy[getAuthLocale()]

  return (
    <AuthPageLayout>
      <ForgotPasswordForm copy={copy} />
    </AuthPageLayout>
  )
}
