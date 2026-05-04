import { useState, type PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import logoutBigIcon from '../assets/icons/logout-big.svg'
import { AppSidebar } from '../components/layout/AppSidebar'
import { useAuth } from '../features/auth/useAuth'
import { ParkingAdminPanelsProvider } from '../features/parking/ParkingAdminPanelsProvider'

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Unable to log out. Please try again.'
}

function LogoutDialog({
  error,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  error: string | null
  isSubmitting: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 p-6 backdrop-blur-[3px]">
      <section
        aria-modal="true"
        className="w-full max-w-80 overflow-hidden rounded-xl bg-surface px-4 py-10 shadow-[0_16px_48px_rgb(0_0_0_/_0.18)]"
        role="dialog"
      >
        <div className="flex flex-col items-center gap-6">
          <img alt="" aria-hidden="true" className="size-20" src={logoutBigIcon} />
          <div className="flex w-full flex-col items-center gap-2">
            <h2 className="text-center font-heading text-xl leading-7 font-medium text-black">
              Are you sure you want to log out of your account?
            </h2>
          </div>
          {error ? (
            <p className="w-full text-center font-heading text-sm leading-5 font-normal text-danger">
              {error}
            </p>
          ) : null}
          <div className="flex w-full gap-2">
            <button
              className="flex h-14 flex-1 items-center justify-center rounded-xl bg-[#E5E7EB] px-6 font-heading text-base leading-6 font-medium tracking-tight text-primary transition hover:bg-[#DDE3EA] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex h-14 flex-1 items-center justify-center rounded-xl bg-primary px-6 font-heading text-base leading-6 font-medium tracking-tight text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              onClick={onConfirm}
              type="button"
            >
              {isSubmitting ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export function AppShell({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  function handleOpenLogoutDialog() {
    setLogoutError(null)
    setIsLogoutDialogOpen(true)
  }

  function handleCloseLogoutDialog() {
    if (isLoggingOut) {
      return
    }

    setLogoutError(null)
    setIsLogoutDialogOpen(false)
  }

  async function handleConfirmLogout() {
    setIsLoggingOut(true)
    setLogoutError(null)

    try {
      await logout()
      setIsLogoutDialogOpen(false)
      navigate('/')
    } catch (error) {
      setLogoutError(getErrorMessage(error))
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <ParkingAdminPanelsProvider>
      <div className="grid min-h-screen bg-background md:grid-cols-[auto_minmax(0,1fr)]">
        <AppSidebar onLogout={handleOpenLogoutDialog} userEmail={user?.email} />
        <main className="min-w-0 md:order-none">{children}</main>
      </div>
      {isLogoutDialogOpen ? (
        <LogoutDialog
          error={logoutError}
          isSubmitting={isLoggingOut}
          onCancel={handleCloseLogoutDialog}
          onConfirm={() => void handleConfirmLogout()}
        />
      ) : null}
    </ParkingAdminPanelsProvider>
  )
}
