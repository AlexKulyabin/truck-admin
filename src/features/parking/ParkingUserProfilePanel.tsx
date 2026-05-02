import { useState } from 'react'
import { getParkingMessages, type SupportedLocale } from '../../constants/parkingI18n'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import { useUserProfileActivity } from '../../hooks/useUserProfileActivity'
import { cn } from '../../lib/cn'
import type { ParkingAuthor } from '../../types/parking'
import { ParkingComplaintCard } from './ParkingComplaintCard'
import { ParkingReviewCard } from './ParkingReviewCard'
import arrowIcon from '../../assets/icons/arrow.svg'
import dangerIcon from '../../assets/icons/danger.svg'
import rankingIcon from '../../assets/icons/ranking.svg'

type ProfileTabId = 'reviews' | 'complaints'

type ParkingUserProfilePanelProps = {
  author: ParkingAuthor
  onClose: () => void
}

type ProfileEmptyStateProps = {
  icon: string
  text: string
}

function ProfileEmptyState({ icon, text }: ProfileEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-start gap-5 py-10">
      <div className="flex size-24 items-center justify-center">
        <img alt="" aria-hidden="true" className="size-20" src={icon} />
      </div>
      <p className="text-center font-heading text-base font-normal leading-6 text-text-secondary">
        {text}
      </p>
    </div>
  )
}

function ProfileTabButton({
  isActive,
  label,
  count,
  onClick,
}: {
  isActive: boolean
  count?: number
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'rounded-lg px-2 py-1.5 font-heading text-sm leading-5 tracking-tight transition',
        isActive
          ? 'bg-surface font-medium text-text-primary shadow-card'
          : 'font-normal text-text-secondary',
      )}
      onClick={onClick}
      type="button"
    >
      {label}
      {typeof count === 'number' ? (
        <span className="ml-2 text-base font-medium leading-6 text-link">
          {count}
        </span>
      ) : null}
    </button>
  )
}

function ProfileHeader({
  author,
  authorName,
  closeLabel,
  onClose,
}: {
  author: ParkingAuthor
  authorName: string
  closeLabel: string
  onClose: () => void
}) {
  const authorInitial = authorName.charAt(0).toUpperCase()

  return (
    <div className="relative">
      <div className="relative h-80 w-full overflow-hidden bg-surface-muted">
        {author.avatarUrl ? (
          <img
            alt={authorName}
            className="h-full w-full object-cover"
            src={author.avatarUrl}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface">
            <span className="flex size-24 items-center justify-center rounded-full bg-[#E6DBFF] font-heading text-3xl font-medium text-[#5B41A8]">
              {authorInitial}
            </span>
          </div>
        )}
      </div>
      <button
        aria-label={closeLabel}
        className="absolute left-5 top-5 flex size-12 items-center justify-center rounded-2xl bg-surface text-text-primary shadow-card transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
        onClick={onClose}
        type="button"
      >
        <img alt="" aria-hidden="true" className="size-6" src={arrowIcon} />
      </button>
    </div>
  )
}

function ReviewsTabContent({
  isLoading,
  locale,
  reviews,
}: {
  isLoading: boolean
  locale: SupportedLocale
  reviews: ReturnType<typeof useUserProfileActivity>['reviews']
}) {
  const messages = getParkingMessages(locale)

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
        {messages.loadingReviews}
      </div>
    )
  }

  if (reviews.length === 0) {
    return <ProfileEmptyState icon={rankingIcon} text={messages.noProfileReviews} />
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ParkingReviewCard
          key={review.id}
          review={review}
          showActions={false}
          showAuthorName={false}
          thumbnailUrl={review.thumbnailUrl ?? review.authorAvatarUrl}
          title={review.parkingAddress}
        />
      ))}
    </div>
  )
}

function ComplaintsTabContent({
  complaints,
  isLoading,
  locale,
}: {
  complaints: ReturnType<typeof useUserProfileActivity>['complaints']
  isLoading: boolean
  locale: SupportedLocale
}) {
  const messages = getParkingMessages(locale)

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
        {messages.loadingComplaints}
      </div>
    )
  }

  if (complaints.length === 0) {
    return <ProfileEmptyState icon={dangerIcon} text={messages.noProfileComplaints} />
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <ParkingComplaintCard key={complaint.id} complaint={complaint} showActions={false} />
      ))}
    </div>
  )
}

export function ParkingUserProfilePanel({
  author,
  onClose,
}: ParkingUserProfilePanelProps) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const [activeTab, setActiveTab] = useState<ProfileTabId>('reviews')
  const { complaints, isLoading, reviews } = useUserProfileActivity(author.id)
  const authorName = author.fullName?.trim() || messages.anonymousUser

  return (
    <aside className="pointer-events-auto flex h-full w-full max-w-[28rem] flex-col overflow-hidden rounded-none border-r border-border bg-surface-muted shadow-[0_16px_40px_rgb(0_0_0_/_0.08)]">
      <ProfileHeader
        author={author}
        authorName={authorName}
        closeLabel={messages.close}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="px-4 py-4">
          <h2 className="font-heading text-xl leading-6 font-medium text-text-primary">
            {authorName}
          </h2>
        </div>

        <div className="flex items-center gap-2 px-4 py-4">
          <ProfileTabButton
            isActive={activeTab === 'reviews'}
            count={reviews.length}
            label={messages.reviews}
            onClick={() => setActiveTab('reviews')}
          />
          <ProfileTabButton
            isActive={activeTab === 'complaints'}
            count={complaints.length}
            label={messages.complaints}
            onClick={() => setActiveTab('complaints')}
          />
        </div>

        <div className="px-4 py-6">
          {activeTab === 'reviews' ? (
            <ReviewsTabContent
              isLoading={isLoading}
              locale={locale}
              reviews={reviews}
            />
          ) : (
            <ComplaintsTabContent
              complaints={complaints}
              isLoading={isLoading}
              locale={locale}
            />
          )}
        </div>
      </div>
    </aside>
  )
}
