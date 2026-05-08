import { CameraOff, Star } from 'lucide-react'
import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent,
  useMemo,
  useRef,
  useState,
} from 'react'
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
import {
  formatSpotsCount,
  formatReviewCount,
  getParkingMessages,
  type SupportedLocale,
} from '../../constants/parkingI18n'
import { ParkingComplaintCard } from './ParkingComplaintCard'
import { ParkingReviewCard } from './ParkingReviewCard'
import { useParkingAuthor } from '../../hooks/useParkingAuthor'
import { useParkingComplaints } from '../../hooks/useParkingComplaints'
import { useParkingDetails } from '../../hooks/useParkingDetails'
import { useParkingPhotos } from '../../hooks/useParkingPhotos'
import { useParkingReviews } from '../../hooks/useParkingReviews'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import { cn } from '../../lib/cn'
import type {
  ParkingAuthor,
  ParkingComplaint,
  ParkingDetailItem,
  ParkingPhoto,
  ParkingRatingSummary,
  ParkingReview,
} from '../../types/parking'

type ParkingDetailsPanelProps = {
  isUpdatingStatus?: boolean
  mode?: 'default' | 'request'
  onApprove?: () => void
  onClose: () => void
  onEdit: (_parking: ParkingDetailItem) => void
  onDelete?: () => void
  onReject?: () => void
  onOpenComplaintDetails?: (_complaint: ParkingComplaint) => void
  onOpenAuthorProfile?: (_author: ParkingAuthor) => void
  onOpenReviewDetails?: (_review: ParkingReview) => void
  parking: ParkingDetailItem
  refreshKey?: number
  statusError?: string | null
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
}

type ParkingDetailModel = {
  capacity: number
  ratingLabel: string
  services: ServiceItem[]
}

const ALL_SERVICES: ServiceItem[] = [
  { icon: gasStationIcon, id: 'gas' },
  { icon: showerIcon, id: 'shower' },
  { icon: laundryIcon, id: 'laundry' },
  { icon: hotelIcon, id: 'hotel' },
  { icon: shopIcon, id: 'shop' },
  { icon: recreationAreaIcon, id: 'recreation' },
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

function buildParkingDetailModel(parking: ParkingDetailItem): ParkingDetailModel {
  const seed = hashString(parking.id)
  const activeServices = ALL_SERVICES.filter((_, index) => {
    return ((seed >> index) & 1) === 1
  })

  return {
    capacity: 40 + (seed % 13) * 10,
    ratingLabel: formatRating(parking.rating, seed),
    services: activeServices.length >= 3 ? activeServices : ALL_SERVICES.slice(0, 4),
  }
}

function buildParkingDetailModelFromRecord(
  parking: ParkingDetailItem,
  record: {
    has_gas_station: boolean
    has_hotel: boolean
    has_laundry: boolean
    has_recreation_area: boolean
    has_shop: boolean
    has_shower: boolean
    rating: number | null
    total_spaces: number | null
  } | null,
): ParkingDetailModel {
  if (!record) {
    return buildParkingDetailModel(parking)
  }

  const services = ALL_SERVICES.filter((service) => {
    switch (service.id) {
      case 'gas':
        return record.has_gas_station
      case 'hotel':
        return record.has_hotel
      case 'laundry':
        return record.has_laundry
      case 'recreation':
        return record.has_recreation_area
      case 'shop':
        return record.has_shop
      case 'shower':
        return record.has_shower
      default:
        return false
    }
  })

  return {
    capacity: record.total_spaces ?? 0,
    ratingLabel: formatRating(record.rating ?? parking.rating, hashString(parking.id)),
    services: services.length > 0 ? services : [],
  }
}

function buildLocalizedTabs(
  reviewCount: number,
  complaintsCount: number,
  photosCount: number,
  locale: SupportedLocale,
): DetailTab[] {
  const messages = getParkingMessages(locale)

  return [
    { id: 'info', label: messages.info },
    { count: reviewCount, id: 'reviews', label: messages.reviews },
    { count: photosCount, id: 'photo', label: messages.photo },
    { count: complaintsCount, id: 'complaints', label: messages.complaints },
  ]
}

function getLocalizedServiceLabel(serviceId: string, locale: SupportedLocale) {
  const labels = {
    en: {
      gas: 'Gas station',
      hotel: 'Hotel',
      laundry: 'Laundry',
      recreation: 'Recreation area',
      shop: 'Shop',
      shower: 'Shower',
    },
    ru: {
      gas: 'Заправка',
      hotel: 'Отель',
      laundry: 'Прачечная',
      recreation: 'Зона отдыха',
      shop: 'Магазин',
      shower: 'Душ',
    },
  } as const

  const localizedLabels = labels[locale]
  return localizedLabels[serviceId as keyof typeof localizedLabels] ?? serviceId
}

function formatSummaryRating(value: number | null, locale: SupportedLocale) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return locale === 'ru' ? '0,0' : '0.0'
  }

  return value.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })
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
              'block truncate font-heading text-base font-medium text-text-primary',
              titleClassName,
            )}
          >
            {title}
          </span>
        ) : null}
        {subtitle ? (
          <span
            className={cn('block font-heading text-sm text-text-secondary', subtitleClassName)}
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
        'inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 font-heading text-sm transition',
        isActive
          ? 'bg-surface font-medium text-text-primary shadow-card'
          : 'font-normal text-text-secondary hover:bg-surface/70',
      )}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      {typeof count === 'number' ? (
        <span className="flex min-w-6 items-center justify-center rounded-md bg-surface px-2 py-0.5 font-heading text-xs font-medium text-primary shadow-card">
          {count}
        </span>
      ) : null}
    </button>
  )
}

