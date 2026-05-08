import { useMemo, useState } from 'react'
import {
  formatComplaintReportLabel,
  getParkingMessages,
  type SupportedLocale,
} from '../../constants/parkingI18n'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import { cn } from '../../lib/cn'
import type { ParkingComplaint } from '../../types/parking'

type ParkingComplaintCardProps = {
  actionDeleteLabel?: string
  actionDetailsLabel?: string
  onDelete?: () => void
  onDetails?: () => void
  complaint: ParkingComplaint
  showActions?: boolean
}

function formatComplaintDate(value: string, locale: SupportedLocale) {
  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

export function ParkingComplaintCard({
  actionDeleteLabel,
  actionDetailsLabel,
  onDelete,
  onDetails,
  complaint,
  showActions = true,
}: ParkingComplaintCardProps) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const [isExpanded, setIsExpanded] = useState(false)
  const authorName = complaint.authorName?.trim() || messages.anonymousUser
  const authorInitial = authorName.charAt(0).toUpperCase()
  const formattedDate = useMemo(
    () => formatComplaintDate(complaint.createdAt, locale),
    [complaint.createdAt, locale],
  )
  const hasLongComment = (complaint.comment?.trim().length ?? 0) > 180
  const reportLabel = formatComplaintReportLabel(complaint.reportLabel, locale)

  return (
    <article className="py-1">
      <div className="flex items-start gap-4 px-4 py-1">
        {complaint.authorAvatarUrl ? (
          <img
            alt={authorName}
            className="size-10 shrink-0 rounded-full object-cover"
            src={complaint.authorAvatarUrl}
          />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E6DBFF] font-heading text-base font-medium text-[#5B41A8]">
            {authorInitial}
          </span>
        )}

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="font-heading text-base leading-6 font-normal text-text-primary">
            {authorName}
          </div>
          <div className="font-heading text-xs font-normal text-text-secondary">
            {formattedDate}
          </div>
          {reportLabel ? (
            <div className="font-heading text-sm leading-5 font-medium text-text-primary">
              {reportLabel}
            </div>
          ) : null}

          {complaint.comment ? (
            <div className="space-y-2">
              <p
                className={cn(
                  'm-0 font-heading text-sm leading-5 font-normal text-text-primary',
                  !isExpanded &&
                    '[display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:4]',
                )}
              >
                {complaint.comment}
              </p>
              {hasLongComment ? (
                <button
                  className="font-heading text-left text-sm leading-5 font-medium text-text-secondary transition hover:text-text-primary"
                  onClick={() => setIsExpanded((currentValue) => !currentValue)}
                  type="button"
                >
                  {isExpanded ? messages.readLess : messages.readMore}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {showActions ? (
        <div className="flex items-start gap-2 pt-2 pb-4">
          <button
            className="flex h-10 flex-1 items-center justify-center rounded-xl bg-surface font-heading text-sm leading-5 font-medium text-text-primary transition hover:bg-surface-muted"
            onClick={onDelete}
            type="button"
          >
            {actionDeleteLabel ?? messages.delete}
          </button>
          <button
            className="flex h-10 flex-1 items-center justify-center rounded-xl bg-primary font-heading text-sm leading-5 font-medium text-white transition hover:bg-primary-dark"
            onClick={onDetails}
            type="button"
          >
            {actionDetailsLabel ?? messages.details}
          </button>
        </div>
      ) : null}
    </article>
  )
}
