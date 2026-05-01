import { APIProvider } from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'
import tickSquareIcon from '../assets/icons/tick-square.svg'
import { ParkingMap } from '../components/maps/ParkingMap'
import { mapsConfig } from '../config/maps'
import { getParkingMessages } from '../constants/parkingI18n'
import { AddParkingPanel } from '../features/parking/AddParkingPanel'
import {
  ADD_PARKING_STORAGE_KEY,
  createEmptyAddParkingDraft,
  loadAddParkingDraft,
  type AddParkingDraft,
  type AddParkingServiceKey,
} from '../features/parking/addParkingDraft'
import { ParkingDetailsPanel } from '../features/parking/ParkingDetailsPanel'
import { ParkingListPanel } from '../features/parking/ParkingListPanel'
import { useParkingAdminPanels } from '../features/parking/useParkingAdminPanels'
import { useSystemLocale } from '../hooks/useSystemLocale'
import { createParking } from '../services/parkingService'
import type {
  ParkingDetailItem,
  ParkingListItem,
  ParkingMapItem,
} from '../types/parking'

function ParkingAddedDialog({
  onClose,
}: {
  onClose: () => void
}) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 p-6 backdrop-blur-[3px]">
      <section
        aria-modal="true"
        className="flex w-full max-w-80 flex-col items-center gap-6 rounded-xl bg-surface px-4 py-10 shadow-[0_16px_48px_rgb(0_0_0_/_0.18)]"
        role="dialog"
      >
        <img
          alt=""
          aria-hidden="true"
          className="size-20"
          src={tickSquareIcon}
        />
        <div className="flex w-full flex-col items-center gap-2">
          <h2 className="text-center font-heading text-xl leading-7 font-semibold text-text-primary">
            {messages.parkingAddedTitle}
          </h2>
          <p className="text-center font-heading text-base leading-5 font-normal text-text-secondary">
            {messages.parkingAddedDescription}
          </p>
        </div>
        <button
          className="flex h-14 w-full items-center justify-center rounded-xl bg-primary px-6 font-heading text-base leading-6 font-medium text-white transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
          onClick={onClose}
          type="button"
        >
          {messages.ok}
        </button>
      </section>
    </div>
  )
}

function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && error !== null) {
    const record = error as Record<string, unknown>
    const parts = [record.message, record.code, record.details, record.hint]
      .filter((value): value is string => typeof value === 'string' && value.length > 0)

    if (parts.length > 0) {
      return parts.join(' ')
    }
  }

  if (typeof error === 'string') {
    return error
  }

  return null
}

export function ParkingAdminPage() {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const { activePanel, closePanel, showParkingDetails, showParkingList } =
    useParkingAdminPanels()
  const [selectedParking, setSelectedParking] = useState<ParkingDetailItem | null>(
    null,
  )
  const [focusedParking, setFocusedParking] = useState<{
    latitude: number | null
    longitude: number | null
  } | null>(null)
  const [addParkingDraft, setAddParkingDraft] = useState<AddParkingDraft>(() =>
    loadAddParkingDraft(),
  )
  const [isAddParkingSuccessOpen, setIsAddParkingSuccessOpen] = useState(false)
  const [mapRefreshKey, setMapRefreshKey] = useState(0)
  const [isSavingParking, setIsSavingParking] = useState(false)
  const [saveParkingError, setSaveParkingError] = useState<string | null>(null)

  useEffect(() => {
    window.localStorage.setItem(
      ADD_PARKING_STORAGE_KEY,
      JSON.stringify(addParkingDraft),
    )
  }, [addParkingDraft])

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

  function updateAddParkingDraft(patch: Partial<AddParkingDraft>) {
    setAddParkingDraft((currentDraft) => ({
      ...currentDraft,
      ...patch,
    }))
  }

  function handleAddressInputChange(value: string) {
    updateAddParkingDraft({
      address: value,
      latitude: null,
      longitude: null,
    })
  }

  function handleCapacityChange(value: string) {
    updateAddParkingDraft({ capacity: value })
  }

  function handlePhotosChange(photos: string[]) {
    updateAddParkingDraft({ photos })
  }

  function handleToggleService(serviceId: AddParkingServiceKey) {
    setAddParkingDraft((currentDraft) => ({
      ...currentDraft,
      services: {
        ...currentDraft.services,
        [serviceId]: !currentDraft.services[serviceId],
      },
    }))
  }

  function handleAddParkingLocationSelect(location: {
    address: string
    latitude: number
    longitude: number
  }) {
    updateAddParkingDraft(location)
    setFocusedParking({
      latitude: location.latitude,
      longitude: location.longitude,
    })
  }

  async function handleCreateParking() {
    if (
      addParkingDraft.latitude === null ||
      addParkingDraft.longitude === null ||
      isSavingParking
    ) {
      return
    }

    setIsSavingParking(true)
    setSaveParkingError(null)

    const address = addParkingDraft.address.trim()
    const normalizedAddress =
      !address || address === messages.noAddress ? 'no address' : address
    const capacity = addParkingDraft.capacity.trim()
      ? Number(addParkingDraft.capacity)
      : null

    try {
      await createParking({
        address: normalizedAddress,
        capacity,
        latitude: addParkingDraft.latitude,
        longitude: addParkingDraft.longitude,
        photos: addParkingDraft.photos,
        services: addParkingDraft.services,
      })

      setAddParkingDraft(createEmptyAddParkingDraft())
      setFocusedParking(null)
      setMapRefreshKey((currentKey) => currentKey + 1)
      closePanel()
      setIsAddParkingSuccessOpen(true)
    } catch (error) {
      const details = getErrorDetails(error)
      setSaveParkingError(
        details
          ? `${messages.unableToSaveParking} ${details}`
          : messages.unableToSaveParking,
      )
    } finally {
      setIsSavingParking(false)
    }
  }

  if (!mapsConfig.apiKey) {
    return <ParkingMap />
  }

  return (
    <APIProvider apiKey={mapsConfig.apiKey} language="en" libraries={['places']}>
      <div className="relative min-h-screen bg-background">
        <ParkingMap
          addParkingDraft={activePanel === 'add-parking' ? addParkingDraft : null}
          focusedParking={focusedParking}
          onAddParkingLocationSelect={handleAddParkingLocationSelect}
          onSelectParking={handleSelectParking}
          refreshKey={mapRefreshKey}
        />
        {activePanel === 'parking-list' ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[24.5rem]">
            <ParkingListPanel
              onClose={closePanel}
              onSelectParking={handleSelectParking}
            />
          </div>
        ) : null}
        {activePanel === 'add-parking' ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[24.5rem]">
            <AddParkingPanel
              draft={addParkingDraft}
              onAddressInputChange={handleAddressInputChange}
              onCapacityChange={handleCapacityChange}
              onClose={closePanel}
              onLocationSelect={handleAddParkingLocationSelect}
              onPhotosChange={handlePhotosChange}
              onSubmit={() => void handleCreateParking()}
              onToggleService={handleToggleService}
              saveError={saveParkingError}
              saving={isSavingParking}
            />
          </div>
        ) : null}
        {activePanel === 'parking-details' && selectedParking ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[28rem]">
            <ParkingDetailsPanel
              key={selectedParking.id}
              onClose={handleCloseParkingDetails}
              parking={selectedParking}
            />
          </div>
        ) : null}
        {isAddParkingSuccessOpen ? (
          <ParkingAddedDialog
            onClose={() => setIsAddParkingSuccessOpen(false)}
          />
        ) : null}
      </div>
    </APIProvider>
  )
}
