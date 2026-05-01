import { ParkingMap } from '../components/maps/ParkingMap'
import { ParkingForm } from '../features/parking/ParkingForm'
import { useParkingPoints } from '../hooks/useParkingPoints'

export function ParkingAdminPage() {
  const { addParkingPoint, error, isLoading } = useParkingPoints()

  return (
    <div className="grid min-h-screen gap-4 p-4 lg:grid-cols-[380px_minmax(0,1fr)]">
      <ParkingForm
        error={error}
        isLoading={isLoading}
        onCreateParkingPoint={addParkingPoint}
      />
      <ParkingMap />
    </div>
  )
}
