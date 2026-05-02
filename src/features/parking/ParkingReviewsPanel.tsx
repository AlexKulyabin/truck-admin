import { X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import arrowIcon from '../../assets/icons/arrow.svg'
import {
  formatCompactCount,
  getParkingMessages,
  type SupportedLocale,
} from '../../constants/parkingI18n'
import { useParkingComplaints } from '../../hooks/useParkingComplaints'
import { useParkingReviewParkings } from '../../hooks/useParkingReviewParkings'
import { useParkingReviews } from '../../hooks/useParkingReviews'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import { cn } from '../../lib/cn'
import type { ParkingListItem } from '../../types/parking'
import { ParkingAddressCard } from './ParkingAddressCard'
import { ParkingComplaintCard } from './ParkingComplaintCard'
import { ParkingListRow } from './ParkingListRow'
import { ParkingReviewCard } from './ParkingReviewCard'
import { ParkingSearchField } from './ParkingSearchField'
import { useParkingAdminPanels } from './useParkingAdminPanels'

type ParkingReviewsPanelProps = {
  onClose: () => void
}

type ParkingFeedTabId = 'complaints' | 'reviews'

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (!error) {
    return fallbackMessage
  }

  return error instanceof Error ? error.message : fallbackMessage
}

function ParkingFeedHeader({
  messages,
  onBack,
  onClose,
}: {
  messages: ReturnType<typeof getParkingMessages>
  onBack: () => void
  onClose: () => void
}) {
  return (
    <div className="flex h-10 items-center justify-between py-2">
      <div className="flex w-full max-w-64 items-center gap-3">
        <button
          aria-label={messages.close}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          onClick={onBack}
          type="button"
        >
          <img alt="" aria-hidden="true" className="size-6" src={arrowIcon} />
        </button>
        <h2 className="truncate font-heading text-[20px] leading-7 font-normal text-text-primary">
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
  )
}

