import clockIcon from '../../assets/icons/clock.svg'
import closeSquareIcon from '../../assets/icons/close-square.svg'
import tickSquareIcon from '../../assets/icons/tick-square.svg'
import { AuthButton } from '../auth/AuthButton'
import type { ReviewStatus } from '../auth/authTypes'

type ReviewStatusCardProps = {
  action?: string
  description: string
  onAction?: () => void
  status: ReviewStatus
  title: string
}

const statusIcons = {
  pending: clockIcon,
  approved: tickSquareIcon,
  rejected: closeSquareIcon,
}

export function ReviewStatusCard({
  action,
  description,
  onAction,
  status,
  title,
}: ReviewStatusCardProps) {
  const statusIcon = statusIcons[status]

  return (
    <section className="flex w-full max-w-xs flex-col items-center gap-6 rounded-xl border border-border bg-surface px-4 py-10 shadow-card">
      <img
        alt=""
        aria-hidden="true"
        className="size-20"
        src={statusIcon}
      />

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center font-heading text-xl font-medium leading-7 text-text-primary">
          {title}
        </h1>
        {description && (
          <p className="text-center font-heading text-base font-normal leading-6 text-text-secondary">
            {description}
          </p>
        )}
      </div>

      {action && (
        <AuthButton onClick={onAction} type="button">
          {action}
        </AuthButton>
      )}
    </section>
  )
}
