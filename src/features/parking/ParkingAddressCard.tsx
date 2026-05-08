import { getParkingMessages } from '../../constants/parkingI18n'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import type { ParkingListItem } from '../../types/parking'
import { ParkingAddressDisplay } from './ParkingAddressDisplay'

type ParkingAddressCardProps = {
  parking: ParkingListItem
}

export function ParkingAddressCard({ parking }: ParkingAddressCardProps) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const title = parking.address ?? messages.noAddress

  return (
    <div className="rounded-[10px] bg-surface px-4 py-4 shadow-card">
      <div className="flex items-center gap-3">
        <ParkingAddressDisplay address={title} />
      </div>
    </div>
  )
}
