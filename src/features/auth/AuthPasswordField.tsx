import { Eye, EyeOff } from 'lucide-react'
import type { ChangeEventHandler } from 'react'

type AuthPasswordFieldProps = {
  autoComplete: string
  describedBy?: string
  hideLabel: string
  isInvalid?: boolean
  isVisible: boolean
  label: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onToggleVisibility: () => void
  placeholder: string
  showLabel: string
  value: string
}

export function AuthPasswordField({
  autoComplete,
  describedBy,
  hideLabel,
  isInvalid = false,
  isVisible,
  label,
  onChange,
  onToggleVisibility,
  placeholder,
  showLabel,
  value,
}: AuthPasswordFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-base leading-6 text-text-primary">
        {label}
      </span>
      <span
        className={`flex h-10 w-full items-center rounded-lg border bg-surface transition ${
          isInvalid
            ? 'border-danger focus-within:border-danger'
            : 'border-transparent focus-within:border-link'
        }`}
      >
        <input
          aria-describedby={describedBy}
          aria-invalid={isInvalid ? 'true' : 'false'}
          autoComplete={autoComplete}
          className="min-w-0 flex-1 bg-transparent px-4 font-sans text-base font-normal leading-4 text-text-primary outline-none placeholder:text-text-secondary"
          onChange={onChange}
          placeholder={placeholder}
          type={isVisible ? 'text' : 'password'}
          value={value}
        />
        <button
          aria-label={isVisible ? hideLabel : showLabel}
          className="flex size-10 shrink-0 items-center justify-center rounded-r-lg text-text-secondary transition hover:bg-surface-muted"
          onClick={onToggleVisibility}
          type="button"
        >
          {isVisible ? (
            <EyeOff size={22} aria-hidden="true" />
          ) : (
            <Eye size={22} aria-hidden="true" />
          )}
        </button>
      </span>
    </label>
  )
}
