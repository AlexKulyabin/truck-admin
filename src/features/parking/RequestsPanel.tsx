import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  formatCompactCount,
  getParkingMessages,
} from '../../constants/parkingI18n'
import { ParkingListRow } from './ParkingListRow'
import { useParkingRequestCounts } from '../../hooks/useParkingRequestCounts'
import { useParkingRequests } from '../../hooks/useParkingRequests'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import type { ParkingListItem, ParkingRequestItem } from '../../types/parking'
import { cn } from '../../lib/cn'

type RequestTabId = 'pending' | 'approved' | 'rejected'

type RequestsPanelProps = {
  onClose: () => void
  onSelectParking: (_parking: ParkingListItem) => void
}

const requestTabs: Array<{
  id: RequestTabId
  status: ParkingRequestItem['status']
}> = [
  { id: 'pending', status: 'pending' },
  { id: 'approved', status: 'approved' },
  { id: 'rejected', status: 'rejected' },
]

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (!error) {
    return fallbackMessage
  }

  return error instanceof Error ? error.message : fallbackMessage
}

export function RequestsPanel({ onClose, onSelectParking }: RequestsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<RequestTabId>('pending')
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const { error, isLoading, parkingRequests } = useParkingRequests(searchQuery)
  const { requestCounts } = useParkingRequestCounts(searchQuery)
  const heading = useMemo(() => messages.requests, [messages.requests])

  const filteredRequests = useMemo(
    () =>
      parkingRequests.filter((request) => {
        if (activeTab === 'pending') {
          return request.status === 'pending'
        }

        if (activeTab === 'approved') {
          return request.status === 'approved'
        }

        return request.status === 'rejected'
      }),
    [activeTab, parkingRequests],
  )

  const hasSearchText = searchQuery.trim().length > 0

  function handleClearSearch() {
    setSearchQuery('')
  }

  function handleSelectRequest(parking: ParkingListItem) {
    onSelectParking(parking)
  }

  return (
    <aside className="pointer-events-auto flex h-full w-full max-w-[24.5rem] flex-col overflow-hidden rounded-none border-r border-border bg-surface-muted shadow-[0_16px_40px_rgb(0_0_0_/_0.08)]">
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
        <label className="flex h-14 items-center gap-3 rounded-[10px] bg-surface px-5 shadow-card">
          <input
            aria-label={messages.search}
            className="min-w-0 flex-1 bg-transparent font-heading text-base font-normal text-text-primary outline-none placeholder:text-text-secondary"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={messages.search}
            type="text"
            value={searchQuery}
          />
          {hasSearchText ? (
            <button
              aria-label={messages.clearSearch}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
              onClick={handleClearSearch}
              type="button"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          ) : (
            <Search
              aria-hidden="true"
              className="size-6 shrink-0 text-text-secondary"
            />
          )}
        </label>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {requestTabs.map((tab) => {
            const isActive = activeTab === tab.id
            const count = requestCounts[tab.id]

            return (
              <button
                key={tab.id}
                className={cn(
                  'flex h-10 shrink-0 items-center rounded-lg px-2 py-1.5 transition focus:outline-none',
                  isActive ? 'bg-surface shadow-card' : 'hover:bg-surface/70',
                )}
                onClick={() => setActiveTab(tab.id)}
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
                  {tab.id === 'pending'
                    ? messages.new
                    : tab.id === 'approved'
                      ? messages.accepted
                      : messages.rejected}
                </span>
                {tab.id !== 'rejected' && count > 0 ? (
                  <span className="ml-1 flex min-w-6 items-center justify-center rounded-md bg-surface px-2 font-heading text-sm leading-5 font-normal tracking-tight text-primary">
                    {formatCompactCount(count, locale)}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isLoading ? (
          <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
            {messages.loading}
          </div>
        ) : error ? (
          <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-danger shadow-card">
            {getErrorMessage(error, messages.unableToLoadParkingList)}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
            {messages.noRequests}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredRequests.map((parking) => (
              <ParkingListRow
                key={parking.id}
                locale={locale}
                onClick={handleSelectRequest}
                parking={parking}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