function ReviewSummary({
  locale,
  summary,
}: {
  locale: SupportedLocale
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
          {formatSummaryRating(summary.averageRating, locale)}
        </div>
        <div className="mt-2 whitespace-nowrap font-heading text-sm font-normal text-text-secondary">
          {formatReviewCount(summary.reviewsCount, locale)}
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
  locale,
  onOpenReviewDetails,
  reviews,
  summary,
}: {
  isLoading: boolean
  onOpenReviewDetails?: (_review: ParkingReview) => void
  locale: SupportedLocale
  reviews: ParkingReview[]
  summary: ParkingRatingSummary
}) {
  const messages = getParkingMessages(locale)

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
        {messages.loadingReviews}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ReviewSummary locale={locale} summary={summary} />

      <section className="space-y-4">
        <h3 className="font-heading text-[20px] leading-[20px] font-medium text-text-primary">
          {messages.allReviews}
        </h3>

        {summary.reviewsCount === 0 ? (
          <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
            {messages.noReviews}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ParkingReviewCard
                actionDetailsLabel={messages.details}
                key={review.id}
                onDetails={
                  onOpenReviewDetails ? () => onOpenReviewDetails(review) : undefined
                }
                review={review}
                showActions
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function PhotosContent({
  isLoading,
  locale,
  photos,
}: {
  isLoading: boolean
  locale: SupportedLocale
  photos: ParkingPhoto[]
}) {
  const messages = getParkingMessages(locale)

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
        {messages.loadingPhotos}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
        {messages.noPhotos}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-0.5 overflow-hidden">
      {photos.map((photo, index) => (
        <div
          className="aspect-square overflow-hidden bg-surface"
          key={photo.id}
        >
          <img
            alt={`Parking photo ${index + 1}`}
            className="h-full w-full object-cover"
            src={photo.url}
          />
        </div>
      ))}
    </div>
  )
}

function ComplaintsContent({
  complaints,
  isLoading,
  locale,
  onOpenComplaintDetails,
}: {
  complaints: ParkingComplaint[]
  isLoading: boolean
  locale: SupportedLocale
  onOpenComplaintDetails?: (_complaint: ParkingComplaint) => void
}) {
  const messages = getParkingMessages(locale)

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
        {messages.loadingComplaints}
      </div>
    )
  }

  return (
    <div className="space-y-4 py-2">
      <section className="space-y-4">
        <h3 className="px-4 font-heading text-base leading-5 font-medium text-text-primary">
          {messages.allComplaints}
        </h3>

        {complaints.length === 0 ? (
          <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
            {messages.noComplaints}
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <ParkingComplaintCard
                actionDetailsLabel={messages.details}
                complaint={complaint}
                key={complaint.id}
                onDetails={
                  onOpenComplaintDetails
                    ? () => onOpenComplaintDetails(complaint)
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export function ParkingDetailsPanel({
  isUpdatingStatus = false,
  mode = 'default',
  onApprove,
  onClose,
  onEdit,
  onDelete,
  onOpenComplaintDetails,
  onReject,
  onOpenAuthorProfile,
  parking,
  refreshKey = 0,
  statusError = null,
}: ParkingDetailsPanelProps) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const [activeTab, setActiveTab] = useState<DetailTabId>('info')
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [heroDragOffset, setHeroDragOffset] = useState(0)
  const [isHeroDragging, setIsHeroDragging] = useState(false)
  const [isTabsDragging, setIsTabsDragging] = useState(false)
  const heroDragStateRef = useRef({
    currentOffset: 0,
    inputType: null as 'mouse' | 'pointer' | null,
    pointerId: null as number | null,
    startOffset: 0,
    startX: 0,
  })
  const dragStateRef = useRef({
    hasMoved: false,
    pointerId: null as number | null,
    scrollLeft: 0,
    startX: 0,
  })
  const tabsScrollRef = useRef<HTMLDivElement | null>(null)
  const { author, isLoading: isAuthorLoading } = useParkingAuthor(parking.id)
  const { details: parkingDetails } = useParkingDetails(parking.id)
  const { complaints, isLoading: isComplaintsLoading } =
    useParkingComplaints(parking.id)
  const { isLoading: isPhotosLoading, photos } = useParkingPhotos(parking.id)
  const { isLoading: isReviewsLoading, reviews, summary: reviewSummary } =
    useParkingReviews(parking.id, refreshKey)
  const detail = buildParkingDetailModelFromRecord(parking, parkingDetails)
  const tabs = buildLocalizedTabs(
    reviewSummary.reviewsCount,
    complaints.length,
    photos.length,
    locale,
  )
  const title = parkingDetails?.address ?? parking.address ?? messages.noAddress
  const hasHeroPhotos = photos.length > 0
  const heroPhotos = hasHeroPhotos ? photos : []
  const currentPhotoIndex = hasHeroPhotos
    ? activePhotoIndex % heroPhotos.length
    : 0
  const activeHeroPhoto = hasHeroPhotos ? heroPhotos[currentPhotoIndex] : null
  const canDragHeroPhotos = heroPhotos.length > 1
  const authorName = author.fullName?.trim() || messages.anonymousUser
  const authorInitial = authorName.charAt(0).toUpperCase()
  const canOpenAuthorProfile = Boolean(author.id && onOpenAuthorProfile)

  function cleanupHeroMouseListeners() {
    window.removeEventListener('mousemove', handleHeroMouseMove)
    window.removeEventListener('mouseup', handleHeroMouseUp)
  }

  function finishHeroDragging(pointerId: number | null) {
    if (heroDragStateRef.current.pointerId !== pointerId) {
      return
    }

    const deltaX = heroDragStateRef.current.currentOffset - heroDragStateRef.current.startOffset
    const threshold = 80

    if (deltaX > threshold) {
      setActivePhotoIndex((currentIndex) => {
        if (heroPhotos.length === 0) {
          return 0
        }

        return (currentIndex - 1 + heroPhotos.length) % heroPhotos.length
      })
    } else if (deltaX < -threshold) {
      setActivePhotoIndex((currentIndex) => {
        if (heroPhotos.length === 0) {
          return 0
        }

        return (currentIndex + 1) % heroPhotos.length
      })
    }

    setHeroDragOffset(0)
    setIsHeroDragging(false)
    if (heroDragStateRef.current.inputType === 'mouse') {
      cleanupHeroMouseListeners()
    }
    heroDragStateRef.current.pointerId = null
    heroDragStateRef.current.inputType = null
  }

  function handleHeroPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (
      event.button !== 0 ||
      !canDragHeroPhotos ||
      event.target instanceof Element && event.target.closest('button')
    ) {
      return
    }

    heroDragStateRef.current = {
      currentOffset: 0,
      inputType: 'pointer',
      pointerId: event.pointerId,
      startOffset: 0,
      startX: event.clientX,
    }
    setIsHeroDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleHeroPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (
      !isHeroDragging ||
      heroDragStateRef.current.pointerId !== event.pointerId ||
      !canDragHeroPhotos
    ) {
      return
    }

    const deltaX = event.clientX - heroDragStateRef.current.startX
    const nextOffset = Math.max(-220, Math.min(220, deltaX))
    heroDragStateRef.current.currentOffset = nextOffset
    setHeroDragOffset(nextOffset)
  }

  function handleHeroMouseDown(event: ReactMouseEvent<HTMLDivElement>) {
    if (
      event.button !== 0 ||
      !canDragHeroPhotos ||
      heroDragStateRef.current.inputType !== null ||
      event.target instanceof Element && event.target.closest('button')
    ) {
      return
    }

    heroDragStateRef.current = {
      currentOffset: 0,
      inputType: 'mouse',
      pointerId: -1,
      startOffset: 0,
      startX: event.clientX,
    }
    setIsHeroDragging(true)
    window.addEventListener('mousemove', handleHeroMouseMove)
    window.addEventListener('mouseup', handleHeroMouseUp)
  }

  function handleHeroMouseMove(event: MouseEvent) {
    if (
      !isHeroDragging ||
      heroDragStateRef.current.inputType !== 'mouse' ||
      !canDragHeroPhotos
    ) {
      return
    }

    const deltaX = event.clientX - heroDragStateRef.current.startX
    const nextOffset = Math.max(-220, Math.min(220, deltaX))
    heroDragStateRef.current.currentOffset = nextOffset
    setHeroDragOffset(nextOffset)
  }

  function handleHeroMouseUp() {
    if (heroDragStateRef.current.inputType !== 'mouse') {
      return
    }

    finishHeroDragging(heroDragStateRef.current.pointerId)
    cleanupHeroMouseListeners()
  }

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

  function handleHeroPointerUp(event: PointerEvent<HTMLDivElement>) {
    finishHeroDragging(event.pointerId)
  }

  function goToNextPhoto() {
    setHeroDragOffset(0)
    setActivePhotoIndex((currentIndex) => (currentIndex + 1) % heroPhotos.length)
  }

  function goToPreviousPhoto() {
    setHeroDragOffset(0)
    setActivePhotoIndex((currentIndex) => {
      return (currentIndex - 1 + heroPhotos.length) % heroPhotos.length
    })
  }

  return (
    <aside className="pointer-events-auto flex h-full w-full max-w-[28rem] flex-col overflow-hidden rounded-none bg-surface-muted shadow-[0_16px_40px_rgb(0_0_0_/_0.08)] md:max-w-[28rem] md:border-r md:border-border">
      <div
        className={cn(
          'relative isolate pointer-events-auto select-none touch-none',
          canDragHeroPhotos
            ? isHeroDragging
              ? 'cursor-grabbing select-none'
              : 'cursor-grab'
            : '',
        )}
        onPointerCancel={(event) => finishHeroDragging(event.pointerId)}
        onPointerDown={handleHeroPointerDown}
        onPointerMove={handleHeroPointerMove}
        onPointerUp={handleHeroPointerUp}
        onMouseDown={handleHeroMouseDown}
      >
        {activeHeroPhoto ? (
          <div className="relative h-64 w-full overflow-hidden md:h-[21.25rem]">
            <div
              className={cn(
                'flex h-full w-full',
                canDragHeroPhotos ? 'transition-transform duration-200 ease-out' : '',
              )}
              style={{
                transform: `translate3d(calc(${-currentPhotoIndex * 100}% + ${heroDragOffset}px), 0, 0)`,
                transition: isHeroDragging ? 'none' : undefined,
              }}
            >
              {heroPhotos.map((photo, index) => (
                <img
                  alt={`${title} ${index + 1}`}
                  className="pointer-events-none h-full w-full shrink-0 object-cover"
                  key={photo.id}
                  draggable={false}
                  src={photo.url}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-64 w-full flex-col items-center justify-center gap-3 bg-[#F3F4F6] text-[#9CA3AF] md:h-[21.25rem]">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#E5E7EB]">
              <CameraOff aria-hidden="true" className="size-8 stroke-[1.75]" />
            </span>
            <span className="font-heading text-sm font-medium tracking-tight">
              {messages.noPhoto}
            </span>
          </div>
        )}
        <button
          aria-label={messages.close}
          className="absolute left-5 top-5 flex size-12 items-center justify-center rounded-2xl bg-surface text-text-primary shadow-card transition hover:bg-surface-muted"
          onClick={onClose}
          type="button"
        >
          <img alt="" aria-hidden="true" className="size-6" src={arrowIcon} />
        </button>
        {heroPhotos.length > 1 ? (
          <>
            <button
              aria-label={messages.photo}
              className="absolute left-5 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/92 text-text-primary shadow-card transition hover:bg-surface active:scale-95 pointer-events-auto cursor-pointer"
              onClick={goToPreviousPhoto}
              type="button"
            >
              <img alt="" aria-hidden="true" className="size-5" src={arrowIcon} />
            </button>
            <button
              aria-label={messages.photo}
              className="absolute right-5 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/92 text-text-primary shadow-card transition hover:bg-surface active:scale-95 pointer-events-auto cursor-pointer"
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
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 backdrop-blur-sm pointer-events-auto">
              {heroPhotos.map((photo, index) => (
                <button
                  aria-label={`${messages.photo} ${index + 1}`}
                  className={cn(
                    'size-2.5 rounded-full transition pointer-events-auto cursor-pointer',
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/45',
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
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent px-5 py-4 text-sm text-white">
            {messages.loadingPhotos}
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="py-4">
          <button
            className={cn(
              'flex items-center gap-4 rounded-xl text-left transition',
              canOpenAuthorProfile
                ? 'px-2 py-2 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30'
                : 'cursor-default px-2 py-2',
            )}
            disabled={!canOpenAuthorProfile}
            onClick={() => {
              if (author.id && onOpenAuthorProfile) {
                onOpenAuthorProfile(author)
              }
            }}
            type="button"
          >
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
              {isAuthorLoading ? messages.loading : authorName}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {mode === 'request' ? (
            <>
              <button
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-surface text-sm font-medium text-text-primary shadow-card transition hover:bg-[#FFF4F4] disabled:opacity-50"
                disabled={isUpdatingStatus}
                onClick={onReject}
                type="button"
              >
                <span>{messages.rejectRequest}</span>
              </button>
              <button
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-white shadow-card transition hover:bg-primary-dark disabled:opacity-50"
                disabled={isUpdatingStatus}
                onClick={onApprove}
                type="button"
              >
                <span>{messages.approveRequest}</span>
              </button>
            </>
          ) : (
            <>
              <button
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-surface text-sm font-medium text-text-primary shadow-card transition hover:bg-[#FFF4F4] disabled:opacity-50"
                disabled={!onDelete}
                onClick={onDelete}
                type="button"
              >
                <img alt="" aria-hidden="true" className="size-5" src={trashIcon} />
                <span>{messages.delete}</span>
              </button>
              <button
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-white shadow-card transition hover:bg-primary-dark"
                onClick={() => onEdit(parking)}
                type="button"
              >
                <img alt="" aria-hidden="true" className="size-5" src={editIcon} />
                <span>{messages.edit}</span>
              </button>
            </>
          )}
        </div>
        {statusError ? (
          <p className="pt-2 font-heading text-sm leading-5 text-danger">{statusError}</p>
        ) : null}

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
              subtitle={formatReviewCount(reviewSummary.reviewsCount, locale)}
              title={
                reviewSummary.averageRating
                  ? reviewSummary.averageRating.toFixed(1)
                  : detail.ratingLabel
              }
            />
            <InfoCard
              icon={capasityIcon}
              subtitle={formatSpotsCount(detail.capacity, locale)}
              title={messages.capacity}
            />

            <section className="rounded-[10px] bg-surface px-4 py-4 shadow-card">
              <h3 className="mb-3 font-heading text-base font-medium text-text-primary">
                {messages.additionalServices}
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
                    <span className="font-heading text-base font-normal text-text-primary">
                      {getLocalizedServiceLabel(service.id, locale)}
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
            locale={locale}
            onOpenReviewDetails={onOpenReviewDetails}
            reviews={reviews}
            summary={reviewSummary}
          />
        ) : null}
        {activeTab === 'photo' ? (
          <PhotosContent
            isLoading={isPhotosLoading}
            locale={locale}
            photos={photos}
          />
        ) : null}
        {activeTab === 'complaints' ? (
          <ComplaintsContent
            complaints={complaints}
            isLoading={isComplaintsLoading}
            locale={locale}
            onOpenComplaintDetails={onOpenComplaintDetails}
          />
        ) : null}
      </div>
    </aside>
  )
}
