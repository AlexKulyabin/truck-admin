import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthAlert } from './AuthAlert'
import { AuthButton } from './AuthButton'
import { AuthCard } from './AuthCard'
import { AuthPasswordField } from './AuthPasswordField'
import { toFriendlyAuthError, type FriendlyAuthError } from './authErrors'
import type { AuthCopy } from './authTypes'
import { useAuth } from './useAuth'

type ResetPasswordFormProps = {
  copy: AuthCopy
}

export function ResetPasswordForm({ copy }: ResetPasswordFormProps) {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)
  const [authError, setAuthError] = useState<FriendlyAuthError | null>(null)
  const [authErrorDetails, setAuthErrorDetails] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)

  const isPasswordFilled = Boolean(password.trim())
  const isPasswordTooShort = isPasswordFilled && password.length < 8
  const isConfirmPasswordFilled = Boolean(confirmPassword.trim())
  const doPasswordsMatch = password === confirmPassword
  const isPasswordMismatch =
    isConfirmPasswordFilled && isPasswordFilled && !doPasswordsMatch
  const canSubmit =
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
      await updatePassword(password)
      setIsUpdated(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined

      setAuthError(toFriendlyAuthError(message))
      setAuthErrorDetails(message ?? null)
    } finally {
      setIsSubmitting(false)
    }
  }

  function getErrorCopy() {
    if (!authError) {
      return null
    }

    return {
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
  }

  if (isUpdated) {
    return (
      <AuthCard>
        <h1 className="mb-6 text-center font-heading text-5xl font-normal leading-tight text-text-primary">
          {copy.passwordUpdatedTitle}
        </h1>
        <p className="mx-auto max-w-lg text-center text-base font-normal leading-6 text-text-primary">
          {copy.passwordUpdatedText}
        </p>
        <div className="mt-6">
          <AuthButton onClick={() => navigate('/')} type="button">
            {copy.backToLogin}
          </AuthButton>
        </div>
      </AuthCard>
    )
  }

  const errorCopy = getErrorCopy()

  return (
    <AuthCard as="form" onSubmit={handleSubmit}>
      <h1 className="mb-7 text-center font-heading text-5xl font-normal leading-tight text-text-primary sm:text-6xl sm:leading-[80px]">
        {copy.newPasswordTitle}
      </h1>

      <div className="space-y-6">
        <AuthPasswordField
          autoComplete="new-password"
          describedBy={isPasswordTooShort ? 'reset-password-help' : undefined}
          hideLabel={copy.hidePassword}
          isInvalid={isPasswordTooShort || isPasswordMismatch}
          isVisible={isPasswordVisible}
          label={copy.newPasswordLabel}
          onChange={(event) => setPassword(event.target.value)}
          onToggleVisibility={() => setIsPasswordVisible((value) => !value)}
          placeholder={copy.passwordPlaceholder}
          showLabel={copy.showPassword}
          value={password}
        />
        {isPasswordTooShort && (
          <p
            className="mt-2 text-sm leading-5 text-danger"
            id="reset-password-help"
          >
            {copy.passwordMinLength}
          </p>
        )}

        <AuthPasswordField
          autoComplete="new-password"
          describedBy={isPasswordMismatch ? 'reset-password-alert' : undefined}
          hideLabel={copy.hidePassword}
          isInvalid={isPasswordMismatch}
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

        {isPasswordMismatch && (
          <div id="reset-password-alert">
            <AuthAlert title={copy.passwordMismatch} text={copy.retryInputText} />
          </div>
        )}

        {authError && errorCopy && (
          <div className="space-y-2">
            <AuthAlert
              title={errorCopy.title}
              text={errorCopy.text}
            />
            {authErrorDetails && authError === 'unknown' && (
              <p className="rounded-lg bg-surface px-4 py-3 text-sm leading-5 text-text-secondary">
                {authErrorDetails}
              </p>
            )}
          </div>
        )}

        <AuthButton disabled={!canSubmit || isSubmitting} type="submit">
          {copy.savePassword}
        </AuthButton>
      </div>
    </AuthCard>
  )
}
