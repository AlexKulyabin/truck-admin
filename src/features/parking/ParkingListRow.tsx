import { ChevronRight } from 'lucide-react'
import locationIcon from '../../assets/icons/location.svg'
import { getParkingMessages, type SupportedLocale } from '../../constants/parkingI18n'
import type { ParkingListItem } from '../../types/parking'

type ParkingListRowProps = {
  locale: SupportedLocale
  onClick: (_parking: ParkingListItem) => void
  parking: ParkingListItem
}

export function ParkingListRow({ locale, onClick, parking }: ParkingListRowProps) {
  const messages = getParkingMessages(locale)
  const title = parking.address ?? messages.noAddress

  return (
    <button
      className="flex w-full items-center gap-3 rounded-[10px] bg-surface px-4 py-4 text-left shadow-card transition hover:bg-surface/90 focus:outline-none focus:ring-2 focus:ring-primary/30"
      onClick={() => onClick(parking)}
      type="button"
    >
      <img alt="" aria-hidden="true" className="size-[1.875rem] shrink-0" src={locationIcon} />
      <span className="min-w-0 flex-1 overflow-hidden font-heading text-[15px] leading-[18px] font-normal text-text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
        {title}
      </span>
      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-text-secondary" />
    </button>
  )
}
