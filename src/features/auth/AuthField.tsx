import type { ChangeEventHandler, HTMLInputTypeAttribute } from 'react'
import { cn } from '../../lib/cn'

type AuthFieldProps = {
  autoComplete?: string
  isInvalid?: boolean
  label: string
  onChange: ChangeEventHandler<HTMLInputElement>
  placeholder: string
  type: HTMLInputTypeAttribute
  value: string
}

export function AuthField({
  autoComplete,
  isInvalid = false,
  label,
  onChange,
  placeholder,
  type,
  value,
}: AuthFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-normal leading-6 text-text-primary">
        {label}
      </span>
      <input
        autoComplete={autoComplete}
        aria-invalid={isInvalid ? 'true' : 'false'}
        className={cn(
          'h-10 w-full rounded-lg border bg-surface px-4 font-sans text-base font-normal leading-4 text-text-primary outline-none transition placeholder:text-text-secondary focus:ring-2',
          isInvalid
            ? 'border-danger focus:border-danger focus:ring-danger/20'
            : 'border-transparent focus:border-link focus:ring-link/20',
        )}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  )
}
