import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute, ProtectedRoute, ReviewRoute } from './features/auth/AuthRoutes'
import { AppShell } from './layouts/AppShell'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LoginPage } from './pages/LoginPage'
import { ParkingAdminPage } from './pages/ParkingAdminPage'
import { RegisterPage } from './pages/RegisterPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { ReviewStatusPage } from './pages/ReviewStatusPage'

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<ReviewRoute />}>
        <Route path="/review-status" element={<ReviewStatusPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route
          path="/app"
          element={
            <AppShell>
              <ParkingAdminPage />
            </AppShell>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
