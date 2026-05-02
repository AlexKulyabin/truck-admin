import { APIProvider } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'
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
  type AddParkingDraftPhoto,
  type AddParkingServiceKey,
} from '../features/parking/addParkingDraft'
import { ParkingDetailsPanel } from '../features/parking/ParkingDetailsPanel'
import { ParkingListPanel } from '../features/parking/ParkingListPanel'
import { RequestsPanel } from '../features/parking/RequestsPanel'
import { useParkingAdminPanels } from '../features/parking/useParkingAdminPanels'
import { useSystemLocale } from '../hooks/useSystemLocale'
import {
  createParking,
  getParkingForEdit,
  updateParking,
  updateParkingStatus,
} from '../services/parkingService'
import type {
  ParkingDetailItem,
  ParkingListItem,
  ParkingMapItem,
} from '../types/parking'

type SuccessDialogContent = {
  description: string
  title: string
}

function ParkingSuccessDialog({
  content,
  onClose,
}: {
  content: SuccessDialogContent
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
            {content.title}
          </h2>
          <p className="text-center font-heading text-base leading-5 font-normal text-text-secondary">
            {content.description}
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
  const {
    activePanel,
    closePanel,
    showEditParking,
    showParkingDetails,
    showParkingList,
    showRequests,
  } = useParkingAdminPanels()
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
  const [editingParkingId, setEditingParkingId] = useState<string | null>(null)
  const [successDialogContent, setSuccessDialogContent] =
    useState<SuccessDialogContent | null>(null)
  const [mapRefreshKey, setMapRefreshKey] = useState(0)
  const [isSavingParking, setIsSavingParking] = useState(false)
  const [saveParkingError, setSaveParkingError] = useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [detailsMode, setDetailsMode] = useState<'default' | 'request'>('default')
  const [requestsDefaultTab, setRequestsDefaultTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const previousPanelRef = useRef(activePanel)
  const isParkingFormOpen =
    activePanel === 'add-parking' || activePanel === 'edit-parking'

  useEffect(() => {
    const previousPanel = previousPanelRef.current

    if (activePanel === 'add-parking' && previousPanel !== 'add-parking') {
      setEditingParkingId(null)
      setSaveParkingError(null)
      setAddParkingDraft(loadAddParkingDraft())
    }

    previousPanelRef.current = activePanel
  }, [activePanel])

  useEffect(() => {
    if (activePanel !== 'add-parking') {
      return
    }

    window.localStorage.setItem(
      ADD_PARKING_STORAGE_KEY,
      JSON.stringify(addParkingDraft),
    )
  }, [activePanel, addParkingDraft])

  function handleSelectParking(parking: ParkingMapItem | ParkingListItem, fromRequests = false) {
    setEditingParkingId(null)
    setSaveParkingError(null)
    setStatusError(null)
    setDetailsMode(fromRequests ? 'request' : 'default')
    setSelectedParking(parking)
    setFocusedParking({
      latitude: 'latitude' in parking ? parking.latitude : null,
      longitude: 'longitude' in parking ? parking.longitude : null,
    })
    showParkingDetails()
  }

  async function handleApproveParking() {
    if (!selectedParking || isUpdatingStatus) return
    setIsUpdatingStatus(true)
    setStatusError(null)
    try {
      await updateParkingStatus(selectedParking.id, 'approved')
      setMapRefreshKey((k) => k + 1)
      setSelectedParking(null)
      setRequestsDefaultTab('approved')
      showRequests()
    } catch (error) {
      const details = getErrorDetails(error)
      setStatusError(details ? `${messages.unableToUpdateStatus} ${details}` : messages.unableToUpdateStatus)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  async function handleRejectParking() {
    if (!selectedParking || isUpdatingStatus) return
    setIsUpdatingStatus(true)
    setStatusError(null)
    try {
      await updateParkingStatus(selectedParking.id, 'rejected')
      setMapRefreshKey((k) => k + 1)
      setSelectedParking(null)
      setRequestsDefaultTab('rejected')
      showRequests()
    } catch (error) {
      const details = getErrorDetails(error)
      setStatusError(details ? `${messages.unableToUpdateStatus} ${details}` : messages.unableToUpdateStatus)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  function handleCloseParkingDetails() {
    setSelectedParking(null)
    setEditingParkingId(null)
    showParkingList()
  }

  function handleCloseParkingForm() {
    setSaveParkingError(null)

    if (activePanel === 'edit-parking') {
      showParkingDetails()
      return
    }

    closePanel()
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

  function handlePhotosChange(photos: AddParkingDraftPhoto[]) {
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
      setSuccessDialogContent({
        description: messages.parkingAddedDescription,
        title: messages.parkingAddedTitle,
      })
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

  async function handleOpenEditParking(parking: ParkingDetailItem) {
    setSaveParkingError(null)

    try {
      const editDraft = await getParkingForEdit(parking.id)
      const normalizedEditDraft = {
        ...editDraft,
        address:
          editDraft.address.trim() ||
          (editDraft.latitude !== null && editDraft.longitude !== null
            ? messages.noAddress
            : ''),
      }
      setAddParkingDraft(normalizedEditDraft)
      setEditingParkingId(parking.id)
      setFocusedParking({
        latitude: normalizedEditDraft.latitude,
        longitude: normalizedEditDraft.longitude,
      })
      showEditParking()
    } catch (error) {
      const details = getErrorDetails(error)
      setSaveParkingError(
        details
          ? `${messages.unableToUpdateParking} ${details}`
          : messages.unableToUpdateParking,
      )
    }
  }

  async function handleUpdateParking() {
    if (
      !editingParkingId ||
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
      await updateParking(editingParkingId, {
        address: normalizedAddress,
        capacity,
        latitude: addParkingDraft.latitude,
        longitude: addParkingDraft.longitude,
        photos: addParkingDraft.photos,
        services: addParkingDraft.services,
      })

      setSelectedParking((currentParking) =>
        currentParking?.id === editingParkingId
          ? {
              ...currentParking,
              address: normalizedAddress,
            }
          : currentParking,
      )
      setFocusedParking({
        latitude: addParkingDraft.latitude,
        longitude: addParkingDraft.longitude,
      })
      setMapRefreshKey((currentKey) => currentKey + 1)
      closePanel()
      setEditingParkingId(null)
      setSuccessDialogContent({
        description: messages.parkingUpdatedDescription,
        title: messages.parkingUpdatedTitle,
      })
    } catch (error) {
      const details = getErrorDetails(error)
      setSaveParkingError(
        details
          ? `${messages.unableToUpdateParking} ${details}`
          : messages.unableToUpdateParking,
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
          addParkingDraft={isParkingFormOpen ? addParkingDraft : null}
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
        {activePanel === 'requests' ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[24.5rem]">
            <RequestsPanel
              key={requestsDefaultTab}
              defaultTab={requestsDefaultTab}
              onClose={closePanel}
              onSelectParking={(parking) => handleSelectParking(parking, true)}
            />
          </div>
        ) : null}
        {isParkingFormOpen ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[24.5rem]">
            <AddParkingPanel
              draft={addParkingDraft}
              onAddressInputChange={handleAddressInputChange}
              onCapacityChange={handleCapacityChange}
              onClose={handleCloseParkingForm}
              onLocationSelect={handleAddParkingLocationSelect}
              onPhotosChange={handlePhotosChange}
              onSubmit={() =>
                activePanel === 'edit-parking'
                  ? void handleUpdateParking()
                  : void handleCreateParking()
              }
              onToggleService={handleToggleService}
              saveError={saveParkingError}
              saving={isSavingParking}
              submitLabel={
                activePanel === 'edit-parking'
                  ? messages.saveChanges
                  : messages.addParking
              }
              title={
                activePanel === 'edit-parking'
                  ? messages.editingParking
                  : messages.addingParking
              }
            />
          </div>
        ) : null}
        {activePanel === 'parking-details' && selectedParking ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[28rem]">
            <ParkingDetailsPanel
              key={selectedParking.id}
              isUpdatingStatus={isUpdatingStatus}
              mode={detailsMode}
              onApprove={() => void handleApproveParking()}
              onClose={handleCloseParkingDetails}
              onEdit={(parking) => void handleOpenEditParking(parking)}
              onReject={() => void handleRejectParking()}
              parking={selectedParking}
              statusError={statusError}
            />
          </div>
        ) : null}
        {successDialogContent ? (
          <ParkingSuccessDialog
            content={successDialogContent}
            onClose={() => setSuccessDialogContent(null)}
          />
        ) : null}
      </div>
    </APIProvider>
  )
}
