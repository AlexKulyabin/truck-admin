import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthAlert } from './AuthAlert'
import { AuthButton } from './AuthButton'
import { AuthCard } from './AuthCard'
import { AuthField } from './AuthField'
import { AuthLegalText } from './AuthLegalText'
import { toFriendlyAuthError, type FriendlyAuthError } from './authErrors'
import type { AuthCopy } from './authTypes'
import { isValidEmail } from './authValidation'
import { useAuth } from './useAuth'

type ForgotPasswordFormProps = {
  copy: AuthCopy
}

export function ForgotPasswordForm({ copy }: ForgotPasswordFormProps) {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)
  const [authError, setAuthError] = useState<FriendlyAuthError | null>(null)
  const [authErrorDetails, setAuthErrorDetails] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const emailValue = email.trim()
  const isEmailInvalid = Boolean(emailValue) && !isValidEmail(emailValue)
  const canSubmit = Boolean(emailValue) && isValidEmail(emailValue)

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

  if (isSent) {
    return (
      <AuthCard>
        <h1 className="mb-6 text-center font-heading text-5xl font-normal leading-tight text-text-primary">
          {copy.passwordSentTitle}
        </h1>

        <p className="mx-auto max-w-lg text-center text-base font-normal leading-6 text-text-primary">
          {copy.passwordSentText}
        </p>

        <div className="mt-6 flex w-full flex-col gap-3.5">
          <AuthButton onClick={() => navigate('/')} type="button">
            {copy.backToLogin}
          </AuthButton>
          <AuthButton
            onClick={() => {
              setAuthError(null)
              setAuthErrorDetails(null)
              resetPassword(emailValue).catch((error) => {
                const message = error instanceof Error ? error.message : undefined

                setAuthError(toFriendlyAuthError(message))
                setAuthErrorDetails(message ?? null)
                setIsSent(false)
              })
            }}
            type="button"
            variant="secondary"
          >
            {copy.resend}
          </AuthButton>
        </div>
      </AuthCard>
    )
  }

  const errorCopy = getErrorCopy()

  return (
    <AuthCard
      as="form"
      onSubmit={(event) => {
        event.preventDefault()

        if (canSubmit) {
          setAuthError(null)
          setAuthErrorDetails(null)
          setIsSubmitting(true)
          resetPassword(emailValue)
            .then(() => setIsSent(true))
            .catch((error) => {
              const message = error instanceof Error ? error.message : undefined

              setAuthError(
                toFriendlyAuthError(message),
              )
              setAuthErrorDetails(message ?? null)
            })
            .finally(() => setIsSubmitting(false))
        }
      }}
    >
      <h1 className="mb-7 text-center font-heading text-5xl font-normal leading-tight text-text-primary sm:text-6xl sm:leading-[80px]">
        {copy.forgotPasswordTitle}
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

        <p className="text-base font-normal leading-6 text-text-primary">
          {copy.forgotPasswordHint}
        </p>

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
          {isSubmitting ? copy.sending : copy.send}
        </AuthButton>

        <AuthLegalText copy={copy} />
      </div>
    </AuthCard>
  )
}
