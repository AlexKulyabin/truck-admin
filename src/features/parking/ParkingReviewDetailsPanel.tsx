import { type MouseEvent as ReactMouseEvent, useRef, useState } from 'react'
import { X } from 'lucide-react'
import arrowIcon from '../../assets/icons/arrow.svg'
import commentIcon from '../../assets/icons/comment.svg'
import comfortForRelaxationIcon from '../../assets/icons/comfort-for-relaxation.svg'
import infrastructureIcon from '../../assets/icons/Infrastructure.svg'
import mainImpressionIcon from '../../assets/icons/main-impression.svg'
import photoIcon from '../../assets/icons/photo2.svg'
import securityLevelIcon from '../../assets/icons/security-level.svg'
import trackIcon from '../../assets/icons/track.svg'
import trashIcon from '../../assets/icons/trash.svg'
import {
  formatReviewDetailRating,
  getParkingMessages,
  type SupportedLocale,
} from '../../constants/parkingI18n'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import { cn } from '../../lib/cn'
import type { ParkingReview } from '../../types/parking'
import { ParkingReviewDeleteDialog } from './ParkingReviewDeleteDialog'

type ParkingReviewDetailsPanelProps = {
  onBack: () => void
  onClose: () => void
  onDelete?: () => Promise<void> | void
  review: ParkingReview
}

type ReviewBadgeCardProps = {
  icon: string
  subtitle?: string
  title: string
}

type ReviewPhotosCardProps = {
  photos: ParkingReview['photos']
  title: string
}

