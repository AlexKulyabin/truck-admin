import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthAlert } from './AuthAlert'
import { AuthButton } from './AuthButton'
import { AuthCard } from './AuthCard'
import { AuthField } from './AuthField'
import { AuthLegalText } from './AuthLegalText'
import { AuthPasswordField } from './AuthPasswordField'
import { toFriendlyAuthError, type FriendlyAuthError } from './authErrors'
import type { AuthCopy } from './authTypes'
import { isValidEmail } from './authValidation'
import { useAuth } from './useAuth'

type LoginFormProps = {
  copy: AuthCopy
}

export function LoginForm({ copy }: LoginFormProps) {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [authError, setAuthError] = useState<FriendlyAuthError | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const emailValue = email.trim()
  const isEmailInvalid = Boolean(emailValue) && !isValidEmail(emailValue)
  const isPasswordValid = Boolean(password.trim())
  const canSubmit = Boolean(emailValue) && isValidEmail(emailValue) && isPasswordValid

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    setAuthError(null)
    setIsSubmitting(true)

    try {
      const nextStatus = await signIn(emailValue, password)

      if (nextStatus === 'approved') {
        navigate('/app')
        return
      }

      navigate('/review-status')
    } catch (error) {
      setAuthError(
        toFriendlyAuthError(error instanceof Error ? error.message : undefined),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderAuthError() {
    if (!authError) {
      return null
    }

    const errorCopy = {
      credentials: {
        text: copy.invalidCredentialsText,
        title: copy.invalidCredentialsTitle,
      },
      duplicate: {
        text: copy.duplicateAccountText,
        title: copy.duplicateAccountTitle,
      },
      profile_unavailable: {
        text: copy.profileUnavailableText,
        title: copy.profileUnavailableTitle,
      },
      rate_limit: {
        text: copy.rateLimitText,
        title: copy.rateLimitTitle,
      },
      same_password: {
        text: copy.samePasswordText,
        title: copy.samePasswordTitle,
      },
      session_expired: {
        text: copy.sessionExpiredText,
        title: copy.sessionExpiredTitle,
      },
      unknown: {
        text: copy.unknownErrorText,
        title: copy.unknownErrorTitle,
      },
    }[authError]

    return <AuthAlert title={errorCopy.title} text={errorCopy.text} />
  }

  return (
    <AuthCard as="form" onSubmit={handleSubmit}>
      <h1 className="mb-7 text-center font-heading text-5xl font-normal leading-tight text-text-primary sm:text-6xl sm:leading-[80px]">
        {copy.title}
      </h1>

      <div className="space-y-6">
        {renderAuthError()}

        <AuthField
          autoComplete="email"
          isInvalid={isEmailInvalid}
          label={copy.emailLabel}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.emailPlaceholder}
          type="email"
          value={email}
        />

        <AuthPasswordField
          autoComplete="current-password"
          hideLabel={copy.hidePassword}
          isVisible={isPasswordVisible}
          label={copy.passwordLabel}
          onChange={(event) => setPassword(event.target.value)}
          onToggleVisibility={() => setIsPasswordVisible((value) => !value)}
          placeholder={copy.passwordPlaceholder}
          showLabel={copy.showPassword}
          value={password}
        />

        <Link
          className="inline-flex text-base leading-6 text-link underline underline-offset-2"
          to="/forgot-password"
        >
          {copy.forgotPassword}
        </Link>

        <AuthButton disabled={!canSubmit || isSubmitting} type="submit">
          {copy.submit}
        </AuthButton>

        <p className="text-base leading-6 text-text-primary">
          {copy.noAccount}{' '}
          <Link
            className="text-link underline underline-offset-2"
            to="/register"
          >
            {copy.createAccount}
          </Link>
        </p>

        <AuthLegalText copy={copy} />
      </div>
    </AuthCard>
  )
}
