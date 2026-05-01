import { Plus, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getParkingMessages } from '../../constants/parkingI18n'
import { useParkingList } from '../../hooks/useParkingList'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import type { ParkingListItem } from '../../types/parking'
import { ParkingListRow } from './ParkingListRow'

type ParkingListPanelProps = {
  onClose: () => void
  onSelectParking: (_parking: ParkingListItem) => void
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (!error) {
    return fallbackMessage
  }

  return error instanceof Error ? error.message : fallbackMessage
}

export function ParkingListPanel({
  onClose,
  onSelectParking,
}: ParkingListPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const { error, isLoading, parkingItems } = useParkingList(searchQuery)
  const heading = useMemo(() => messages.parkingList, [messages.parkingList])

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
            type="search"
            value={searchQuery}
          />
          <Search aria-hidden="true" className="size-6 shrink-0 text-text-secondary" />
        </label>

        <button
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base leading-6 font-medium text-white transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
          type="button"
        >
          <Plus aria-hidden="true" className="size-6" />
          <span>{messages.addParking}</span>
        </button>
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
        ) : parkingItems.length === 0 ? (
          <div className="rounded-[10px] bg-surface px-4 py-5 font-heading text-sm font-normal text-text-secondary shadow-card">
            {messages.noParkings}
          </div>
        ) : (
          <div className="space-y-2">
            {parkingItems.map((parking) => (
              <ParkingListRow
                key={parking.id}
                locale={locale}
                onClick={onSelectParking}
                parking={parking}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
