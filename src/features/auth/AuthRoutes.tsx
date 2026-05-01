import { Navigate, Outlet } from 'react-router-dom'
import {
  canAccessDashboard,
  getAuthRedirectPath,
} from '../../domain/accessRules'
import { useAuth } from './useAuth'

export function GuestRoute() {
  const { loading, status, user } = useAuth()

  if (loading) {
    return null
  }

  if (user && status) {
    return <Navigate to={getAuthRedirectPath(status)} replace />
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

  if (!canAccessDashboard(status)) {
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

  if (canAccessDashboard(status)) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
