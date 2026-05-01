import { useMemo, useState } from 'react'
import { cn } from '../../lib/cn'
import type { ParkingComplaint } from '../../types/parking'

type ParkingComplaintCardProps = {
  complaint: ParkingComplaint
}

function formatComplaintDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

export function ParkingComplaintCard({ complaint }: ParkingComplaintCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const authorName =
    complaint.authorName?.trim() ||
    '\u0423\u0434\u0430\u043b\u0435\u043d\u043d\u044b\u0439 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c'
  const authorInitial = authorName.charAt(0).toUpperCase()
  const formattedDate = useMemo(
    () => formatComplaintDate(complaint.createdAt),
    [complaint.createdAt],
  )
  const hasLongComment = (complaint.comment?.trim().length ?? 0) > 180
  const reportLabel = complaint.reportLabel?.trim() || null

  return (
    <article className="space-y-3 py-1">
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
                  {isExpanded ? 'Read less' : 'Read more'}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-start gap-2 pt-2 pb-4">
        <button
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-surface font-heading text-sm leading-5 font-medium text-text-primary transition hover:bg-surface-muted"
          type="button"
        >
          Delete
        </button>
        <button
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary font-heading text-sm leading-5 font-medium text-white transition hover:bg-primary-dark"
          type="button"
        >
          More detailed
        </button>
      </div>
    </article>
  )
}
