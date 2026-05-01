import { useState } from 'react'
import { ParkingMap } from '../components/maps/ParkingMap'
import { ParkingDetailsPanel } from '../features/parking/ParkingDetailsPanel'
import type { ParkingMapItem } from '../types/parking'

export function ParkingAdminPage() {
  const [selectedParking, setSelectedParking] = useState<ParkingMapItem | null>(
    null,
  )

  return (
    <div className="relative min-h-screen bg-background">
      <ParkingMap onSelectParking={setSelectedParking} />
      {selectedParking ? (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[28rem]">
          <ParkingDetailsPanel
            onClose={() => setSelectedParking(null)}
            parking={selectedParking}
            key={selectedParking.id}
          />
        </div>
      ) : null}
    </div>
  )
}
