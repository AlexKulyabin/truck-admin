import { Navigate, Outlet } from 'react-router-dom'
import type { ReviewStatus } from './authTypes'
import { useAuth } from './useAuth'

const statusRoutes: Record<ReviewStatus, string> = {
  pending: '/review-status',
  approved: '/app',
  rejected: '/review-status',
}

export function GuestRoute() {
  const { loading, status, user } = useAuth()

  if (loading) {
    return null
  }

  if (user && status) {
    return <Navigate to={statusRoutes[status]} replace />
  }

  return <Outlet />
}

export function ProtectedRoute() {
  const { loading, status, user } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (status !== 'approved') {
    return <Navigate to="/review-status" replace />
  }

  return <Outlet />
}

export function ReviewRoute() {
  const { loading, status, user } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (status === 'approved') {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
