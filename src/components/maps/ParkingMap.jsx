import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps'
import { MapPinned } from 'lucide-react'
import { mapsConfig } from '../../config/maps'

export function ParkingMap({ parkingPoints = [] }) {
  if (!mapsConfig.apiKey) {
    return (
      <section className="flex min-h-[520px] items-center justify-center rounded-lg border border-dashed border-[#b8c6b6] bg-white p-6 text-center">
        <div className="max-w-md">
          <MapPinned className="mx-auto mb-3 text-[#1f6f43]" size={36} />
          <h2 className="text-lg font-semibold text-[#172119]">
            Google Maps key is not configured
          </h2>
          <p className="mt-2 text-sm text-[#647067]">
            Create a local .env file from .env.example and set
            VITE_GOOGLE_MAPS_API_KEY.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-lg border border-[#dbe2d9] bg-white shadow-sm">
      <APIProvider apiKey={mapsConfig.apiKey}>
        <Map
          className="h-[calc(100vh-140px)] min-h-[520px] w-full"
          defaultCenter={mapsConfig.defaultCenter}
          defaultZoom={mapsConfig.defaultZoom}
          gestureHandling="greedy"
          mapId="truck-admin-parking-map"
        >
          {parkingPoints.map((point) => (
            <AdvancedMarker
              key={point.id}
              position={{ lat: point.latitude, lng: point.longitude }}
              title={point.name}
            >
              <Pin
                background="#1f6f43"
                borderColor="#185a36"
                glyphColor="#ffffff"
              />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </section>
  )
}
