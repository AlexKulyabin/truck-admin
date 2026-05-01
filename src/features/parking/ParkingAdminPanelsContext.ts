import { createContext } from 'react'

export type ParkingAdminPanel = 'parking-details' | 'parking-list' | null

export type ParkingAdminPanelsContextValue = {
  activePanel: ParkingAdminPanel
  closePanel: () => void
  showParkingDetails: () => void
  showParkingList: () => void
}

export const ParkingAdminPanelsContext = createContext<
  ParkingAdminPanelsContextValue | undefined
>(undefined)
