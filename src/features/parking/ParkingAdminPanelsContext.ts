import { createContext } from 'react'

export type ParkingAdminPanel =
  | 'add-parking'
  | 'edit-parking'
  | 'parking-details'
  | 'parking-list'
  | null

export type ParkingAdminPanelsContextValue = {
  activePanel: ParkingAdminPanel
  closePanel: () => void
  showAddParking: () => void
  showEditParking: () => void
  showParkingDetails: () => void
  showParkingList: () => void
}

export const ParkingAdminPanelsContext = createContext<
  ParkingAdminPanelsContextValue | undefined
>(undefined)
