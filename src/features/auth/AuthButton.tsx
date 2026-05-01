import { cn } from '../../lib/cn'
import type { ButtonHTMLAttributes } from 'react'

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export function AuthButton({
  className,
  disabled = false,
  type = 'button',
  variant = 'primary',
  ...props
}: AuthButtonProps) {
  const isSecondary = variant === 'secondary'

  return (
    <button
      className={cn(
        'flex h-12 w-full items-center justify-center rounded-lg p-3',
        'font-sans text-base font-normal leading-4 transition',
        isSecondary
          ? 'bg-surface text-text-primary hover:bg-surface-muted'
          : disabled
            ? 'bg-button-disabled text-text-secondary'
            : 'bg-primary text-white hover:bg-primary-dark',
        disabled && 'cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-primary/30',
        className,
      )}
      disabled={disabled}
      type={type}
      {...props}
    />
  )
}
