import { useState, type MouseEvent } from 'react'
import addParkingBlueIcon from '../../assets/icons/add-parking-blue.svg'
import addParkingGrayIcon from '../../assets/icons/add-parking-gray.svg'
import logoutIcon from '../../assets/icons/logout.svg'
import menuBlueIcon from '../../assets/icons/menu-blue.svg'
import menuGrayIcon from '../../assets/icons/menu-gray.svg'
import requestsBlueIcon from '../../assets/icons/requests-blue.svg'
import requestsGrayIcon from '../../assets/icons/requests-gray.svg'
import reviewsBlueIcon from '../../assets/icons/reviews-blue.svg'
import reviewsGrayIcon from '../../assets/icons/reviews-gray.svg'
import logo from '../../assets/logos/logo.svg'
import { formatCompactCount } from '../../constants/parkingI18n'
import { useParkingAdminPanels } from '../../features/parking/useParkingAdminPanels'
import { useParkingRequestCounts } from '../../hooks/useParkingRequestCounts'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import { cn } from '../../lib/cn'

type SidebarItem = {
  activeIcon: string
  badge?: string | number
  icon: string
  id: string
  label: string
  onClick?: () => void
}

type AppSidebarProps = {
  onLogout: () => void
  userEmail?: string | null
}

type SidebarButtonProps = SidebarItem & {
  isActive?: boolean
  isExpanded?: boolean
}

function stopSidebarToggle(event: MouseEvent<HTMLElement>) {
  event.stopPropagation()
}

function SidebarButton({
  activeIcon,
  badge,
  icon,
  isActive = false,
  isExpanded = false,
  label,
  onClick,
}: SidebarButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'relative flex h-12 items-center rounded-[10px] transition',
        'focus:outline-none focus:ring-2 focus:ring-primary/30',
        isActive ? 'bg-surface' : 'hover:bg-surface',
        isExpanded ? 'w-full gap-2' : 'w-12 justify-center',
      )}
      onClick={(event) => {
        stopSidebarToggle(event)
        onClick?.()
      }}
      title={label}
      type="button"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px]">
        <img
          alt=""
          aria-hidden="true"
          className="size-6"
          src={isActive ? activeIcon : icon}
        />
      </span>
      {isExpanded && (
        <span className="min-w-0 flex-1 truncate text-left font-heading text-[16px] leading-[16px] font-medium text-text-primary">
          {label}
        </span>
      )}
      {badge ? (
        <span
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-[5px] bg-primary text-sm leading-none text-white',
            isExpanded ? 'ml-auto' : 'absolute -right-1 -top-1',
          )}
        >
          {badge}
        </span>
      ) : null}
    </button>
  )
}

export function AppSidebar({ onLogout, userEmail }: AppSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    activePanel,
    showAddParking,
    showParkingList,
    showRequests,
  } = useParkingAdminPanels()
  const locale = useSystemLocale()
  const { requestCounts } = useParkingRequestCounts('')
  const displayEmail = userEmail ?? 'Example@mail.com'
  const isParkingSectionActive =
    activePanel === 'parking-details' || activePanel === 'parking-list'
  const isRequestsSectionActive = activePanel === 'requests'
  const pendingRequestsBadge =
    requestCounts.pending > 0
      ? formatCompactCount(requestCounts.pending, locale)
      : undefined
  const navigationItems: SidebarItem[] = [
    {
      activeIcon: menuBlueIcon,
      icon: menuGrayIcon,
      id: 'parking-list',
      label: 'Parking list',
      onClick: showParkingList,
    },
    {
      activeIcon: addParkingBlueIcon,
      icon: addParkingGrayIcon,
      id: 'add-parking',
      label: 'Add parking',
      onClick: showAddParking,
    },
    {
      activeIcon: requestsBlueIcon,
      badge: pendingRequestsBadge,
      icon: requestsGrayIcon,
      id: 'requests',
      label: 'Requests',
      onClick: showRequests,
    },
    {
      activeIcon: reviewsBlueIcon,
      icon: reviewsGrayIcon,
      id: 'reviews',
      label: 'Reviews',
    },
  ]

  return (
    <aside
      className={cn(
        'flex border-t border-border bg-surface-muted shadow-card transition-[width] duration-200',
        'md:min-h-screen md:flex-col md:justify-between md:border-r md:border-t-0 md:py-6 md:pl-6 md:pr-2',
        isExpanded ? 'md:w-72' : 'md:w-24',
      )}
      onClick={() => setIsExpanded((currentValue) => !currentValue)}
    >
      <div
        className={cn(
          'hidden flex-col gap-12 md:flex',
          isExpanded ? 'items-stretch' : 'items-center',
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-[10px]',
            isExpanded ? 'justify-start' : 'justify-center',
          )}
        >
          <img alt="Truck Admin" className="size-[61px] shrink-0" src={logo} />
          {isExpanded && (
            <span className="whitespace-nowrap font-heading text-[20px] leading-[20px] font-medium text-text-primary">
              JS TRUCKPARK
            </span>
          )}
        </div>

        <nav aria-label="Main navigation" className="flex flex-col gap-4">
          {navigationItems.map((item) => (
            <SidebarButton
              key={item.id}
              {...item}
              isActive={
                (item.id === 'parking-list' && isParkingSectionActive) ||
                (item.id === 'add-parking' && activePanel === 'add-parking') ||
                (item.id === 'requests' && isRequestsSectionActive)
              }
              isExpanded={isExpanded}
            />
          ))}
        </nav>
      </div>

      <nav
        aria-label="Main navigation"
        className="grid w-full grid-cols-5 items-center justify-items-center gap-2 px-3 py-2 md:hidden"
      >
        {navigationItems.map((item) => (
          <SidebarButton
            key={item.id}
            {...item}
            isActive={
              (item.id === 'parking-list' && isParkingSectionActive) ||
              (item.id === 'add-parking' && activePanel === 'add-parking') ||
              (item.id === 'requests' && isRequestsSectionActive)
            }
            isExpanded={isExpanded}
          />
        ))}
        <button
          aria-label="Log out"
          className="flex size-12 items-center justify-center rounded-[10px] transition hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          onClick={(event) => {
            stopSidebarToggle(event)
            onLogout()
          }}
          title="Log out"
          type="button"
        >
          <img alt="" aria-hidden="true" className="size-6" src={logoutIcon} />
        </button>
      </nav>

      <div className="hidden md:block">
        <button
          aria-label="Log out"
          className={cn(
            'flex h-12 w-full items-center rounded-[10px] bg-surface transition hover:bg-map-marker-muted focus:outline-none focus:ring-2 focus:ring-primary/30',
            isExpanded ? 'gap-4' : 'justify-center',
          )}
          onClick={(event) => {
            stopSidebarToggle(event)
            onLogout()
          }}
          title="Log out"
          type="button"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px]">
            <img alt="" aria-hidden="true" className="size-6" src={logoutIcon} />
          </span>
          {isExpanded && (
            <span className="min-w-0 text-left">
              <span className="block text-base font-medium text-text-primary">
                Log out
              </span>
              <span className="block truncate text-sm leading-4 text-text-secondary">
                {displayEmail}
              </span>
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
