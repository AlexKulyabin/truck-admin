import { createContext } from 'react'

export type ParkingAdminPanel =
  | 'add-parking'
  | 'edit-parking'
  | 'parking-details'
  | 'parking-list'
  | 'requests'
  | null

export type ParkingAdminPanelsContextValue = {
  activePanel: ParkingAdminPanel
  closePanel: () => void
  navigationKey: number
  showAddParking: () => void
  showEditParking: () => void
  showParkingDetails: () => void
  showParkingList: () => void
  showRequests: () => void
}

export const ParkingAdminPanelsContext = createContext<
  ParkingAdminPanelsContextValue | undefined
>(undefined)
