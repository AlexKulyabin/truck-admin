import { ParkingForm } from '../features/parking/ParkingForm'
import { ParkingMap } from '../components/maps/ParkingMap'

export function ParkingAdminPage() {
  return (
    <div className="grid min-h-[calc(100vh-120px)] gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
      <ParkingForm />
      <ParkingMap />
    </div>
  )
}
