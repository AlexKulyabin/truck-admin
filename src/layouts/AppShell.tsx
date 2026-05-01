import type { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppSidebar } from '../components/layout/AppSidebar'
import { useAuth } from '../features/auth/useAuth'

export function AppShell({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="grid min-h-screen bg-background md:grid-cols-[auto_minmax(0,1fr)]">
      <AppSidebar onLogout={handleLogout} userEmail={user?.email} />
      <main className="min-w-0 md:order-none">{children}</main>
    </div>
  )
}
