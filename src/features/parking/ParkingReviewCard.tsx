import { Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getParkingMessages, type SupportedLocale } from '../../constants/parkingI18n'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import type { ParkingReview } from '../../types/parking'
import { cn } from '../../lib/cn'

type ParkingReviewCardProps = {
  review: ParkingReview
}

function formatReviewDate(value: string, locale: SupportedLocale) {
  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function renderStars(score: number) {
  return Array.from({ length: 5 }).map((_, index) => {
    const isFilled = index < score

    return (
      <Star
        className={cn('size-4', isFilled ? 'fill-warning text-warning' : 'text-border')}
        key={`star-${index}`}
      />
    )
  })
}

export function ParkingReviewCard({ review }: ParkingReviewCardProps) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const [isExpanded, setIsExpanded] = useState(false)
  const reviewScore = Math.max(1, Math.min(5, Math.round(review.score ?? 0)))
  const authorName = review.authorName?.trim() || messages.anonymousUser
  const authorInitial = authorName.charAt(0).toUpperCase()
  const formattedDate = useMemo(
    () => formatReviewDate(review.createdAt, locale),
    [locale, review.createdAt],
  )
  const hasLongComment = (review.comment?.trim().length ?? 0) > 180

  return (
    <article className="space-y-3 py-1">
      <div className="flex items-start gap-4">
        {review.authorAvatarUrl ? (
          <img
            alt={authorName}
            className="size-10 shrink-0 rounded-full object-cover"
            src={review.authorAvatarUrl}
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

          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <div className="flex items-center gap-0.5">
              {renderStars(reviewScore)}
            </div>
            <span className="font-heading text-xs font-normal text-text-secondary">
              {formattedDate}
            </span>
          </div>

          {review.comment ? (
            <div className="space-y-2">
              <p
                className={cn(
                  'm-0 font-heading text-sm leading-5 font-normal text-text-primary',
                  !isExpanded &&
                    '[display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:4]',
                )}
              >
                {review.comment}
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

          {review.photos.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1">
              {review.photos.map((photo) => (
                <img
                  alt=""
                  aria-hidden="true"
                  className="size-16 rounded-xl object-cover"
                  key={photo.id}
                  src={photo.url}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-start gap-2 pt-2 pb-4">
        <button
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-surface font-heading text-sm leading-5 font-medium text-text-primary transition hover:bg-surface-muted"
          type="button"
        >
          {messages.delete}
        </button>
        <button
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary font-heading text-sm leading-5 font-medium text-white transition hover:bg-primary-dark"
          type="button"
        >
          {messages.details}
        </button>
      </div>
    </article>
  )
}
