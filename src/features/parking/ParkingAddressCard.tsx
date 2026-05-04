import locationIcon from '../../assets/icons/location.svg'
import { getParkingMessages } from '../../constants/parkingI18n'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import type { ParkingListItem } from '../../types/parking'

type ParkingAddressCardProps = {
  parking: ParkingListItem
}

function splitParkingAddress(address: string) {
  const normalizedAddress = address.trim()
  const [primary, ...rest] = normalizedAddress.split(', ')

  return {
    primary: primary || normalizedAddress,
    secondary: rest.length > 0 ? rest.join(', ') : null,
  }
}

export function ParkingAddressCard({ parking }: ParkingAddressCardProps) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const title = parking.address ?? messages.noAddress
  const { primary, secondary } = splitParkingAddress(title)

  return (
    <div className="rounded-[10px] bg-surface px-4 py-4 shadow-card">
      <div className="flex items-center gap-3">
        <img alt="" aria-hidden="true" className="size-[1.875rem] shrink-0" src={locationIcon} />
        <div className="min-w-0 flex-1 font-heading text-base leading-6 font-medium">
          <span className="text-text-primary">{primary}</span>
          {secondary ? <span className="text-text-secondary">, {secondary}</span> : null}
        </div>
      </div>
    </div>
  )
}
