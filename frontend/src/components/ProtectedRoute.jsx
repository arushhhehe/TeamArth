import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdminAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!isAuthenticated() && !adminOnly) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Check if admin is authenticated for admin routes
  if (adminOnly && !isAdminAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Check if regular user is trying to access admin routes
  if (adminOnly && isAuthenticated() && !isAdminAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
