import { Check, Plus, Search, X } from 'lucide-react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import capasityIcon from '../../assets/icons/capasity.svg'
import gasStationIcon from '../../assets/icons/gas-station.svg'
import hotelIcon from '../../assets/icons/hotel.svg'
import laundryIcon from '../../assets/icons/laundry.svg'
import locationIcon from '../../assets/icons/location.svg'
import photoIcon from '../../assets/icons/photo.svg'
import recreationAreaIcon from '../../assets/icons/recreation-area.svg'
import shopIcon from '../../assets/icons/shop.svg'
import showerIcon from '../../assets/icons/shower.svg'
import { getParkingMessages } from '../../constants/parkingI18n'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import { cn } from '../../lib/cn'
import type {
  AddParkingDraft,
  AddParkingDraftPhoto,
  AddParkingServiceKey,
} from './addParkingDraft'

type AddressSuggestion = {
  id: string
  mainText: string
  placeId: string
  secondaryText: string
}

type AddressSelection = {
  address: string
  latitude: number
  longitude: number
}

type ServiceOption = {
  icon: string
  id: AddParkingServiceKey
  label: string
}

type AddParkingPanelProps = {
  draft: AddParkingDraft
  onAddressInputChange: (_value: string) => void
  onCapacityChange: (_value: string) => void
  onClose: () => void
  onLocationSelect: (_selection: AddressSelection) => void
  onPhotosChange: (_photos: AddParkingDraftPhoto[]) => void
  onSubmit: () => void
  onToggleService: (_serviceId: AddParkingServiceKey) => void
  saveError: string | null
  saving: boolean
  submitLabel: string
  title: string
}

function SectionCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-[10px] bg-surface shadow-card', className)}>
      {children}
    </section>
  )
}

function SectionHeader({
  icon,
  title,
}: {
  icon: string
  title: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <img alt="" aria-hidden="true" className="size-[1.875rem] shrink-0" src={icon} />
      <h3 className="font-heading text-base leading-6 font-medium text-text-primary">
        {title}
      </h3>
    </div>
  )
}

function readFilesAsDataUrls(files: FileList) {
  return Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result ?? ''))
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        }),
    ),
  )
}

function buildAddressSuggestions(
  predictions: google.maps.places.AutocompletePrediction[],
) {
  return predictions.map((prediction) => ({
    id: prediction.place_id,
    mainText: prediction.structured_formatting.main_text,
    placeId: prediction.place_id,
    secondaryText: prediction.structured_formatting.secondary_text ?? '',
  }))
}

