import type { FormEventHandler, PropsWithChildren } from 'react'

type AuthCardProps = PropsWithChildren<{
  as?: 'form' | 'section'
  onSubmit?: FormEventHandler<HTMLFormElement>
}>

export function AuthCard({ as = 'section', children, onSubmit }: AuthCardProps) {
  const className =
    'w-full rounded-card border border-border bg-surface-muted p-5 font-sans shadow-card sm:max-w-[560px] sm:p-6'

  if (as === 'form') {
    return (
      <form className={className} onSubmit={onSubmit}>
        {children}
      </form>
    )
  }

  return <section className={className}>{children}</section>
}
