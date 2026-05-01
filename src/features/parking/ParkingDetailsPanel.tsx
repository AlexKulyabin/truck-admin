import { Star } from 'lucide-react'
import { useMemo, useRef, useState, type PointerEvent } from 'react'
import parkingDetailHero from '../../assets/parking-detail-hero.svg'
import arrowIcon from '../../assets/icons/arrow.svg'
import capasityIcon from '../../assets/icons/capasity.svg'
import editIcon from '../../assets/icons/edit.svg'
import gasStationIcon from '../../assets/icons/gas-station.svg'
import hotelIcon from '../../assets/icons/hotel.svg'
import laundryIcon from '../../assets/icons/laundry.svg'
import locationIcon from '../../assets/icons/location.svg'
import ratingIcon from '../../assets/icons/rating.svg'
import recreationAreaIcon from '../../assets/icons/recreation-area.svg'
import shopIcon from '../../assets/icons/shop.svg'
import showerIcon from '../../assets/icons/shower.svg'
import trashIcon from '../../assets/icons/trash.svg'
import { ParkingReviewCard } from './ParkingReviewCard'
import { useParkingAuthor } from '../../hooks/useParkingAuthor'
import { useParkingPhotos } from '../../hooks/useParkingPhotos'
import { useParkingReviews } from '../../hooks/useParkingReviews'
import { cn } from '../../lib/cn'
import type {
  ParkingMapItem,
  ParkingPhoto,
  ParkingRatingSummary,
  ParkingReview,
} from '../../types/parking'

type ParkingDetailsPanelProps = {
  onClose: () => void
  parking: ParkingMapItem
}

type DetailTabId = 'complaints' | 'info' | 'photo' | 'reviews'

type DetailTab = {
  count?: number
  id: DetailTabId
  label: string
}

type ServiceItem = {
  icon: string
  id: string
  label: string
}

type ParkingDetailModel = {
  capacity: number
  complaintsCount: number
  ratingLabel: string
  services: ServiceItem[]
}

const ALL_SERVICES: ServiceItem[] = [
  { icon: gasStationIcon, id: 'gas', label: 'Gas station' },
  { icon: showerIcon, id: 'shower', label: 'Shower' },
  { icon: laundryIcon, id: 'laundry', label: 'Laundry' },
  { icon: hotelIcon, id: 'hotel', label: 'Hotel' },
  { icon: shopIcon, id: 'shop', label: 'Shop' },
  { icon: recreationAreaIcon, id: 'recreation', label: 'Recreation area' },
]

function hashString(value: string) {
  let hash = 0

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) % 100000
  }

  return hash
}

function formatRating(value: number | null, fallbackSeed: number) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toFixed(1)
  }

  return (4 + (fallbackSeed % 11) / 10).toFixed(1)
}

function buildParkingDetailModel(parking: ParkingMapItem): ParkingDetailModel {
  const seed = hashString(parking.id)
  const complaintsCount = seed % 4
  const activeServices = ALL_SERVICES.filter((_, index) => {
    return ((seed >> index) & 1) === 1
  })

  return {
    capacity: 40 + (seed % 13) * 10,
    complaintsCount,
    ratingLabel: formatRating(parking.rating, seed),
    services: activeServices.length >= 3 ? activeServices : ALL_SERVICES.slice(0, 4),
  }
}

function buildTabs(reviewCount: number, complaintsCount: number, photosCount: number): DetailTab[] {
  return [
    { id: 'info', label: 'Info' },
    { count: reviewCount, id: 'reviews', label: 'Reviews' },
    { count: photosCount, id: 'photo', label: 'Photo' },
    { count: complaintsCount, id: 'complaints', label: 'Complaints' },
  ]
}

function formatSummaryRating(value: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0,0'
  }

  return value.toFixed(1).replace('.', ',')
}

function renderCompactStars(count: number) {
  return Array.from({ length: count }).map((_, index) => (
    <Star className="size-2.5 fill-warning text-warning" key={`compact-star-${count}-${index}`} />
  ))
}