function ParkingFeedTabs({
  activeTab,
  complaintsCount,
  locale,
  messages,
  onChange,
  reviewsCount,
}: {
  activeTab: ParkingFeedTabId
  complaintsCount: number
  locale: SupportedLocale
  messages: ReturnType<typeof getParkingMessages>
  onChange: (_tab: ParkingFeedTabId) => void
  reviewsCount: number
}) {
  const tabs: Array<{ count: number; id: ParkingFeedTabId; label: string }> = [
    { count: reviewsCount, id: 'reviews', label: messages.reviews },
    { count: complaintsCount, id: 'complaints', label: messages.complaints },
  ]

  return (
    <div className="flex items-center gap-2 py-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            className={cn(
              'flex h-10 items-center gap-1.5 rounded-lg px-2 py-1.5 transition focus:outline-none',
              isActive ? 'bg-surface shadow-card' : 'hover:bg-surface/70',
            )}
            key={tab.id}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            <span
              className={cn(
                'pl-2 font-heading text-sm leading-5 tracking-tight',
                isActive
                  ? 'font-medium text-text-primary'
                  : 'font-normal text-text-secondary',
              )}
            >
              {tab.label}
            </span>
            <span className="flex min-w-6 items-center justify-center rounded-md bg-white px-2 font-heading text-sm leading-5 font-normal tracking-tight text-primary">
              {formatCompactCount(tab.count, locale)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function ParkingFeedDetailView({
  locale,
  messages,
  onBackToList,
  onClose,
  parking,
}: {
  locale: SupportedLocale
  messages: ReturnType<typeof getParkingMessages>
  onBackToList: () => void
  onClose: () => void
  parking: ParkingListItem
}) {
  const [activeTab, setActiveTab] = useState<ParkingFeedTabId>('reviews')
  const { complaints, error: complaintsError, isLoading: isComplaintsLoading } =
    useParkingComplaints(parking.id)
  const { error: reviewsError, isLoading: isReviewsLoading, reviews, summary } =
    useParkingReviews(parking.id)

  const isShowingReviews = activeTab === 'reviews'
  const sectionTitle = isShowingReviews ? messages.allReviews : messages.allComplaints

  return (
    <>
      <ParkingFeedHeader
        messages={messages}
        onBack={onBackToList}
        onClose={onClose}
      />

      <div className="flex flex-col gap-6 px-6 pb-6">
        <ParkingAddressCard parking={parking} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <ParkingFeedTabs
          activeTab={activeTab}
          complaintsCount={complaints.length}
          locale={locale}
          messages={messages}
          onChange={setActiveTab}
          reviewsCount={summary.reviewsCount}
        />

        <div className="space-y-4 pb-6">
          <h3 className="font-heading text-base leading-5 font-medium text-text-primary">
            {sectionTitle}
          </h3>

          {isShowingReviews ? (
            isReviewsLoading ? (
              <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
                {messages.loadingReviews}
              </div>
            ) : reviewsError ? (
              <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-danger shadow-card">
                {getErrorMessage(reviewsError, messages.noReviews)}
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
                {messages.noReviews}
              </div>
            ) : (
              <div className="space-y-2">
                {reviews.map((review) => (
                  <ParkingReviewCard
                    actionDeleteLabel={messages.delete}
                    actionDetailsLabel={messages.details}
                    key={review.id}
                    onDelete={() => undefined}
                    onDetails={() => undefined}
                    review={review}
                    showActions
                    showAuthorName
                  />
                ))}
              </div>
            )
          ) : isComplaintsLoading ? (
            <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
              {messages.loadingComplaints}
            </div>
          ) : complaintsError ? (
            <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-danger shadow-card">
              {getErrorMessage(complaintsError, messages.noComplaints)}
            </div>
          ) : complaints.length === 0 ? (
            <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
              {messages.noComplaints}
            </div>
          ) : (
            <div className="space-y-2">
              {complaints.map((complaint) => (
                <ParkingComplaintCard
                  actionDeleteLabel={messages.delete}
                  actionDetailsLabel={messages.details}
                  complaint={complaint}
                  key={complaint.id}
                  onDelete={() => undefined}
                  onDetails={() => undefined}
                  showActions
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function ParkingReviewsPanel({
  onClose,
}: ParkingReviewsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedParking, setSelectedParking] = useState<ParkingListItem | null>(null)
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const { activePanel, navigationKey } = useParkingAdminPanels()
  const { error, isLoading, parkingItems } = useParkingReviewParkings(searchQuery)
  const heading = useMemo(() => messages.reviews, [messages.reviews])

  useEffect(() => {
    if (activePanel === 'reviews') {
      setSelectedParking(null)
    }
  }, [activePanel, navigationKey])

  return (
    <aside
      className={cn(
        'pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-none border-r border-border bg-surface-muted shadow-[0_16px_40px_rgb(0_0_0_/_0.08)]',
        selectedParking ? 'max-w-[28rem]' : 'max-w-[24.5rem]',
      )}
    >
      {selectedParking ? (
        <ParkingFeedDetailView
          key={selectedParking.id}
          locale={locale}
          messages={messages}
          onBackToList={() => setSelectedParking(null)}
          onClose={onClose}
          parking={selectedParking}
        />
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 px-6 py-6">
            <h2 className="font-heading text-[20px] leading-7 font-normal text-text-primary">
              {heading}
            </h2>
            <button
              aria-label={messages.close}
              className="flex size-10 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6 px-6 pb-6">
            <ParkingSearchField onChange={setSearchQuery} value={searchQuery} />
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {isLoading ? (
              <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
                {messages.loading}
              </div>
            ) : error ? (
              <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-danger shadow-card">
                {getErrorMessage(error, messages.unableToLoadReviewParkings)}
              </div>
            ) : parkingItems.length === 0 ? (
              <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
                {messages.noReviewParkings}
              </div>
            ) : (
              <div className="space-y-2">
                {parkingItems.map((parking) => (
                  <ParkingListRow
                    key={parking.id}
                    locale={locale}
                    onClick={(nextParking) => {
                      setSelectedParking(nextParking)
                    }}
                    parking={parking}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  )
}
