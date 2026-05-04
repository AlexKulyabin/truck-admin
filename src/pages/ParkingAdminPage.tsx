import { APIProvider } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'
import tickSquareIcon from '../assets/icons/tick-square.svg'
import trashBigIcon from '../assets/icons/trash-big.svg'
import radioOffIcon from '../assets/icons/radio-off.svg'
import radioOnIcon from '../assets/icons/radio-on.svg'
import { ParkingMap } from '../components/maps/ParkingMap'
import { mapsConfig } from '../config/maps'
import {
  getParkingMessages,
  type ParkingRejectionReasonCode,
  type SupportedLocale,
} from '../constants/parkingI18n'
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
import { ParkingComplaintDetailsPanel } from '../features/parking/ParkingComplaintDetailsPanel'
import { ParkingReviewDetailsPanel } from '../features/parking/ParkingReviewDetailsPanel'
import { ParkingReviewsPanel } from '../features/parking/ParkingReviewsPanel'
import { ParkingUserProfilePanel } from '../features/parking/ParkingUserProfilePanel'
import { RequestsPanel } from '../features/parking/RequestsPanel'
import { useParkingAdminPanels } from '../features/parking/useParkingAdminPanels'
import { useSystemLocale } from '../hooks/useSystemLocale'
import { cn } from '../lib/cn'
import {
  createParking,
  deleteParking,
  getParkingForEdit,
  updateParking,
  updateParkingStatus,
} from '../services/parkingService'
import type {
  ParkingDetailItem,
  ParkingListItem,
  ParkingMapItem,
  ParkingAuthor,
  ParkingComplaint,
  ParkingReview,
} from '../types/parking'

type SuccessDialogContent = {
  description: string
  title: string
}

type RejectionReasonOption = {
  label: string
  value: ParkingRejectionReasonCode
}

