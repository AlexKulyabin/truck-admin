import { Map, useMap } from '@vis.gl/react-google-maps'
import { MapPinned } from 'lucide-react'
import { useEffect, useRef } from 'react'
import markerIcon from '../../assets/icons/marker.svg'
import { mapsConfig } from '../../config/maps'
import { MAP_CLUSTER_COLORS } from '../../constants/mapTheme'
import { getParkingMessages } from '../../constants/parkingI18n'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import { useParkingMapItems } from '../../hooks/useParkingMapItems'
import type { AddParkingDraft } from '../../features/parking/addParkingDraft'
import type { ParkingMapItem } from '../../types/parking'

type ParkingMapProps = {
  addParkingDraft?: AddParkingDraft | null
  focusedParking?: {
    latitude: number | null
    longitude: number | null
  } | null
  onAddParkingLocationSelect?: (_location: {
    address: string
    latitude: number
    longitude: number
  }) => void
  onSelectParking?: (_parking: ParkingMapItem) => void
  refreshKey?: number
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

function createParkingIcon() {
  const maps = google.maps

  return {
    anchor: new maps.Point(MARKER_SIZE.width / 2, MARKER_SIZE.height),
    scaledSize: new maps.Size(MARKER_SIZE.width, MARKER_SIZE.height),
    url: markerIcon,
  }
}

function createTemporaryParkingIcon() {
  const maps = google.maps
  const width = 32
  const height = 44
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 43C16 43 30 28.55 30 16C30 7.72 23.73 2 16 2C8.27 2 2 7.72 2 16C2 28.55 16 43 16 43Z" fill="#EF4444"/>
      <path d="M16 43C16 43 30 28.55 30 16C30 7.72 23.73 2 16 2C8.27 2 2 7.72 2 16C2 28.55 16 43 16 43Z" stroke="white" stroke-width="3"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `

  return {
    anchor: new maps.Point(width / 2, height),
    scaledSize: new maps.Size(width, height),
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

function ParkingMarkerLayer({ onSelectParking, refreshKey }: ParkingMapProps) {
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
  }, [loadParkingItems, map, refreshKey])

  useEffect(() => {
    if (!map) {
      return undefined
    }

    const currentMap = map
    const maps = google.maps
    const markers: google.maps.Marker[] = parkingItems.map((item) => {
      const isCluster = item.isCluster
      const marker = new maps.Marker({
        icon: isCluster ? createClusterIcon(item.count) : createParkingIcon(),
        map: currentMap,
        optimized: true,
        position: { lat: item.latitude, lng: item.longitude },
        title: isCluster ? `${item.count} parkings` : (item.address ?? 'Parking'),
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

function AddParkingMarkerController({
  addParkingDraft,
  onAddParkingLocationSelect,
}: Pick<ParkingMapProps, 'addParkingDraft' | 'onAddParkingLocationSelect'>) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const map = useMap()
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const lastPositionRef = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder()
    }
  }, [])

  useEffect(() => {
    if (!map || !addParkingDraft || !onAddParkingLocationSelect) {
      markerRef.current?.setMap(null)
      markerRef.current = null
      lastPositionRef.current = null
      return undefined
    }

    const currentMap = map

    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        draggable: true,
        icon: createTemporaryParkingIcon(),
        map: currentMap,
        optimized: true,
        zIndex: Number(google.maps.Marker.MAX_ZINDEX) + 1000,
      })
    } else {
      markerRef.current.setMap(currentMap)
    }

    const currentMarker = markerRef.current

    if (
      addParkingDraft.latitude !== null &&
      addParkingDraft.longitude !== null
    ) {
      const positionKey = `${addParkingDraft.latitude}:${addParkingDraft.longitude}`

      if (lastPositionRef.current !== positionKey) {
        currentMarker.setPosition({
          lat: addParkingDraft.latitude,
          lng: addParkingDraft.longitude,
        })
        lastPositionRef.current = positionKey
      }
    } else {
      currentMarker.setPosition(null)
      lastPositionRef.current = null
    }

    const handleLocationSelect = onAddParkingLocationSelect

    const dragendListener = currentMarker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) {
        return
      }

      void updateLocationFromLatLng(event.latLng)
    })

    const rightClickListener = currentMap.addListener('rightclick', (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) {
        return
      }

      currentMarker.setPosition(event.latLng)
      currentMap.panTo(event.latLng)
      lastPositionRef.current = `${event.latLng.lat()}:${event.latLng.lng()}`
      void updateLocationFromLatLng(event.latLng)
    })

    return () => {
      dragendListener.remove()
      rightClickListener.remove()
    }

    async function updateLocationFromLatLng(latLng: google.maps.LatLng) {
      const latitude = latLng.lat()
      const longitude = latLng.lng()
      const geocoder = geocoderRef.current

      if (!geocoder) {
        handleLocationSelect({
          address: messages.noAddress,
          latitude,
          longitude,
        })
        return
      }

      geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
        const nextAddress =
          status === 'OK' && results?.[0]?.formatted_address
            ? results[0].formatted_address
            : messages.noAddress

        handleLocationSelect({
          address: nextAddress,
          latitude,
          longitude,
        })
      })
    }
  }, [addParkingDraft, map, messages.noAddress, onAddParkingLocationSelect])

  return null
}

export function ParkingMap({
  addParkingDraft,
  focusedParking,
  onAddParkingLocationSelect,
  onSelectParking,
  refreshKey,
}: ParkingMapProps = {}) {
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
      <Map
        className="relative h-[calc(100vh-32px)] min-h-[520px] w-full"
        defaultCenter={mapsConfig.defaultCenter}
        defaultZoom={mapsConfig.defaultZoom}
        gestureHandling="greedy"
        mapId="truck-admin-parking-map"
      >
        <ParkingFocusController focusedParking={focusedParking} />
        <AddParkingMarkerController
          addParkingDraft={addParkingDraft}
          onAddParkingLocationSelect={onAddParkingLocationSelect}
        />
        <ParkingMarkerLayer
          onSelectParking={onSelectParking}
          refreshKey={refreshKey}
        />
      </Map>
    </section>
  )
}
