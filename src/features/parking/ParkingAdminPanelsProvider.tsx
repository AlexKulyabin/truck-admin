import { useMemo, useState, type PropsWithChildren } from 'react'
import {
  ParkingAdminPanelsContext,
  type ParkingAdminPanel,
  type ParkingAdminPanelsContextValue,
} from './ParkingAdminPanelsContext'

export function ParkingAdminPanelsProvider({ children }: PropsWithChildren) {
  const [activePanel, setActivePanel] = useState<ParkingAdminPanel>('parking-list')
  const [navigationKey, setNavigationKey] = useState(0)

  const value = useMemo<ParkingAdminPanelsContextValue>(
    () => ({
      activePanel,
      closePanel: () => setActivePanel(null),
      navigationKey,
      showAddParking: () => {
        setNavigationKey((currentValue) => currentValue + 1)
        setActivePanel('add-parking')
      },
      showEditParking: () => {
        setNavigationKey((currentValue) => currentValue + 1)
        setActivePanel('edit-parking')
      },
      showParkingDetails: () => {
        setNavigationKey((currentValue) => currentValue + 1)
        setActivePanel('parking-details')
      },
      showParkingList: () => {
        setNavigationKey((currentValue) => currentValue + 1)
        setActivePanel('parking-list')
      },
      showRequests: () => {
        setNavigationKey((currentValue) => currentValue + 1)
        setActivePanel('requests')
      },
    }),
    [activePanel, navigationKey],
  )

  return (
    <ParkingAdminPanelsContext.Provider value={value}>
      {children}
    </ParkingAdminPanelsContext.Provider>
  )
}
