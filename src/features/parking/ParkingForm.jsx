import { Plus, Save } from 'lucide-react'

export function ParkingForm() {
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
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>

      <form className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#314238]">Name</span>
          <input
            className="mt-1 w-full rounded-md border border-[#cfd8cc] px-3 py-2 text-sm outline-none focus:border-[#1f6f43] focus:ring-2 focus:ring-[#1f6f43]/20"
            placeholder="North Gate Truck Parking"
            type="text"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-[#314238]">Latitude</span>
            <input
              className="mt-1 w-full rounded-md border border-[#cfd8cc] px-3 py-2 text-sm outline-none focus:border-[#1f6f43] focus:ring-2 focus:ring-[#1f6f43]/20"
              placeholder="55.7558"
              type="number"
              step="any"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#314238]">Longitude</span>
            <input
              className="mt-1 w-full rounded-md border border-[#cfd8cc] px-3 py-2 text-sm outline-none focus:border-[#1f6f43] focus:ring-2 focus:ring-[#1f6f43]/20"
              placeholder="37.6173"
              type="number"
              step="any"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-[#314238]">Capacity</span>
          <input
            className="mt-1 w-full rounded-md border border-[#cfd8cc] px-3 py-2 text-sm outline-none focus:border-[#1f6f43] focus:ring-2 focus:ring-[#1f6f43]/20"
            placeholder="24"
            type="number"
            min="0"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#314238]">Notes</span>
          <textarea
            className="mt-1 min-h-24 w-full rounded-md border border-[#cfd8cc] px-3 py-2 text-sm outline-none focus:border-[#1f6f43] focus:ring-2 focus:ring-[#1f6f43]/20"
            placeholder="Security, fuel station, shower, overnight stay..."
          />
        </label>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#1f6f43] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#185a36]"
        >
          <Save size={18} aria-hidden="true" />
          Save parking point
        </button>
      </form>
    </aside>
  )
}
