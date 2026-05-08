import { ChevronRight } from 'lucide-react'
import locationIcon from '../../assets/icons/location.svg'
import { cn } from '../../lib/cn'

type ParkingAddressDisplayProps = {
  address: string
  showChevron?: boolean
}

export function ParkingAddressDisplay({
  address,
  showChevron = false,
}: ParkingAddressDisplayProps) {
  return (
    <>
      <img alt="" aria-hidden="true" className="size-[1.875rem] shrink-0" src={locationIcon} />
      <span className="min-w-0 flex-1 overflow-hidden font-heading text-[15px] leading-[18px] font-normal text-text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
        {address}
      </span>
      <ChevronRight
        aria-hidden="true"
        className={cn('size-5 shrink-0 text-text-secondary', !showChevron && 'hidden')}
      />
    </>
  )
}
