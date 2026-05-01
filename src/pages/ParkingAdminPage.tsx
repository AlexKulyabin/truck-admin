import { useState } from 'react'
import { ParkingMap } from '../components/maps/ParkingMap'
import { useParkingAdminPanels } from '../features/parking/useParkingAdminPanels'
import { ParkingDetailsPanel } from '../features/parking/ParkingDetailsPanel'
import { ParkingListPanel } from '../features/parking/ParkingListPanel'
import type { ParkingDetailItem, ParkingListItem, ParkingMapItem } from '../types/parking'

export function ParkingAdminPage() {
  const { activePanel, closePanel, showParkingDetails, showParkingList } =
    useParkingAdminPanels()
  const [selectedParking, setSelectedParking] = useState<ParkingDetailItem | null>(
    null,
  )
  const [focusedParking, setFocusedParking] = useState<{
    latitude: number | null
    longitude: number | null
  } | null>(null)

  function handleSelectParking(parking: ParkingMapItem | ParkingListItem) {
    setSelectedParking(parking)
    setFocusedParking({
      latitude: 'latitude' in parking ? parking.latitude : null,
      longitude: 'longitude' in parking ? parking.longitude : null,
    })
    showParkingDetails()
  }

  function handleCloseParkingDetails() {
    setSelectedParking(null)
    showParkingList()
  }

  return (
    <div className="relative min-h-screen bg-background">
      <ParkingMap
        focusedParking={focusedParking}
        onSelectParking={handleSelectParking}
      />
      {activePanel === 'parking-list' ? (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[24.5rem]">
          <ParkingListPanel
            onClose={closePanel}
            onSelectParking={handleSelectParking}
          />
        </div>
      ) : null}
      {activePanel === 'parking-details' && selectedParking ? (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[28rem]">
          <ParkingDetailsPanel
            onClose={handleCloseParkingDetails}
            parking={selectedParking}
            key={selectedParking.id}
          />
        </div>
      ) : null}
    </div>
  )
}
