import { getParkingMessages, type SupportedLocale } from '../../constants/parkingI18n'
import type { ParkingListItem } from '../../types/parking'
import { ParkingAddressDisplay } from './ParkingAddressDisplay'

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
      <ParkingAddressDisplay address={title} showChevron />
    </button>
  )
}
