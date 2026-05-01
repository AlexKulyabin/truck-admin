import { authCopy } from '../features/auth/authCopy'
import { getAuthLocale } from '../features/auth/authLocale'
import { AuthPageLayout } from '../features/auth/AuthPageLayout'
import { LoginForm } from '../features/auth/LoginForm'

export function LoginPage() {
  const copy = authCopy[getAuthLocale()]

  return (
    <AuthPageLayout>
      <LoginForm copy={copy} />
    </AuthPageLayout>
  )
}