function ReviewBadgeCard({ icon, subtitle, title }: ReviewBadgeCardProps) {
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-[10px] bg-surface px-4 py-3.5 shadow-card">
      <img alt="" aria-hidden="true" className="size-7 shrink-0" src={icon} />
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="font-heading text-base leading-5 font-medium text-text-primary">
          {title}
        </div>
        {subtitle ? (
          <div className="font-heading text-base leading-5 font-normal text-text-secondary">
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ReviewCommentCard({
  comment,
  icon,
  title,
}: {
  comment: string
  icon: string
  title: string
}) {
  return (
    <div className="overflow-hidden rounded-[10px] bg-surface shadow-card">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <img alt="" aria-hidden="true" className="size-7 shrink-0" src={icon} />
        <div className="font-heading text-base leading-5 font-medium text-text-primary">
          {title}
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="px-2 py-1">
          <p className="m-0 font-heading text-base leading-6 font-normal tracking-wide text-text-primary">
            {comment}
          </p>
        </div>
      </div>
    </div>
  )
}

function ReviewPhotosCard({ photos, title }: ReviewPhotosCardProps) {
  const photoScrollRef = useRef<HTMLDivElement | null>(null)
  const photoDragStateRef = useRef({
    pointerId: null as number | null,
    scrollLeft: 0,
    startX: 0,
  })
  const [isPhotoDragging, setIsPhotoDragging] = useState(false)

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
    if (photoDragStateRef.current.pointerId === null || !photoScrollRef.current) {
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
    if (photoDragStateRef.current.pointerId !== null) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  return (
    <div className="overflow-hidden rounded-[10px] bg-surface shadow-card">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <img alt="" aria-hidden="true" className="size-7 shrink-0" src={photoIcon} />
        <div className="font-heading text-base leading-5 font-medium text-text-primary">
          {title}
        </div>
      </div>
      <div
        className={cn(
          'overflow-x-auto px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
          isPhotoDragging ? 'cursor-grabbing select-none' : 'cursor-grab',
        )}
        onClick={handlePhotoClick}
        onMouseDown={handlePhotoMouseDown}
        ref={photoScrollRef}
      >
        <div className="flex min-w-max gap-2">
          {photos.length > 0 ? (
            photos.map((photo) => (
              <img
                alt=""
                aria-hidden="true"
                className="size-24 shrink-0 rounded-xl object-cover"
                draggable={false}
                key={photo.id}
                src={photo.url}
              />
            ))
          ) : (
            <div className="flex items-center gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="size-24 shrink-0 rounded-xl bg-surface-muted"
                  key={`empty-photo-${index}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getReviewDetailSections(locale: SupportedLocale) {
  const messages = getParkingMessages(locale)

  return [
    {
      icon: mainImpressionIcon,
      subtitle: messages.great,
      title: messages.mainImpression,
    },
    {
      icon: trackIcon,
      subtitle: messages.veryConvenient,
      title: messages.convenienceOfTruckArrival,
    },
    {
      icon: securityLevelIcon,
      subtitle: messages.absolutelySafe,
      title: messages.securityLevel,
    },
    {
      icon: infrastructureIcon,
      subtitle: messages.everythingThatWasStatedInTheDescription,
      title: messages.infrastructure,
    },
    {
      icon: comfortForRelaxationIcon,
      subtitle: messages.quietAndComfortable,
      title: messages.comfortForRelaxation,
    },
  ] as const
}

function getReviewSections(review: ParkingReview, locale: SupportedLocale) {
  const fallbackSections = getReviewDetailSections(locale)

  return [
    {
      ...fallbackSections[0],
      subtitle:
        formatReviewDetailRating('impression', review.ratingImpression, locale) ??
        fallbackSections[0].subtitle,
    },
    {
      ...fallbackSections[1],
      subtitle:
        formatReviewDetailRating('arrival', review.ratingArrival, locale) ??
        fallbackSections[1].subtitle,
    },
    {
      ...fallbackSections[2],
      subtitle:
        formatReviewDetailRating('security', review.ratingSecurity, locale) ??
        fallbackSections[2].subtitle,
    },
    {
      ...fallbackSections[3],
      subtitle:
        formatReviewDetailRating('infrastructure', review.ratingInfrastructure, locale) ??
        fallbackSections[3].subtitle,
    },
    {
      ...fallbackSections[4],
      subtitle:
        formatReviewDetailRating('comfort', review.ratingComfort, locale) ??
        fallbackSections[4].subtitle,
    },
  ] as const
}

export function ParkingReviewDetailsPanel({
  onBack,
  onClose,
  onDelete,
  review,
}: ParkingReviewDetailsPanelProps) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeletingReview, setIsDeletingReview] = useState(false)
  const authorName = review.authorName?.trim() || messages.anonymousUser
  const comment = review.comment?.trim() || messages.noComment
  const sections = getReviewSections(review, locale)

  return (
    <aside className="pointer-events-auto flex h-full w-full max-w-[24.5rem] flex-col overflow-hidden rounded-none border-r border-border bg-surface-muted shadow-[0_16px_40px_rgb(0_0_0_/_0.08)] md:max-w-[24.5rem]">
      <div className="px-6 pt-6">
        <div className="flex h-10 items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <button
              aria-label={messages.close}
              className="flex size-10 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              onClick={onBack}
              type="button"
            >
              <img alt="" aria-hidden="true" className="size-6" src={arrowIcon} />
            </button>
            <h2 className="font-heading text-xl leading-7 font-normal text-text-primary">
              {messages.reviews}
            </h2>
          </div>

          <button
            aria-label={messages.close}
            className="flex size-10 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-6">
          <div className="p-4">
            <div className="flex h-10 items-center gap-2">
              <h3 className="font-heading text-base leading-5 font-medium text-text-primary">
                {authorName}
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {sections.map((section) => (
              <ReviewBadgeCard
                icon={section.icon}
                key={section.title}
                subtitle={section.subtitle}
                title={section.title}
              />
            ))}

            <ReviewCommentCard
              comment={comment}
              icon={commentIcon}
              title={messages.comment}
            />

            {review.photos.length > 0 ? (
              <ReviewPhotosCard photos={review.photos} title={messages.photo} />
            ) : null}
          </div>

          <button
            className={cn(
              'flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-surface px-6 font-heading text-base leading-6 font-medium text-text-primary shadow-card transition hover:bg-surface-muted',
            )}
            onClick={() => {
              setDeleteError(null)
              setIsDeleteDialogOpen(true)
            }}
            type="button"
          >
            <img alt="" aria-hidden="true" className="size-6 shrink-0" src={trashIcon} />
            <span>{messages.delete}</span>
          </button>
        </div>
      </div>

      {isDeleteDialogOpen ? (
        <ParkingReviewDeleteDialog
          error={deleteError}
          isDeleting={isDeletingReview}
          locale={locale}
          onCancel={() => {
            setDeleteError(null)
            setIsDeleteDialogOpen(false)
          }}
          onConfirm={async () => {
            if (isDeletingReview) {
              return
            }

            setIsDeletingReview(true)
            setDeleteError(null)

            try {
              await onDelete?.()
              setIsDeleteDialogOpen(false)
            } catch (error) {
              setDeleteError(
                error instanceof Error ? error.message : messages.unableToDeleteReview,
              )
            } finally {
              setIsDeletingReview(false)
            }
          }}
        />
      ) : null}
    </aside>
  )
}
