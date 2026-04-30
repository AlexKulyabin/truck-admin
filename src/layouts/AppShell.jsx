import { MapPinned, ParkingCircle, Settings } from 'lucide-react'

export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f7f4]">
      <header className="border-b border-[#dbe2d9] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#1f6f43] text-white">
              <ParkingCircle size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#5d6b61]">Truck Admin</p>
              <h1 className="text-xl font-semibold text-[#172119]">
                Parking points manager
              </h1>
            </div>
          </div>

          <nav className="hidden items-center gap-2 sm:flex">
            <button className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#1f6f43]">
              <MapPinned size={18} aria-hidden="true" />
              Map
            </button>
            <button className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#5d6b61]">
              <Settings size={18} aria-hidden="true" />
              Settings
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
