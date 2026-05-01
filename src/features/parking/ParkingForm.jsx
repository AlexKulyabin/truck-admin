import { Plus, Save } from 'lucide-react'
import { useState } from 'react'

const initialFormState = {
  capacity: '',
  latitude: '',
  longitude: '',
  name: '',
  notes: '',
}

function getErrorMessage(error) {
  if (!error) {
    return ''
  }

  return error instanceof Error
    ? error.message
    : 'Unable to save parking point'
}

export function ParkingForm({ error, isLoading, onCreateParkingPoint }) {
  const [formState, setFormState] = useState(initialFormState)
  const [submitError, setSubmitError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasRequiredFields =
    formState.name.trim() &&
    formState.latitude.trim() &&
    formState.longitude.trim()
  const canSubmit = Boolean(hasRequiredFields) && !isSubmitting

  function updateField(field, value) {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }))
  }

  async function handleSubmit(event) {
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
    <aside className="rounded-lg border border-[#dbe2d9] bg-white p-4 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#172119]">
            New parking point
          </h2>
          <p className="text-sm text-[#647067]">
            Add coordinates and service details.
          </p>
        </div>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-md bg-[#1f6f43] text-white"
          aria-label="Add parking point"
          onClick={() => setFormState(initialFormState)}
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>

      {visibleError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {getErrorMessage(visibleError)}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-[#314238]">Name</span>
          <input
            className="mt-1 w-full rounded-md border border-[#cfd8cc] px-3 py-2 text-sm outline-none focus:border-[#1f6f43] focus:ring-2 focus:ring-[#1f6f43]/20"
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
            <span className="text-sm font-medium text-[#314238]">Latitude</span>
            <input
              className="mt-1 w-full rounded-md border border-[#cfd8cc] px-3 py-2 text-sm outline-none focus:border-[#1f6f43] focus:ring-2 focus:ring-[#1f6f43]/20"
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
            <span className="text-sm font-medium text-[#314238]">Longitude</span>
            <input
              className="mt-1 w-full rounded-md border border-[#cfd8cc] px-3 py-2 text-sm outline-none focus:border-[#1f6f43] focus:ring-2 focus:ring-[#1f6f43]/20"
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
          <span className="text-sm font-medium text-[#314238]">Capacity</span>
          <input
            className="mt-1 w-full rounded-md border border-[#cfd8cc] px-3 py-2 text-sm outline-none focus:border-[#1f6f43] focus:ring-2 focus:ring-[#1f6f43]/20"
            disabled={isSubmitting}
            onChange={(event) => updateField('capacity', event.target.value)}
            placeholder="24"
            type="number"
            min="0"
            value={formState.capacity}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#314238]">Notes</span>
          <textarea
            className="mt-1 min-h-24 w-full rounded-md border border-[#cfd8cc] px-3 py-2 text-sm outline-none focus:border-[#1f6f43] focus:ring-2 focus:ring-[#1f6f43]/20"
            disabled={isSubmitting}
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="Security, fuel station, shower, overnight stay..."
            value={formState.notes}
          />
        </label>

        <button
          disabled={!canSubmit}
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#1f6f43] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#185a36] disabled:cursor-not-allowed disabled:bg-[#9aaca0]"
        >
          <Save size={18} aria-hidden="true" />
          {isSubmitting ? 'Saving...' : 'Save parking point'}
        </button>

        {isLoading && (
          <p className="text-center text-sm text-[#647067]">Loading points...</p>
        )}
      </form>
    </aside>
  )
}
