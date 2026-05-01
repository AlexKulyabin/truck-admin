import { useMemo, useState, type PropsWithChildren } from 'react'
import {
  ParkingAdminPanelsContext,
  type ParkingAdminPanel,
  type ParkingAdminPanelsContextValue,
} from './ParkingAdminPanelsContext'

export function ParkingAdminPanelsProvider({ children }: PropsWithChildren) {
  const [activePanel, setActivePanel] = useState<ParkingAdminPanel>('parking-list')

  const value = useMemo<ParkingAdminPanelsContextValue>(
    () => ({
      activePanel,
      closePanel: () => setActivePanel(null),
      showAddParking: () => setActivePanel('add-parking'),
      showEditParking: () => setActivePanel('edit-parking'),
      showParkingDetails: () => setActivePanel('parking-details'),
      showParkingList: () => setActivePanel('parking-list'),
      showRequests: () => setActivePanel('requests'),
    }),
    [activePanel],
  )

  return (
    <ParkingAdminPanelsContext.Provider value={value}>
      {children}
    </ParkingAdminPanelsContext.Provider>
  )
}
