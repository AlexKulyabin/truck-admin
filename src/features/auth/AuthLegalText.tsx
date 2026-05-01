import type { AuthCopy } from './authTypes'

type AuthLegalTextProps = {
  copy: AuthCopy
}

export function AuthLegalText({ copy }: AuthLegalTextProps) {
  return (
    <p className="text-center text-sm leading-5 tracking-tight text-text-muted">
      {copy.agreementPrefix}
      <br />
      <a className="text-link" href="#terms">
        {copy.terms}
      </a>{' '}
      {copy.agreementMiddle}{' '}
      <a className="text-link" href="#privacy">
        {copy.privacy}
      </a>
    </p>
  )
}
