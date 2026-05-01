export type AuthCopy = {
  title: string
  registerTitle: string
  forgotPasswordTitle: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  confirmPasswordLabel: string
  passwordPlaceholder: string
  passwordMismatch: string
  passwordMinLength: string
  invalidCredentialsTitle: string
  invalidCredentialsText: string
  duplicateAccountTitle: string
  duplicateAccountText: string
  profileUnavailableTitle: string
  profileUnavailableText: string
  rateLimitTitle: string
  rateLimitText: string
  samePasswordTitle: string
  samePasswordText: string
  sessionExpiredTitle: string
  sessionExpiredText: string
  retryInputText: string
  unknownErrorTitle: string
  unknownErrorText: string
  forgotPassword: string
  forgotPasswordHint: string
  passwordSentTitle: string
  passwordSentText: string
  confirmationSentTitle: string
  confirmationSentText: string
  confirmationSentAction: string
  newPasswordTitle: string
  newPasswordLabel: string
  passwordUpdatedTitle: string
  passwordUpdatedText: string
  savePassword: string
  backToLogin: string
  resend: string
  send: string
  sending: string
  submit: string
  noAccount: string
  createAccount: string
  alreadyHaveAccount: string
  next: string
  agreementPrefix: string
  terms: string
  agreementMiddle: string
  privacy: string
  mapFallbackTitle: string
  mapFallbackText: string
  showPassword: string
  hidePassword: string
}

export type Locale = 'ru' | 'en'

export type ReviewStatus = 'pending' | 'approved' | 'rejected'
