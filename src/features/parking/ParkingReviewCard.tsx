import { Star } from 'lucide-react'
import { type MouseEvent as ReactMouseEvent, useMemo, useRef, useState } from 'react'
import { getParkingMessages, type SupportedLocale } from '../../constants/parkingI18n'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import type { ParkingReview } from '../../types/parking'
import { cn } from '../../lib/cn'

type ParkingReviewCardProps = {
  actionDeleteLabel?: string
  actionDetailsLabel?: string
  onDelete?: () => void
  onDetails?: () => void
  review: ParkingReview
  showActions?: boolean
  showAuthorName?: boolean
  thumbnailUrl?: string | null
  title?: string | null
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

export function ParkingReviewCard({
  actionDeleteLabel,
  actionDetailsLabel,
  onDelete,
  onDetails,
  review,
  showActions = true,
  showAuthorName = true,
  thumbnailUrl = null,
  title = null,
}: ParkingReviewCardProps) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPhotoDragging, setIsPhotoDragging] = useState(false)
  const photoScrollRef = useRef<HTMLDivElement | null>(null)
  const photoDragStateRef = useRef({
    pointerId: null as number | null,
    scrollLeft: 0,
    startX: 0,
  })
  const reviewScore = Math.max(1, Math.min(5, Math.round(review.score ?? 0)))
  const authorName = review.authorName?.trim() || messages.anonymousUser
  const displayTitle = title?.trim() || (showAuthorName ? authorName : null)
  const authorInitial = authorName.charAt(0).toUpperCase()
  const formattedDate = useMemo(
    () => formatReviewDate(review.createdAt, locale),
    [locale, review.createdAt],
  )
  const hasLongComment = (review.comment?.trim().length ?? 0) > 180

  function finishPhotoDragging(pointerId: number | null) {
    if (photoDragStateRef.current.pointerId !== pointerId) {
      return
    }

    photoDragStateRef.current.pointerId = null
    setIsPhotoDragging(false)
  }

  function handlePhotoMouseDown(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !photoScrollRef.current) {
      return
    }

    photoDragStateRef.current = {
      pointerId: -1,
      scrollLeft: photoScrollRef.current.scrollLeft,
      startX: event.clientX,
    }
    setIsPhotoDragging(true)
    window.addEventListener('mousemove', handlePhotoMouseMove)
    window.addEventListener('mouseup', handlePhotoMouseUp)
  }

  function handlePhotoMouseMove(event: MouseEvent) {
    if (!isPhotoDragging || !photoScrollRef.current) {
      return
    }

    const deltaX = event.clientX - photoDragStateRef.current.startX
    photoScrollRef.current.scrollLeft = photoDragStateRef.current.scrollLeft - deltaX
  }

  function handlePhotoMouseUp() {
    finishPhotoDragging(photoDragStateRef.current.pointerId)
    window.removeEventListener('mousemove', handlePhotoMouseMove)
    window.removeEventListener('mouseup', handlePhotoMouseUp)
  }

  function handlePhotoClick(event: ReactMouseEvent<HTMLDivElement>) {
    if (isPhotoDragging) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  return (
    <article className="py-1">
      <div className="flex items-start gap-4">
        {(thumbnailUrl ?? review.authorAvatarUrl) ? (
          <img
            alt={displayTitle ?? authorName}
            className="size-10 shrink-0 rounded-full object-cover"
            src={thumbnailUrl ?? review.authorAvatarUrl ?? ''}
          />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E6DBFF] font-heading text-base font-medium text-[#5B41A8]">
            {authorInitial}
          </span>
        )}

        <div className="min-w-0 flex-1 space-y-1.5">
          {displayTitle ? (
            <div
              className={cn(
                'font-heading text-base leading-6 text-text-primary',
                showAuthorName ? 'font-normal' : 'font-medium',
              )}
            >
              {displayTitle}
            </div>
          ) : null}

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
            <div
              className={cn(
                'overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
                isPhotoDragging ? 'cursor-grabbing select-none' : 'cursor-grab',
              )}
              onClick={handlePhotoClick}
              onMouseDown={handlePhotoMouseDown}
              ref={photoScrollRef}
            >
              <div className="flex min-w-max flex-nowrap items-center gap-1">
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