function ParkingDeleteDialog({
  isDeleting,
  locale,
  onCancel,
  onConfirm,
}: {
  isDeleting: boolean
  locale: SupportedLocale
  onCancel: () => void
  onConfirm: () => void
}) {
  const messages = getParkingMessages(locale)

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 p-6 backdrop-blur-[3px]">
      <section
        aria-modal="true"
        className="w-full max-w-80 overflow-hidden rounded-xl bg-white px-4 py-10 shadow-[0_16px_48px_rgb(0_0_0_/_0.18)]"
        role="dialog"
      >
        <div className="flex flex-col items-center gap-6">
          <img alt="" aria-hidden="true" className="size-20" src={trashBigIcon} />
          <div className="flex w-full flex-col items-center gap-2">
            <h2 className="text-center font-heading text-xl leading-7 font-medium text-black">
              {messages.deleteParkingDialogTitle}
            </h2>
            <p className="text-center font-heading text-base leading-5 font-normal text-zinc-600">
              {messages.deleteParkingDialogSubtitle}
            </p>
          </div>
          <div className="flex w-full gap-2">
            <button
              className="flex h-14 flex-1 items-center justify-center rounded-xl bg-[#E5E7EB] px-6 font-heading text-base leading-6 font-medium tracking-tight text-primary transition hover:bg-[#DDE3EA] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isDeleting}
              onClick={onCancel}
              type="button"
            >
              {messages.deleteParkingDialogCancel}
            </button>
            <button
              className="flex h-14 flex-1 items-center justify-center rounded-xl bg-[#FF5F57] px-6 font-heading text-base leading-6 font-medium tracking-tight text-white transition hover:bg-[#f4534b] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isDeleting}
              onClick={onConfirm}
              type="button"
            >
              {messages.deleteParkingDialogConfirm}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
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

function ParkingApprovalDialog({
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
        className="w-full max-w-[24.5625rem] overflow-hidden rounded-[10px] bg-white px-4 py-10 shadow-[0_16px_48px_rgb(0_0_0_/_0.18)] sm:px-5"
        role="dialog"
      >
        <div className="flex flex-col items-center gap-6">
          <img
            alt=""
            aria-hidden="true"
            className="size-20"
            src={tickSquareIcon}
          />
          <div className="flex w-full flex-col items-center gap-2">
            <h2 className="text-center font-heading text-xl leading-7 font-semibold text-black">
              {content.title}
            </h2>
            <p className="text-center font-heading text-base leading-5 font-normal text-zinc-600">
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
        </div>
      </section>
    </div>
  )
}

function ParkingRejectDialog({
  isSaving,
  locale,
  onClose,
  onConfirm,
  onSelectReason,
  reason,
}: {
  isSaving: boolean
  locale: SupportedLocale
  onClose: () => void
  onConfirm: () => void
  onSelectReason: (_reason: ParkingRejectionReasonCode) => void
  reason: ParkingRejectionReasonCode | null
}) {
  const messages = getParkingMessages(locale)
  const options: RejectionReasonOption[] = [
    { label: messages.rejectionReasonDuplicate, value: 'duplicate' },
    { label: messages.rejectionReasonIncompleteData, value: 'incomplete_data' },
    {
      label: messages.rejectionReasonNotMeetingRequirements,
      value: 'not_meeting_requirements',
    },
  ]
  const canConfirm = reason !== null && !isSaving

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 p-6 backdrop-blur-[3px]">
      <section
        aria-modal="true"
        className="w-full max-w-[24.5625rem] overflow-hidden rounded-[10px] bg-white px-4 pt-4 pb-6 shadow-[0_16px_48px_rgb(0_0_0_/_0.18)] sm:px-5"
        role="dialog"
      >
        <div className="flex h-16 items-center justify-between px-1 py-2">
          <div className="max-w-[16rem] sm:max-w-[17rem]">
            <h2 className="truncate font-heading text-xl leading-7 font-normal text-black">
              {messages.rejectDialogTitle}
            </h2>
            <p className="font-heading text-xs font-medium leading-4 tracking-wide text-zinc-600">
              {messages.rejectDialogSubtitle}
            </p>
          </div>
          <button
            aria-label={messages.close}
            className="flex size-12 items-center justify-center text-zinc-600 transition hover:text-text-primary"
            onClick={onClose}
            type="button"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <div className="flex flex-col items-start">
          {options.map((option) => {
            const isSelected = reason === option.value

            return (
              <button
                className={cn(
                  'flex w-full items-center justify-between rounded-[18px] pr-3 text-left transition focus:outline-none',
                  isSelected ? 'bg-surface' : 'bg-transparent hover:bg-surface-muted',
                )}
                key={option.value}
                onClick={() => onSelectReason(option.value)}
                type="button"
              >
                <div className="min-w-0 flex-1 px-4 py-3.5">
                  <span className="block font-heading text-base font-normal leading-5 text-black">
                    {option.label}
                  </span>
                </div>
                <img
                  alt=""
                  aria-hidden="true"
                  className="size-6 shrink-0"
                  src={isSelected ? radioOnIcon : radioOffIcon}
                />
              </button>
            )
          })}
        </div>

        <div className="w-full px-1 pt-4">
          <button
            className={cn(
              'flex h-14 w-full items-center justify-center rounded-[14px] px-6 font-heading text-base leading-6 font-medium tracking-tight transition',
              canConfirm
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'cursor-not-allowed bg-[#F2F4F7] text-[#98A2B3]',
            )}
            disabled={!canConfirm}
            onClick={onConfirm}
            type="button"
          >
            {messages.rejectDialogDone}
          </button>
        </div>
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
    navigationKey,
    showEditParking,
    showParkingDetails,
    showParkingList,
    showRequests,
    showReviews,
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
  const [approvalDialogContent, setApprovalDialogContent] =
    useState<SuccessDialogContent | null>(null)
  const [mapRefreshKey, setMapRefreshKey] = useState(0)
  const [isSavingParking, setIsSavingParking] = useState(false)
  const [saveParkingError, setSaveParkingError] = useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [detailsMode, setDetailsMode] = useState<'default' | 'request'>('default')
  const [requestsDefaultTab, setRequestsDefaultTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [selectedAuthor, setSelectedAuthor] = useState<ParkingAuthor | null>(null)
  const [selectedComplaint, setSelectedComplaint] = useState<ParkingComplaint | null>(null)
  const [selectedReview, setSelectedReview] = useState<ParkingReview | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeletingParking, setIsDeletingParking] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] =
    useState<ParkingRejectionReasonCode | null>(null)
  const parkingDetailsReturnPanelRef = useRef<ReturnType<
    typeof useParkingAdminPanels
  >['activePanel']>(null)
  const authorProfileReturnPanelRef = useRef<ReturnType<typeof useParkingAdminPanels>['activePanel']>(null)
  const complaintDetailsReturnPanelRef = useRef<ReturnType<typeof useParkingAdminPanels>['activePanel']>(null)
  const reviewDetailsReturnPanelRef = useRef<ReturnType<typeof useParkingAdminPanels>['activePanel']>(null)
  const previousPanelRef = useRef(activePanel)
  const isParkingFormOpen =
    activePanel === 'add-parking' || activePanel === 'edit-parking'
  const isFloatingPanelOpen = Boolean(
    selectedAuthor?.id || selectedReview || selectedComplaint,
  )

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

  useEffect(() => {
    setSelectedAuthor(null)
    setSelectedComplaint(null)
    setSelectedReview(null)
    setIsDeleteDialogOpen(false)
    setIsDeletingParking(false)
    setIsRejectDialogOpen(false)
    setRejectionReason(null)
    setApprovalDialogContent(null)
    setStatusError(null)
    authorProfileReturnPanelRef.current = null
  }, [navigationKey])

  function handleSelectParking(parking: ParkingMapItem | ParkingListItem, fromRequests = false) {
    setEditingParkingId(null)
    setSaveParkingError(null)
    setStatusError(null)
    setSelectedAuthor(null)
    setSelectedComplaint(null)
    setSelectedReview(null)
    setDetailsMode(fromRequests ? 'request' : 'default')
    setSelectedParking(parking)
    parkingDetailsReturnPanelRef.current = activePanel
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
      setSelectedAuthor(null)
      setSelectedComplaint(null)
      setSelectedReview(null)
      setRequestsDefaultTab('approved')
      setApprovalDialogContent({
        description: messages.approvalDialogSubtitle,
        title: messages.approvalDialogTitle,
      })
    } catch (error) {
      const details = getErrorDetails(error)
      setStatusError(details ? `${messages.unableToUpdateStatus} ${details}` : messages.unableToUpdateStatus)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  function handleOpenRejectDialog() {
    if (!selectedParking || isUpdatingStatus) return

    setRejectionReason(null)
    setIsRejectDialogOpen(true)
  }

  function handleOpenDeleteDialog() {
    if (!selectedParking || isUpdatingStatus || isDeletingParking) return

    setStatusError(null)
    setIsDeleteDialogOpen(true)
  }

  function handleCloseRejectDialog() {
    if (isUpdatingStatus) return

    setIsRejectDialogOpen(false)
    setRejectionReason(null)
  }

  function handleCloseDeleteDialog() {
    if (isDeletingParking) return

    setIsDeleteDialogOpen(false)
  }

  async function handleRejectParking() {
    if (!selectedParking || isUpdatingStatus || !rejectionReason) return
    setIsUpdatingStatus(true)
    setStatusError(null)
    try {
      await updateParkingStatus(selectedParking.id, 'rejected', rejectionReason)
      setMapRefreshKey((k) => k + 1)
      setSelectedParking(null)
      setSelectedAuthor(null)
      setSelectedComplaint(null)
      setSelectedReview(null)
      setIsRejectDialogOpen(false)
      setRejectionReason(null)
      setRequestsDefaultTab('rejected')
      showRequests()
    } catch (error) {
      const details = getErrorDetails(error)
      setStatusError(details ? `${messages.unableToUpdateStatus} ${details}` : messages.unableToUpdateStatus)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  async function handleDeleteParking() {
    if (!selectedParking || isDeletingParking) return

    setIsDeletingParking(true)
    setStatusError(null)

    try {
      await deleteParking(selectedParking.id)
      setMapRefreshKey((currentKey) => currentKey + 1)
      setSelectedParking(null)
      setSelectedAuthor(null)
      setSelectedComplaint(null)
      setSelectedReview(null)
      setFocusedParking(null)
      setIsDeleteDialogOpen(false)
      const returnPanel = parkingDetailsReturnPanelRef.current
      parkingDetailsReturnPanelRef.current = null

      if (returnPanel === 'requests') {
        showRequests()
        return
      }

      if (returnPanel === 'reviews') {
        showReviews()
        return
      }

      showParkingList()
    } catch (error) {
      const details = getErrorDetails(error)
      setStatusError(
        details
          ? `${messages.unableToDeleteParking} ${details}`
          : messages.unableToDeleteParking,
      )
      setIsDeleteDialogOpen(false)
    } finally {
      setIsDeletingParking(false)
    }
  }

  function handleCloseParkingDetails() {
    setSelectedParking(null)
    setEditingParkingId(null)
    setSelectedAuthor(null)
    setSelectedComplaint(null)
    setSelectedReview(null)
    setIsDeleteDialogOpen(false)
    setIsDeletingParking(false)
    setIsRejectDialogOpen(false)
    setRejectionReason(null)
    setApprovalDialogContent(null)
    authorProfileReturnPanelRef.current = null
    const returnPanel = parkingDetailsReturnPanelRef.current
    parkingDetailsReturnPanelRef.current = null

    if (returnPanel === 'requests') {
      showRequests()
      return
    }

    if (returnPanel === 'reviews') {
      showReviews()
      return
    }

    showParkingList()
  }

  function handleOpenAuthorProfile(author: ParkingAuthor) {
    if (!author.id) {
      return
    }

    setSelectedAuthor(author)
    authorProfileReturnPanelRef.current = activePanel
    closePanel()
  }

  function handleCloseAuthorProfile() {
    setSelectedAuthor(null)
    const returnPanel = authorProfileReturnPanelRef.current
    authorProfileReturnPanelRef.current = null

    if (returnPanel === 'parking-details' && selectedParking) {
      showParkingDetails()
      return
    }

    showParkingList()
  }

  function handleOpenReviewDetails(review: ParkingReview) {
    setSelectedReview(review)
    reviewDetailsReturnPanelRef.current = activePanel
  }

  function handleOpenComplaintDetails(complaint: ParkingComplaint) {
    setSelectedComplaint(complaint)
    complaintDetailsReturnPanelRef.current = activePanel
  }

  function handleCloseComplaintDetails() {
    setSelectedComplaint(null)
    const returnPanel = complaintDetailsReturnPanelRef.current
    complaintDetailsReturnPanelRef.current = null

    if (returnPanel === 'parking-details' && selectedParking) {
      showParkingDetails()
      return
    }

    if (returnPanel === 'reviews') {
      showReviews()
      return
    }

    showParkingList()
  }

  function handleCloseReviewDetails() {
    setSelectedReview(null)
    const returnPanel = reviewDetailsReturnPanelRef.current
    reviewDetailsReturnPanelRef.current = null

    if (returnPanel === 'parking-details' && selectedParking) {
      showParkingDetails()
      return
    }

    if (returnPanel === 'reviews') {
      showReviews()
      return
    }

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
        {activePanel === 'parking-list' && !isFloatingPanelOpen ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[24.5rem]">
            <ParkingListPanel
              onClose={closePanel}
              onSelectParking={handleSelectParking}
            />
          </div>
        ) : null}
        {activePanel === 'reviews' && !isFloatingPanelOpen ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[24.5rem]">
            <ParkingReviewsPanel
              onOpenComplaintDetails={handleOpenComplaintDetails}
              onOpenReviewDetails={handleOpenReviewDetails}
              onClose={closePanel}
            />
          </div>
        ) : null}
        {activePanel === 'requests' && !isFloatingPanelOpen ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[24.5rem]">
            <RequestsPanel
              key={requestsDefaultTab}
              defaultTab={requestsDefaultTab}
              onClose={closePanel}
              onSelectParking={(parking) => handleSelectParking(parking, true)}
            />
          </div>
        ) : null}
        {isParkingFormOpen && !isFloatingPanelOpen ? (
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
        {activePanel === 'parking-details' && selectedParking && !isFloatingPanelOpen ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full max-w-[28rem]">
            <ParkingDetailsPanel
              key={selectedParking.id}
              isUpdatingStatus={isUpdatingStatus}
              mode={detailsMode}
              onApprove={() => void handleApproveParking()}
              onClose={handleCloseParkingDetails}
              onEdit={(parking) => void handleOpenEditParking(parking)}
              onDelete={handleOpenDeleteDialog}
              onReject={handleOpenRejectDialog}
              onOpenComplaintDetails={handleOpenComplaintDetails}
              onOpenAuthorProfile={handleOpenAuthorProfile}
              onOpenReviewDetails={handleOpenReviewDetails}
              parking={selectedParking}
              statusError={statusError}
            />
          </div>
        ) : null}
        {selectedAuthor?.id ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-full max-w-[28rem]">
            <ParkingUserProfilePanel
              author={selectedAuthor}
              onClose={handleCloseAuthorProfile}
            />
          </div>
        ) : null}
        {selectedReview ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-full max-w-[24.5rem]">
            <ParkingReviewDetailsPanel
              key={selectedReview.id}
              onBack={handleCloseReviewDetails}
              onClose={handleCloseReviewDetails}
              onDelete={handleCloseReviewDetails}
              review={selectedReview}
            />
          </div>
        ) : null}
        {selectedComplaint ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-full max-w-[24.5rem]">
            <ParkingComplaintDetailsPanel
              key={selectedComplaint.id}
              complaint={selectedComplaint}
              onBack={handleCloseComplaintDetails}
              onClose={handleCloseComplaintDetails}
              onDelete={() => undefined}
            />
          </div>
        ) : null}
        {successDialogContent ? (
          <ParkingSuccessDialog
            content={successDialogContent}
            onClose={() => setSuccessDialogContent(null)}
          />
        ) : null}
        {approvalDialogContent ? (
          <ParkingApprovalDialog
            content={approvalDialogContent}
            onClose={() => {
              setApprovalDialogContent(null)
              showRequests()
            }}
          />
        ) : null}
        {isRejectDialogOpen ? (
          <ParkingRejectDialog
            isSaving={isUpdatingStatus}
            locale={locale}
            onClose={handleCloseRejectDialog}
            onConfirm={() => void handleRejectParking()}
            onSelectReason={setRejectionReason}
            reason={rejectionReason}
          />
        ) : null}
        {isDeleteDialogOpen ? (
          <ParkingDeleteDialog
            isDeleting={isDeletingParking}
            locale={locale}
            onCancel={handleCloseDeleteDialog}
            onConfirm={() => void handleDeleteParking()}
          />
        ) : null}
      </div>
    </APIProvider>
  )
}