function InfoCard({
  icon,
  subtitle,
  title,
  subtitleClassName,
  titleClassName,
}: {
  icon: string
  subtitle?: string
  subtitleClassName?: string
  title?: string
  titleClassName?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-[10px] bg-surface px-4 py-4 shadow-card">
      <img alt="" aria-hidden="true" className="size-[1.875rem] shrink-0" src={icon} />
      <span className="min-w-0">
        {title ? (
          <span
            className={cn(
              'block truncate text-base font-medium text-text-primary',
              titleClassName,
            )}
          >
            {title}
          </span>
        ) : null}
        {subtitle ? (
          <span
            className={cn('block text-sm text-text-secondary', subtitleClassName)}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </div>
  )
}

function TabButton({
  count,
  isActive,
  label,
  onClick,
}: {
  count?: number
  isActive: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition',
        isActive
          ? 'bg-surface font-medium text-text-primary shadow-card'
          : 'font-normal text-text-secondary hover:bg-surface/70',
      )}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      {typeof count === 'number' ? (
        <span className="flex min-w-6 items-center justify-center rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-primary shadow-card">
          {count}
        </span>
      ) : null}
    </button>
  )
}

function ReviewSummary({
  summary,
}: {
  summary: ParkingRatingSummary
}) {
  const maxStarCount = useMemo(() => {
    return Math.max(...Object.values(summary.starCounts), 0)
  }, [summary.starCounts])

  const ratingRows = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = summary.starCounts[stars as 1 | 2 | 3 | 4 | 5]

      return {
        stars,
        width: maxStarCount > 0 ? (count / maxStarCount) * 100 : 0,
      }
    })
  }, [maxStarCount, summary.starCounts])

  return (
    <section className="flex items-center gap-6 px-6 py-4">
      <div className="w-24 shrink-0">
        <div className="font-heading text-5xl leading-10 font-normal text-text-primary">
          {formatSummaryRating(summary.averageRating)}
        </div>
        <div className="mt-2 whitespace-nowrap text-sm text-text-secondary">
          {summary.reviewsCount} reviews
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        {ratingRows.map((row) => (
          <div className="grid grid-cols-[4.125rem_minmax(0,1fr)] items-center gap-[16px]" key={`summary-row-${row.stars}`}>
            <div className="flex items-center gap-1">
              {renderCompactStars(row.stars)}
            </div>
            <div className="h-1 w-full overflow-hidden rounded-lg bg-[#E9E9E9]">
              <div
                className="h-full rounded-full bg-warning transition-[width]"
                style={{ width: `${row.width}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ReviewsContent({
  isLoading,
  reviews,
  summary,
}: {
  isLoading: boolean
  reviews: ParkingReview[]
  summary: ParkingRatingSummary
}) {
  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-surface px-4 py-5 text-sm text-text-secondary shadow-card">
        Loading reviews...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ReviewSummary summary={summary} />

      <section className="space-y-4">
        <h3 className="text-[20px] leading-[20px] font-medium text-text-primary">
          All reviews
        </h3>

        {summary.reviewsCount === 0 ? (
          <div className="rounded-[10px] bg-surface px-4 py-5 text-sm text-text-secondary shadow-card">
            No reviews for this parking yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ParkingReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function PhotosContent({
  isLoading,
  photos,
}: {
  isLoading: boolean
  photos: ParkingPhoto[]
}) {
  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-surface px-4 py-5 text-sm text-text-secondary shadow-card">
        Loading photos...
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="rounded-[10px] bg-surface px-4 py-5 text-sm text-text-secondary shadow-card">
        No photos for this parking yet.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {photos.map((photo, index) => (
        <div
          className="overflow-hidden rounded-[10px] bg-surface shadow-card"
          key={photo.id}
        >
          <img
            alt={`Parking photo ${index + 1}`}
            className="aspect-[4/3] w-full object-cover"
            src={photo.url}
          />
        </div>
      ))}
    </div>
  )
}

function ComplaintsContent({ count }: { count: number }) {
  if (count === 0) {
    return (
      <div className="rounded-[10px] bg-surface px-4 py-5 text-sm text-text-secondary shadow-card">
        No active complaints for this parking.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="rounded-[10px] bg-surface px-4 py-3 shadow-card"
          key={`complaint-${index}`}
        >
          <div className="mb-1 text-sm font-medium text-text-primary">
            Complaint #{index + 1}
          </div>
          <p className="m-0 text-sm text-text-secondary">
            Access road needs attention after heavy traffic.
          </p>
        </div>
      ))}
    </div>
  )
}

export function ParkingDetailsPanel({
  onClose,
  parking,
}: ParkingDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTabId>('info')
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [isTabsDragging, setIsTabsDragging] = useState(false)
  const dragStateRef = useRef({
    hasMoved: false,
    pointerId: null as number | null,
    scrollLeft: 0,
    startX: 0,
  })
  const tabsScrollRef = useRef<HTMLDivElement | null>(null)
  const { author, isLoading: isAuthorLoading } = useParkingAuthor(parking.id)
  const { isLoading: isPhotosLoading, photos } = useParkingPhotos(parking.id)
  const { isLoading: isReviewsLoading, reviews, summary: reviewSummary } =
    useParkingReviews(parking.id)
  const detail = buildParkingDetailModel(parking)
  const tabs = buildTabs(
    reviewSummary.reviewsCount,
    detail.complaintsCount,
    photos.length,
  )
  const title = parking.address ?? 'Unnamed parking'
  const heroPhotos = photos.length > 0 ? photos : [{ id: 'fallback', url: parkingDetailHero }]
  const activeHeroPhoto = heroPhotos[Math.min(activePhotoIndex, heroPhotos.length - 1)]
  const authorName =
    author.fullName?.trim() ||
    '\u0423\u0434\u0430\u043b\u0435\u043d\u043d\u044b\u0439 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c'
  const authorInitial = authorName.charAt(0).toUpperCase()

  function handleTabsPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (
      event.button !== 0 ||
      !tabsScrollRef.current ||
      event.target instanceof Element && event.target.closest('button')
    ) {
      return
    }

    dragStateRef.current = {
      hasMoved: false,
      pointerId: event.pointerId,
      scrollLeft: tabsScrollRef.current.scrollLeft,
      startX: event.clientX,
    }

    setIsTabsDragging(true)
    tabsScrollRef.current.setPointerCapture(event.pointerId)
  }

  function handleTabsPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (
      !isTabsDragging ||
      !tabsScrollRef.current ||
      dragStateRef.current.pointerId !== event.pointerId
    ) {
      return
    }

    const deltaX = event.clientX - dragStateRef.current.startX
    if (Math.abs(deltaX) > 4) {
      dragStateRef.current.hasMoved = true
    }
    tabsScrollRef.current.scrollLeft = dragStateRef.current.scrollLeft - deltaX
  }

  function finishTabsDragging(pointerId: number) {
    if (dragStateRef.current.pointerId !== pointerId) {
      return
    }

    setIsTabsDragging(false)
    dragStateRef.current.pointerId = null
  }

  function goToNextPhoto() {
    setActivePhotoIndex((currentIndex) => (currentIndex + 1) % heroPhotos.length)
  }

  function goToPreviousPhoto() {
    setActivePhotoIndex((currentIndex) => {
      return (currentIndex - 1 + heroPhotos.length) % heroPhotos.length
    })
  }

  return (
    <aside className="pointer-events-auto flex h-full w-full max-w-[28rem] flex-col overflow-hidden rounded-none bg-surface-muted shadow-[0_16px_40px_rgb(0_0_0_/_0.08)] md:max-w-[28rem] md:border-r md:border-border">
      <div className="relative">
        <img
          alt={title}
          className="h-64 w-full object-cover md:h-[21.25rem]"
          src={activeHeroPhoto.url}
        />
        <button
          aria-label="Close parking details"
          className="absolute left-5 top-5 flex size-12 items-center justify-center rounded-2xl bg-surface text-text-primary shadow-card transition hover:bg-surface-muted"
          onClick={onClose}
          type="button"
        >
          <img alt="" aria-hidden="true" className="size-6" src={arrowIcon} />
        </button>
        {heroPhotos.length > 1 ? (
          <>
            <button
              aria-label="Previous parking photo"
              className="absolute left-5 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/92 text-text-primary shadow-card transition hover:bg-surface"
              onClick={goToPreviousPhoto}
              type="button"
            >
              <img alt="" aria-hidden="true" className="size-5" src={arrowIcon} />
            </button>
            <button
              aria-label="Next parking photo"
              className="absolute right-5 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/92 text-text-primary shadow-card transition hover:bg-surface"
              onClick={goToNextPhoto}
              type="button"
            >
              <img
                alt=""
                aria-hidden="true"
                className="size-5 scale-x-[-1]"
                src={arrowIcon}
              />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 backdrop-blur-sm">
              {heroPhotos.map((photo, index) => (
                <button
                  aria-label={`Open parking photo ${index + 1}`}
                  className={cn(
                    'size-2.5 rounded-full transition',
                    index === activePhotoIndex ? 'bg-white' : 'bg-white/45',
                  )}
                  key={photo.id}
                  onClick={() => setActivePhotoIndex(index)}
                  type="button"
                />
              ))}
            </div>
          </>
        ) : null}
        {isPhotosLoading ? (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent px-5 py-4 text-sm text-white">
            Loading photos...
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex items-center gap-4 py-4">
          {author.avatarUrl ? (
            <img
              alt={authorName}
              className="size-10 shrink-0 rounded-full object-cover"
              src={author.avatarUrl}
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E6DBFF] font-heading text-base font-medium text-[#5B41A8]">
              {authorInitial}
            </span>
          )}
          <span className="font-heading text-[16px] leading-6 font-medium text-on-surface">
            {isAuthorLoading ? 'Loading...' : authorName}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-surface text-sm font-medium text-text-primary shadow-card transition hover:bg-[#FFF4F4]"
            type="button"
          >
            <img alt="" aria-hidden="true" className="size-5" src={trashIcon} />
            <span>Delete</span>
          </button>
          <button
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-white shadow-card transition hover:bg-primary-dark"
            type="button"
          >
            <img alt="" aria-hidden="true" className="size-5" src={editIcon} />
            <span>Edit</span>
          </button>
        </div>

        <div
          className={cn(
            '-mx-6 overflow-x-auto py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
            isTabsDragging ? 'cursor-grabbing select-none' : 'cursor-grab',
          )}
          onPointerCancel={(event) => finishTabsDragging(event.pointerId)}
          onPointerDown={handleTabsPointerDown}
          onPointerMove={handleTabsPointerMove}
          onPointerUp={(event) => finishTabsDragging(event.pointerId)}
          ref={tabsScrollRef}
        >
          <div className="flex min-w-max gap-1 px-6 whitespace-nowrap">
            {tabs.map((tab) => (
              <TabButton
                count={tab.count}
                isActive={activeTab === tab.id}
                key={tab.id}
                label={tab.label}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </div>

        {activeTab === 'info' ? (
          <div className="space-y-4">
            <InfoCard
              icon={locationIcon}
              subtitle={title}
              subtitleClassName="overflow-hidden font-heading text-[15px] leading-[18px] font-normal text-text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
            />
            <InfoCard
              icon={ratingIcon}
              subtitle={`${reviewSummary.reviewsCount} reviews`}
              title={
                reviewSummary.averageRating
                  ? reviewSummary.averageRating.toFixed(1)
                  : detail.ratingLabel
              }
            />
            <InfoCard
              icon={capasityIcon}
              subtitle={`${detail.capacity} spots`}
              title="Capacity"
            />

            <section className="rounded-[10px] bg-surface px-4 py-4 shadow-card">
              <h3 className="mb-3 text-base font-medium text-text-primary">
                Additional services
              </h3>
              <div className="space-y-3">
                {detail.services.map((service) => (
                  <div className="flex items-center gap-4" key={service.id}>
                    <img
                      alt=""
                      aria-hidden="true"
                      className="size-6"
                      src={service.icon}
                    />
                    <span className="text-base text-text-primary">
                      {service.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {activeTab === 'reviews' ? (
          <ReviewsContent
            isLoading={isReviewsLoading}
            reviews={reviews}
            summary={reviewSummary}
          />
        ) : null}
        {activeTab === 'photo' ? (
          <PhotosContent isLoading={isPhotosLoading} photos={photos} />
        ) : null}
        {activeTab === 'complaints' ? (
          <ComplaintsContent count={detail.complaintsCount} />
        ) : null}
      </div>
    </aside>
  )
}
