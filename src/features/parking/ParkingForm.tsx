import { Plus, Save } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { CreateParkingPointInput } from '../../types/parking'

type ParkingFormProps = {
  error: unknown
  isLoading: boolean
  onCreateParkingPoint: (_parkingPoint: CreateParkingPointInput) => Promise<unknown>
}

type ParkingFormState = {
  capacity: string
  latitude: string
  longitude: string
  name: string
  notes: string
}

const initialFormState: ParkingFormState = {
  capacity: '',
  latitude: '',
  longitude: '',
  name: '',
  notes: '',
}

function getErrorMessage(error: unknown) {
  if (!error) {
    return ''
  }

  return error instanceof Error
    ? error.message
    : 'Unable to save parking point'
}

export function ParkingForm({
  error,
  isLoading,
  onCreateParkingPoint,
}: ParkingFormProps) {
  const [formState, setFormState] = useState(initialFormState)
  const [submitError, setSubmitError] = useState<unknown>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasRequiredFields =
    formState.name.trim() &&
    formState.latitude.trim() &&
    formState.longitude.trim()
  const canSubmit = Boolean(hasRequiredFields) && !isSubmitting

  function updateField(field: keyof ParkingFormState, value: string) {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await onCreateParkingPoint({
        capacity: formState.capacity ? Number(formState.capacity) : null,
        latitude: Number(formState.latitude),
        longitude: Number(formState.longitude),
        name: formState.name.trim(),
        notes: formState.notes.trim(),
      })
      setFormState(initialFormState)
    } catch (nextError) {
      setSubmitError(nextError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const visibleError = submitError ?? error

  return (
    <aside className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            New parking point
          </h2>
          <p className="text-sm text-text-muted">
            Add coordinates and service details.
          </p>
        </div>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-md bg-map-marker text-white"
          aria-label="Add parking point"
          onClick={() => setFormState(initialFormState)}
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>

      {Boolean(visibleError) && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {getErrorMessage(visibleError)}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-text-primary">Name</span>
          <input
            className="mt-1 w-full rounded-md border border-form-border px-3 py-2 text-sm outline-none focus:border-map-marker focus:ring-2 focus:ring-map-marker/20"
            disabled={isSubmitting}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="North Gate Truck Parking"
            required
            type="text"
            value={formState.name}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-text-primary">Latitude</span>
            <input
              className="mt-1 w-full rounded-md border border-form-border px-3 py-2 text-sm outline-none focus:border-map-marker focus:ring-2 focus:ring-map-marker/20"
              disabled={isSubmitting}
              onChange={(event) => updateField('latitude', event.target.value)}
              placeholder="55.7558"
              required
              type="number"
              step="any"
              value={formState.latitude}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-text-primary">Longitude</span>
            <input
              className="mt-1 w-full rounded-md border border-form-border px-3 py-2 text-sm outline-none focus:border-map-marker focus:ring-2 focus:ring-map-marker/20"
              disabled={isSubmitting}
              onChange={(event) => updateField('longitude', event.target.value)}
              placeholder="37.6173"
              required
              type="number"
              step="any"
              value={formState.longitude}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-text-primary">Capacity</span>
          <input
            className="mt-1 w-full rounded-md border border-form-border px-3 py-2 text-sm outline-none focus:border-map-marker focus:ring-2 focus:ring-map-marker/20"
            disabled={isSubmitting}
            onChange={(event) => updateField('capacity', event.target.value)}
            placeholder="24"
            type="number"
            min="0"
            value={formState.capacity}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-text-primary">Notes</span>
          <textarea
            className="mt-1 min-h-24 w-full rounded-md border border-form-border px-3 py-2 text-sm outline-none focus:border-map-marker focus:ring-2 focus:ring-map-marker/20"
            disabled={isSubmitting}
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="Security, fuel station, shower, overnight stay..."
            value={formState.notes}
          />
        </label>

        <button
          disabled={!canSubmit}
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-map-marker px-4 py-2.5 text-sm font-semibold text-white hover:bg-map-marker-dark disabled:cursor-not-allowed disabled:bg-text-muted"
        >
          <Save size={18} aria-hidden="true" />
          {isSubmitting ? 'Saving...' : 'Save parking point'}
        </button>

        {isLoading && (
          <p className="text-center text-sm text-text-muted">Loading points...</p>
        )}
      </form>
    </aside>
  )
}
