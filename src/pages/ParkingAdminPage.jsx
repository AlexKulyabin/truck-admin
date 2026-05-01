import { ParkingForm } from '../features/parking/ParkingForm'
import { ParkingMap } from '../components/maps/ParkingMap'
import { useParkingPoints } from '../hooks/useParkingPoints'

export function ParkingAdminPage() {
  const { addParkingPoint, error, isLoading, parkingPoints } = useParkingPoints()

  return (
    <div className="grid min-h-[calc(100vh-120px)] gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
      <ParkingForm
        error={error}
        isLoading={isLoading}
        onCreateParkingPoint={addParkingPoint}
      />
      <ParkingMap parkingPoints={parkingPoints} />
    </div>
  )
}
