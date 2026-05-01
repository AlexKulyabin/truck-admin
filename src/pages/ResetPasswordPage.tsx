import { AuthPageLayout } from '../features/auth/AuthPageLayout'
import { authCopy } from '../features/auth/authCopy'
import { getAuthLocale } from '../features/auth/authLocale'
import { ResetPasswordForm } from '../features/auth/ResetPasswordForm'

export function ResetPasswordPage() {
  const copy = authCopy[getAuthLocale()]

  return (
    <AuthPageLayout>
      <ResetPasswordForm copy={copy} />
    </AuthPageLayout>
  )
}