export function AddParkingPanel({
  draft,
  onAddressInputChange,
  onCapacityChange,
  onClose,
  onLocationSelect,
  onPhotosChange,
  onSubmit,
  onToggleService,
  saveError,
  saving,
  submitLabel,
  title,
}: AddParkingPanelProps) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const placesLibrary = useMapsLibrary('places')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const photosScrollRef = useRef<HTMLDivElement | null>(null)
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)
  const suggestionsRequestIdRef = useRef(0)
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false)
  const [isSelectingSuggestion, setIsSelectingSuggestion] = useState(false)
  const [isUserSearchingAddress, setIsUserSearchingAddress] = useState(false)
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const photoDragStateRef = useRef({
    pointerId: null as number | null,
    scrollLeft: 0,
    startX: 0,
  })

  const serviceOptions = useMemo<ServiceOption[]>(
    () => [
      { icon: gasStationIcon, id: 'gas', label: messages.gasStation },
      { icon: showerIcon, id: 'shower', label: messages.shower },
      { icon: laundryIcon, id: 'laundry', label: messages.laundry },
      { icon: hotelIcon, id: 'hotel', label: messages.hotel },
      { icon: shopIcon, id: 'shop', label: messages.shop },
      {
        icon: recreationAreaIcon,
        id: 'recreation',
        label: messages.recreationArea,
      },
    ],
    [
      messages.gasStation,
      messages.hotel,
      messages.laundry,
      messages.recreationArea,
      messages.shop,
      messages.shower,
    ],
  )

  useEffect(() => {
    if (placesLibrary && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new placesLibrary.AutocompleteService()
    }

    if (typeof window !== 'undefined' && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder()
    }
  }, [placesLibrary])

  useEffect(() => {
    const trimmedAddress = draft.address.trim()

    if (
      !autocompleteServiceRef.current ||
      !isUserSearchingAddress ||
      isSelectingSuggestion ||
      trimmedAddress.length < 3 ||
      trimmedAddress === messages.noAddress
    ) {
      setSuggestions([])
      setIsSuggestionsLoading(false)
      return
    }

    const currentRequestId = suggestionsRequestIdRef.current + 1
    suggestionsRequestIdRef.current = currentRequestId
    setIsSuggestionsLoading(true)

    const timeoutId = window.setTimeout(() => {
      autocompleteServiceRef.current?.getPlacePredictions(
        {
          input: trimmedAddress,
          language: 'en',
          types: ['address'],
        },
        (predictions, status) => {
          if (currentRequestId !== suggestionsRequestIdRef.current) {
            return
          }

          setIsSuggestionsLoading(false)

          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !predictions?.length
          ) {
            setSuggestions([])
            return
          }

          setSuggestions(buildAddressSuggestions(predictions))
        },
      )
    }, 250)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [
    draft.address,
    isSelectingSuggestion,
    isUserSearchingAddress,
    messages.noAddress,
  ])

  async function handleSuggestionSelect(suggestion: AddressSuggestion) {
    if (!geocoderRef.current) {
      return
    }

    setIsSelectingSuggestion(true)
    setIsUserSearchingAddress(false)
    setSuggestions([])

    geocoderRef.current.geocode(
      { placeId: suggestion.placeId },
      (results, status) => {
        setIsSelectingSuggestion(false)

        if (status !== 'OK' || !results?.[0]) {
          return
        }

        const location = results[0].geometry.location
        const nextAddress = results[0].formatted_address?.trim() || suggestion.mainText

        onLocationSelect({
          address: nextAddress,
          latitude: location.lat(),
          longitude: location.lng(),
        })
      },
    )
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFiles = event.target.files

    if (!nextFiles?.length) {
      return
    }

    const photoDataUrls = await readFilesAsDataUrls(nextFiles)
    const nextPhotos = photoDataUrls.map<AddParkingDraftPhoto>((url) => ({
      id: null,
      isNew: true,
      url,
    }))

    onPhotosChange([...draft.photos, ...nextPhotos])
    event.target.value = ''
  }

  function removePhoto(indexToRemove: number) {
    onPhotosChange(draft.photos.filter((_, index) => index !== indexToRemove))
  }

  function handlePhotosPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (
      event.button !== 0 ||
      !photosScrollRef.current ||
      (event.target instanceof Element && event.target.closest('button'))
    ) {
      return
    }

    photoDragStateRef.current = {
      pointerId: event.pointerId,
      scrollLeft: photosScrollRef.current.scrollLeft,
      startX: event.clientX,
    }

    setIsDraggingPhotos(true)
    photosScrollRef.current.setPointerCapture(event.pointerId)
  }

  function handlePhotosPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (
      !isDraggingPhotos ||
      !photosScrollRef.current ||
      photoDragStateRef.current.pointerId !== event.pointerId
    ) {
      return
    }

    const deltaX = event.clientX - photoDragStateRef.current.startX
    photosScrollRef.current.scrollLeft = photoDragStateRef.current.scrollLeft - deltaX
  }

  function finishPhotosDragging(pointerId: number) {
    if (photoDragStateRef.current.pointerId !== pointerId) {
      return
    }

    setIsDraggingPhotos(false)
    photoDragStateRef.current.pointerId = null
  }

  function handleClearAddress() {
    setIsUserSearchingAddress(false)
    setSuggestions([])
    setIsSuggestionsLoading(false)
    onAddressInputChange('')
  }

  const hasSelectedLocation =
    draft.latitude !== null && draft.longitude !== null && draft.address.trim().length > 0
  const hasAddressText = draft.address.trim().length > 0

  return (
    <aside className="pointer-events-auto flex h-full w-full max-w-[24.5rem] flex-col overflow-hidden rounded-none border-r border-border bg-surface-muted shadow-[0_16px_40px_rgb(0_0_0_/_0.08)]">
      <div className="flex items-center justify-between gap-4 px-6 py-6">
        <h2 className="font-heading text-[20px] leading-7 font-normal text-text-primary">
          {title}
        </h2>
        <button
          aria-label={messages.close}
          className="flex size-10 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="size-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-2">
          <SectionCard className="relative">
            <label className="flex items-center gap-3 px-4 py-1">
              <img
                alt=""
                aria-hidden="true"
                className="size-[1.875rem] shrink-0"
                src={locationIcon}
              />
              <input
                autoComplete="off"
                className="h-12 min-w-0 flex-1 bg-transparent font-heading text-base font-normal text-text-primary outline-none placeholder:text-text-secondary"
                onChange={(event) => {
                  setIsUserSearchingAddress(true)
                  onAddressInputChange(event.target.value)
                }}
                placeholder={messages.enterAddress}
                type="text"
                value={draft.address}
              />
              {hasAddressText ? (
                <button
                  aria-label={messages.close}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                  onClick={handleClearAddress}
                  type="button"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              ) : (
                <Search
                  aria-hidden="true"
                  className="size-5 shrink-0 text-text-secondary"
                />
              )}
            </label>

            {draft.address.trim().length >= 3 &&
            (isSuggestionsLoading || suggestions.length > 0) ? (
              <div className="absolute inset-x-2 top-[calc(100%-0.25rem)] z-20 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                {isSuggestionsLoading ? (
                  <div className="px-4 py-3 font-heading text-sm text-text-secondary">
                    {messages.loading}
                  </div>
                ) : (
                  <ul className="max-h-64 overflow-y-auto py-2">
                    {suggestions.map((suggestion) => (
                      <li key={suggestion.id}>
                        <button
                          className="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition hover:bg-surface-muted focus:bg-surface-muted focus:outline-none"
                          onClick={() => void handleSuggestionSelect(suggestion)}
                          type="button"
                        >
                          <span className="font-heading text-sm font-medium text-text-primary">
                            {suggestion.mainText}
                          </span>
                          {suggestion.secondaryText ? (
                            <span className="font-heading text-xs text-text-secondary">
                              {suggestion.secondaryText}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </SectionCard>

          <SectionCard className="pb-4">
            <SectionHeader icon={photoIcon} title={messages.photo} />
            <input
              accept="image/*"
              className="hidden"
              multiple
              onChange={handlePhotoChange}
              ref={fileInputRef}
              type="file"
            />
            <div
              className={cn(
                'overflow-x-auto px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
                isDraggingPhotos ? 'cursor-grabbing select-none' : 'cursor-grab',
              )}
              onPointerCancel={(event) => finishPhotosDragging(event.pointerId)}
              onPointerDown={handlePhotosPointerDown}
              onPointerMove={handlePhotosPointerMove}
              onPointerUp={(event) => finishPhotosDragging(event.pointerId)}
              ref={photosScrollRef}
            >
              <div className="flex min-w-max items-center gap-2">
                <button
                  className="flex size-24 shrink-0 items-center justify-center rounded-xl border border-primary bg-surface text-primary transition hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <Plus aria-hidden="true" className="size-12 stroke-[1.2]" />
                </button>

                {draft.photos.map((photo, index) => (
                  <div
                    className="relative size-24 shrink-0 overflow-hidden rounded-xl"
                    key={`${photo.id ?? photo.url.slice(0, 32)}-${index}`}
                  >
                    <img
                      alt={`${messages.photo} ${index + 1}`}
                      className="h-full w-full object-cover"
                      src={photo.url}
                    />
                    <button
                      aria-label={`${messages.delete} ${messages.photo.toLowerCase()} ${index + 1}`}
                      className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/45 focus:outline-none focus:ring-2 focus:ring-white/60"
                      onClick={() => removePhoto(index)}
                      type="button"
                    >
                      <X aria-hidden="true" className="size-4 stroke-[2.25]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard className="pb-4">
            <SectionHeader icon={capasityIcon} title={messages.capacity} />
            <div className="px-4">
              <label className="relative flex h-10 items-center rounded-2xl border border-border bg-surface px-3">
                <span className="absolute left-3 top-[-8px] bg-surface px-1 font-heading text-xs leading-4 font-normal tracking-wide text-primary">
                  {messages.upTo}
                </span>
                <input
                  className="w-full bg-transparent px-1 font-heading text-base font-normal text-text-secondary outline-none"
                  inputMode="numeric"
                  min="0"
                  onChange={(event) => onCapacityChange(event.target.value)}
                  placeholder="0"
                  type="number"
                  value={draft.capacity}
                />
              </label>
            </div>
          </SectionCard>

          <SectionCard className="pb-4">
            <div className="px-4 pb-3 pt-4">
              <h3 className="font-heading text-base leading-5 font-medium text-text-primary">
                {messages.additionalServices}
              </h3>
            </div>
            <div className="space-y-1">
              {serviceOptions.map((service) => {
                const isSelected = draft.services[service.id]

                return (
                  <label
                    className="flex cursor-pointer items-center gap-4 px-4 py-2"
                    key={service.id}
                  >
                    <img
                      alt=""
                      aria-hidden="true"
                      className="size-6 shrink-0"
                      src={service.icon}
                    />
                    <span className="min-w-0 flex-1 font-heading text-base leading-6 font-normal text-text-primary">
                      {service.label}
                    </span>
                    <input
                      checked={isSelected}
                      className="sr-only"
                      onChange={() => onToggleService(service.id)}
                      type="checkbox"
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-[3px] border-2 transition',
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-[#C4C4C4] bg-transparent text-transparent',
                      )}
                    >
                      <Check className="size-3.5 stroke-[3.25]" />
                    </span>
                  </label>
                )
              })}
            </div>
          </SectionCard>

          <button
            className={cn(
              'mt-4 flex h-14 w-full items-center justify-center rounded-xl px-6 font-heading text-base leading-6 font-medium transition focus:outline-none focus:ring-2 focus:ring-primary/30',
              hasSelectedLocation && !saving
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-black/10 text-text-primary/40',
            )}
            disabled={!hasSelectedLocation || saving}
            onClick={onSubmit}
            type="button"
          >
            {saving ? messages.loading : submitLabel}
          </button>

          {saveError ? (
            <p className="font-heading text-sm leading-5 text-red-500">
              {saveError}
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
