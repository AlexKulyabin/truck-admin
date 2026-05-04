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
import trashBigIcon from '../../assets/icons/trash-big.svg'
import trashIcon from '../../assets/icons/trash.svg'
import { getParkingMessages, type SupportedLocale } from '../../constants/parkingI18n'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import { cn } from '../../lib/cn'
import type { ParkingReview } from '../../types/parking'

type ParkingReviewDetailsPanelProps = {
  onBack: () => void
  onClose: () => void
  onDelete?: () => void
  review: ParkingReview
}

type ReviewDeleteDialogProps = {
  locale: SupportedLocale
  onCancel: () => void
  onConfirm: () => void
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
        <p className="m-0 font-heading text-base leading-6 font-normal tracking-wide text-text-primary">
          {comment}
        </p>
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

function ReviewDeleteDialog({ locale, onCancel, onConfirm }: ReviewDeleteDialogProps) {
  const messages = getParkingMessages(locale)

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 p-6 backdrop-blur-[3px]">
      <section
        aria-modal="true"
        className="flex w-full max-w-[21.5rem] flex-col items-center gap-6 rounded-xl bg-surface px-4 py-10 shadow-[0_16px_48px_rgb(0_0_0_/_0.18)] sm:px-5"
        role="dialog"
      >
        <img alt="" aria-hidden="true" className="size-20" src={trashBigIcon} />
        <div className="flex w-full max-w-[18.5rem] flex-col items-center gap-2">
          <h2 className="text-center font-heading text-xl leading-7 font-medium text-text-primary">
            {messages.deleteReviewDialogTitle}
          </h2>
          <p className="text-center font-heading text-base leading-5 font-normal text-text-secondary">
            {messages.deleteReviewDialogSubtitle}
          </p>
        </div>
        <div className="flex w-full gap-2">
          <button
            className="flex h-14 flex-1 items-center justify-center rounded-xl bg-[#E5E7EB] px-6 font-heading text-base leading-6 font-medium tracking-tight text-primary transition hover:bg-[#DDE3EA]"
            onClick={onCancel}
            type="button"
          >
            {messages.deleteReviewDialogCancel}
          </button>
          <button
            className="flex h-14 flex-1 items-center justify-center rounded-xl bg-[#FF5F57] px-6 font-heading text-base leading-6 font-medium tracking-tight text-white transition hover:bg-[#f4534b]"
            onClick={onConfirm}
            type="button"
          >
            {messages.deleteReviewDialogConfirm}
          </button>
        </div>
      </section>
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

export function ParkingReviewDetailsPanel({
  onBack,
  onClose,
  onDelete,
  review,
}: ParkingReviewDetailsPanelProps) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const authorName = review.authorName?.trim() || messages.anonymousUser
  const comment = review.comment?.trim() || messages.noComment
  const sections = getReviewDetailSections(locale)

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
        <div className="px-4 py-4">
          <h3 className="font-heading text-base leading-5 font-medium text-text-primary">
            {authorName}
          </h3>
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

          <ReviewPhotosCard photos={review.photos} title={messages.photo} />
        </div>
      </div>

      <div className="px-6 pb-4">
        <button
          className={cn(
            'flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-surface px-6 font-heading text-base leading-6 font-medium text-text-primary shadow-card transition hover:bg-surface-muted',
          )}
          onClick={() => setIsDeleteDialogOpen(true)}
          type="button"
        >
          <img alt="" aria-hidden="true" className="size-6 shrink-0" src={trashIcon} />
          <span>{messages.delete}</span>
        </button>
      </div>

      {isDeleteDialogOpen ? (
        <ReviewDeleteDialog
          locale={locale}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => {
            setIsDeleteDialogOpen(false)
            onDelete?.()
          }}
        />
      ) : null}
    </aside>
  )
}
