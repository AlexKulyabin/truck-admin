import { useContext } from 'react'
import { ParkingAdminPanelsContext } from './ParkingAdminPanelsContext'

export function useParkingAdminPanels() {
  const context = useContext(ParkingAdminPanelsContext)

  if (!context) {
    throw new Error('useParkingAdminPanels must be used within ParkingAdminPanelsProvider')
  }

  return context
}
