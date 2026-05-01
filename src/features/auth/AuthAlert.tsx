import { Info } from 'lucide-react'

type AuthAlertProps = {
  text: string
  title: string
}

export function AuthAlert({ text, title }: AuthAlertProps) {
  return (
    <div
      className="flex w-full items-start gap-3 rounded-lg bg-surface p-4"
      role="alert"
    >
      <Info
        className="mt-0.5 shrink-0 text-danger"
        size={20}
        strokeWidth={2}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold leading-6 text-text-primary">
          {title}
        </p>
        <p className="mt-1 text-base font-normal leading-6 text-text-primary">
          {text}
        </p>
      </div>
    </div>
  )
}
