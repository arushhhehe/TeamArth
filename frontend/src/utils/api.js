import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Disable credentials for CORS
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    const adminToken = localStorage.getItem('adminToken')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle network errors and CORS issues - don't redirect on these
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_FAILED') {
      console.log('Network error detected, backend may be unavailable')
      // Don't redirect on network errors - let components handle fallback to mock API
      return Promise.reject(error)
    }
    
    // Handle CORS errors
    if (error.message && error.message.includes('CORS')) {
      console.log('CORS error detected, backend may not be properly configured')
      // Don't redirect on CORS errors either
      return Promise.reject(error)
    }
    
    // Handle authentication errors - only redirect on genuine 401 responses
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      const protectedRoutes = ['/dashboard', '/admin']
      const isOnProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route))
      
      // Only redirect if we're on a protected route and have a genuine 401
      if (isOnProtectedRoute) {
        console.log('Authentication failed, redirecting to login')
        // Unauthorized - clear tokens and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('adminToken')
        window.location.href = '/'
        return Promise.reject(error)
      }
    }
    
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access forbidden')
    }
    
    if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

export default api
