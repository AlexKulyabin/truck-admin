import { Search, X } from 'lucide-react'
import { useMemo } from 'react'
import { getParkingMessages } from '../../constants/parkingI18n'
import { useSystemLocale } from '../../hooks/useSystemLocale'

type ParkingSearchFieldProps = {
  onChange: (_value: string) => void
  value: string
}

export function ParkingSearchField({ onChange, value }: ParkingSearchFieldProps) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const hasSearchText = useMemo(() => value.trim().length > 0, [value])

  return (
    <label className="flex h-14 items-center gap-3 rounded-[10px] bg-surface px-5 shadow-card">
      <input
        aria-label={messages.search}
        className="min-w-0 flex-1 bg-transparent font-heading text-base font-normal text-text-primary outline-none placeholder:text-text-secondary [appearance:none] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
        onChange={(event) => onChange(event.target.value)}
        placeholder={messages.search}
        type="search"
        value={value}
      />
      {hasSearchText ? (
        <button
          aria-label={messages.clearSearch}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          onClick={() => onChange('')}
          type="button"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      ) : (
        <Search aria-hidden="true" className="size-6 shrink-0 text-text-secondary" />
      )}
    </label>
  )
}
