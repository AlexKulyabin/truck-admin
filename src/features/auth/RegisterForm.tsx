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

type RegisterFormProps = {
  copy: AuthCopy
}

export function RegisterForm({ copy }: RegisterFormProps) {
  const navigate = useNavigate()
  const { resendSignUpConfirmation, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)
  const [authError, setAuthError] = useState<FriendlyAuthError | null>(null)
  const [authErrorDetails, setAuthErrorDetails] = useState<string | null>(null)
  const [isConfirmationSent, setIsConfirmationSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const emailValue = email.trim()
  const isEmailInvalid = Boolean(emailValue) && !isValidEmail(emailValue)
  const isPasswordFilled = Boolean(password.trim())
  const isPasswordTooShort = isPasswordFilled && password.length < 8
  const isConfirmPasswordFilled = Boolean(confirmPassword.trim())
  const doPasswordsMatch = password === confirmPassword
  const isConfirmPasswordInvalid =
    isConfirmPasswordFilled && isPasswordFilled && !doPasswordsMatch
  const isPasswordMismatch = isConfirmPasswordInvalid
  const canSubmit =
    Boolean(emailValue) &&
    isValidEmail(emailValue) &&
    isPasswordFilled &&
    !isPasswordTooShort &&
    isConfirmPasswordFilled &&
    doPasswordsMatch

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    setAuthError(null)
    setAuthErrorDetails(null)
    setIsSubmitting(true)

    try {
      const result = await signUp(emailValue, password)

      if (result.confirmationRequired) {
        setIsConfirmationSent(true)
        return
      }

      navigate('/review-status')
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined

      setAuthError(toFriendlyAuthError(message))
      setAuthErrorDetails(message ?? null)
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

    return (
      <div className="space-y-2">
        <AuthAlert title={errorCopy.title} text={errorCopy.text} />
        {authErrorDetails &&
          (authError === 'unknown' || authError === 'profile_unavailable') && (
          <p className="rounded-lg bg-surface px-4 py-3 text-sm leading-5 text-text-secondary">
            {authErrorDetails}
          </p>
        )}
      </div>
    )
  }

  async function handleResendConfirmation() {
    setAuthError(null)
    setAuthErrorDetails(null)
    setIsSubmitting(true)

    try {
      await resendSignUpConfirmation(emailValue)
      setIsConfirmationSent(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined

      setAuthError(toFriendlyAuthError(message))
      setAuthErrorDetails(message ?? null)
      setIsConfirmationSent(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isConfirmationSent) {
    return (
      <AuthCard>
        <h1 className="mb-6 text-center font-heading text-5xl font-normal leading-tight text-text-primary">
          {copy.confirmationSentTitle}
        </h1>

        <p className="mx-auto max-w-lg text-center text-base font-normal leading-6 text-text-primary">
          {copy.confirmationSentText}
        </p>

        <div className="mt-6 flex w-full flex-col gap-3.5">
          <AuthButton onClick={() => navigate('/')} type="button">
            {copy.confirmationSentAction}
          </AuthButton>
          <AuthButton
            disabled={isSubmitting}
            onClick={handleResendConfirmation}
            type="button"
            variant="secondary"
          >
            {copy.resend}
          </AuthButton>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      as="form"
      onSubmit={handleSubmit}
    >
      <h1 className="mb-7 text-center font-heading text-5xl font-normal leading-tight text-text-primary sm:text-6xl sm:leading-[80px]">
        {copy.registerTitle}
      </h1>

      <div className="space-y-6">
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
          autoComplete="new-password"
          describedBy={isPasswordTooShort ? 'register-password-help' : undefined}
          hideLabel={copy.hidePassword}
          isInvalid={isPasswordTooShort || isPasswordMismatch}
          isVisible={isPasswordVisible}
          label={copy.passwordLabel}
          onChange={(event) => setPassword(event.target.value)}
          onToggleVisibility={() => setIsPasswordVisible((value) => !value)}
          placeholder={copy.passwordPlaceholder}
          showLabel={copy.showPassword}
          value={password}
        />
        {isPasswordTooShort && (
          <p
            className="mt-2 text-sm leading-5 text-danger"
            id="register-password-help"
          >
            {copy.passwordMinLength}
          </p>
        )}

        <div>
          <AuthPasswordField
            autoComplete="new-password"
            describedBy={isPasswordMismatch ? 'register-password-alert' : undefined}
            hideLabel={copy.hidePassword}
            isInvalid={isConfirmPasswordInvalid}
            isVisible={isConfirmPasswordVisible}
            label={copy.confirmPasswordLabel}
            onChange={(event) => setConfirmPassword(event.target.value)}
            onToggleVisibility={() =>
              setIsConfirmPasswordVisible((value) => !value)
            }
            placeholder={copy.passwordPlaceholder}
            showLabel={copy.showPassword}
            value={confirmPassword}
          />
        </div>

        {isPasswordMismatch && (
          <div id="register-password-alert">
            <AuthAlert title={copy.passwordMismatch} text={copy.retryInputText} />
          </div>
        )}

        {renderAuthError()}

        <AuthButton disabled={!canSubmit || isSubmitting} type="submit">
          {copy.next}
        </AuthButton>

        <p className="text-base leading-6 text-text-primary">
          {copy.alreadyHaveAccount}{' '}
          <Link className="text-link underline underline-offset-2" to="/">
            {copy.submit}
          </Link>
        </p>

        <AuthLegalText copy={copy} />
      </div>
    </AuthCard>
  )
}
