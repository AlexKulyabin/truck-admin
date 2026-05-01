import {
  APIProvider,
  Map,
  useMap,
} from '@vis.gl/react-google-maps'
import { MapPinned } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { mapsConfig } from '../../config/maps'
import { MAP_CLUSTER_COLORS } from '../../constants/mapTheme'
import markerIcon from '../../assets/icons/marker.svg'
import { useParkingMapItems } from '../../hooks/useParkingMapItems'
import type { ParkingMapItem } from '../../types/parking'

type ParkingMapProps = {
  focusedParking?: {
    latitude: number | null
    longitude: number | null
  } | null
  onSelectParking?: (_parking: ParkingMapItem) => void
}

const MARKER_SIZE = {
  height: 44,
  width: 35,
}

function createClusterIcon(count: number) {
  const maps = google.maps
  const size = count >= 100 ? 58 : count >= 10 ? 52 : 46
  const fontSize = count >= 100 ? 17 : 18
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 3}" fill="${MAP_CLUSTER_COLORS.HALO}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 8}" fill="${MAP_CLUSTER_COLORS.BACKGROUND}"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" fill="${MAP_CLUSTER_COLORS.TEXT}" font-family="Inter, Roboto, Arial, sans-serif" font-size="${fontSize}" font-weight="700">${count}</text>
    </svg>
  `

  return {
    scaledSize: new maps.Size(size, size),
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
  }
}

function getMapRequest(map: google.maps.Map) {
  const bounds = map.getBounds()
  const center = map.getCenter()
  const zoom = map.getZoom()

  if (!bounds || !center || zoom === undefined) {
    return null
  }

  const northEast = bounds.getNorthEast()
  const southWest = bounds.getSouthWest()

  return {
    bounds: {
      maxLat: northEast.lat(),
      maxLng: northEast.lng(),
      minLat: southWest.lat(),
      minLng: southWest.lng(),
    },
    center: {
      lat: center.lat(),
      lng: center.lng(),
    },
    zoom,
  }
}

function ParkingMarkerLayer({ onSelectParking }: ParkingMapProps) {
  const map = useMap()
  const idleDebounceRef = useRef<ReturnType<typeof window.setTimeout> | null>(
    null,
  )
  const { error, isLoading, loadParkingItems, parkingItems } =
    useParkingMapItems()

  useEffect(() => {
    if (!map) {
      return undefined
    }

    const currentMap = map

    function loadVisibleParkings() {
      const request = getMapRequest(currentMap)

      if (request) {
        void loadParkingItems(request)
      }
    }

    function scheduleLoadVisibleParkings() {
      if (idleDebounceRef.current) {
        window.clearTimeout(idleDebounceRef.current)
      }

      idleDebounceRef.current = window.setTimeout(loadVisibleParkings, 250)
    }

    const idleListener = currentMap.addListener(
      'idle',
      scheduleLoadVisibleParkings,
    )

    scheduleLoadVisibleParkings()

    return () => {
      idleListener.remove()

      if (idleDebounceRef.current) {
        window.clearTimeout(idleDebounceRef.current)
      }
    }
  }, [loadParkingItems, map])

  useEffect(() => {
    if (!map) {
      return undefined
    }

    const currentMap = map
    const maps = google.maps
    const markers: google.maps.Marker[] = parkingItems.map((item) => {
      const isCluster = item.isCluster
      const marker = new maps.Marker({
        icon: isCluster
          ? createClusterIcon(item.count)
          : {
              anchor: new maps.Point(
                MARKER_SIZE.width / 2,
                MARKER_SIZE.height,
              ),
              scaledSize: new maps.Size(
                MARKER_SIZE.width,
                MARKER_SIZE.height,
              ),
              url: markerIcon,
            },
        map: currentMap,
        optimized: true,
        position: { lat: item.latitude, lng: item.longitude },
        title: isCluster
          ? `${item.count} parkings`
          : (item.address ?? 'Parking'),
        zIndex: isCluster ? Number(maps.Marker.MAX_ZINDEX) + item.count : 1,
      })

      marker.addListener('click', () => handleMarkerClick(item))

      return marker
    })

    return () => {
      markers.forEach((marker) => {
        marker.setMap(null)
      })
    }

    function handleMarkerClick(item: ParkingMapItem) {
      currentMap.panTo({ lat: item.latitude, lng: item.longitude })

      if (item.isCluster) {
        currentMap.setZoom((currentMap.getZoom() ?? mapsConfig.defaultZoom) + 2)
      } else {
        onSelectParking?.(item)
      }
    }
  }, [map, onSelectParking, parkingItems])

  if (!error && !isLoading) {
    return null
  }

  return (
    <div className="pointer-events-none absolute right-4 top-4 rounded-md bg-surface px-3 py-2 text-sm text-text-secondary shadow-sm">
      {error ? 'Unable to load parkings' : 'Loading parkings...'}
    </div>
  )
}

function ParkingFocusController({
  focusedParking,
}: Pick<ParkingMapProps, 'focusedParking'>) {
  const map = useMap()

  useEffect(() => {
    if (
      !map ||
      focusedParking?.latitude === null ||
      focusedParking?.latitude === undefined ||
      focusedParking?.longitude === null ||
      focusedParking?.longitude === undefined
    ) {
      return
    }

    map.panTo({
      lat: focusedParking.latitude,
      lng: focusedParking.longitude,
    })
  }, [focusedParking, map])

  return null
}

export function ParkingMap({ focusedParking, onSelectParking }: ParkingMapProps) {
  if (!mapsConfig.apiKey) {
    return (
      <section className="flex min-h-[520px] items-center justify-center rounded-lg border border-dashed border-form-border bg-surface p-6 text-center">
        <div className="max-w-md">
          <MapPinned className="mx-auto mb-3 text-map-marker" size={36} />
          <h2 className="text-lg font-semibold text-text-primary">
            Google Maps key is not configured
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Create a local .env file from .env.example and set
            VITE_GOOGLE_MAPS_API_KEY.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      <APIProvider apiKey={mapsConfig.apiKey}>
        <Map
          className="relative h-[calc(100vh-32px)] min-h-[520px] w-full"
          defaultCenter={mapsConfig.defaultCenter}
          defaultZoom={mapsConfig.defaultZoom}
          gestureHandling="greedy"
          mapId="truck-admin-parking-map"
        >
          <ParkingFocusController focusedParking={focusedParking} />
          <ParkingMarkerLayer onSelectParking={onSelectParking} />
        </Map>
      </APIProvider>
    </section>
  )
}
