import { AuthPageLayout } from '../features/auth/AuthPageLayout'
import { authCopy } from '../features/auth/authCopy'
import { getAuthLocale } from '../features/auth/authLocale'
import { RegisterForm } from '../features/auth/RegisterForm'

export function RegisterPage() {
  const copy = authCopy[getAuthLocale()]

  return (
    <AuthPageLayout>
      <RegisterForm copy={copy} />
    </AuthPageLayout>
  )
}
