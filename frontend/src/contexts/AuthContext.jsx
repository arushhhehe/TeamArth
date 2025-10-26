import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'
import mockApi from '../utils/mockApi'
import { userProfileStorage, initializeStorage } from '../utils/storage'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'))
  
  const navigate = useNavigate()

  // Initialize storage and check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      // Initialize storage
      initializeStorage()
      
      if (token) {
        try {
          const response = await api.get('/auth/me')
          if (response.data.success) {
            setUser(response.data.user)
          } else {
            localStorage.removeItem('token')
            setToken(null)
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          // If backend is not available, try to use local storage
          if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_FAILED')) {
            console.log('Backend not available, using local storage for auth check')
            const localProfile = userProfileStorage.getProfile()
            if (localProfile.name || localProfile.phone) {
              setUser(localProfile)
              return // Don't clear token if local storage has user data
            }
            // If mock API also fails, don't clear token - let user stay logged in
            // Only clear token on genuine authentication failures (401, 403)
            if (error.response?.status === 401 || error.response?.status === 403) {
              localStorage.removeItem('token')
              setToken(null)
            }
          } else {
            // Only clear token on genuine authentication failures
            if (error.response?.status === 401 || error.response?.status === 403) {
              localStorage.removeItem('token')
              setToken(null)
            }
          }
        }
      } else {
        // No token, try to load from local storage
        const localProfile = userProfileStorage.getProfile()
        if (localProfile.name || localProfile.phone) {
          setUser(localProfile)
        }
      }
      
      if (adminToken) {
        try {
          // For admin, we'll implement a similar check
          setAdmin({ isAdmin: true })
        } catch (error) {
          console.error('Admin auth check failed:', error)
          localStorage.removeItem('adminToken')
          setAdminToken(null)
        }
      }
      
      setLoading(false)
    }

    checkAuth()
  }, [token, adminToken])

  // Login function for sellers
  const login = async (phone, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp })
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data
        setToken(newToken)
        setUser(userData)
        localStorage.setItem('token', newToken)
        
        toast.success('Login successful!')
        return { success: true, isNewUser: userData.isNewUser }
      } else {
        toast.error(response.data.message)
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.log('Backend not available, using mock API')
      // Use mock API when backend is not available
      try {
        const response = await mockApi.verifyOTP(phone, otp)
        
        if (response.success) {
          const { token: newToken, user: userData } = response
          setToken(newToken)
          setUser(userData)
          localStorage.setItem('token', newToken)
          
          toast.success('Login successful! (Demo Mode)')
          return { success: true, isNewUser: userData.isNewUser }
        } else {
          toast.error(response.message)
          return { success: false, message: response.message }
        }
      } catch (mockError) {
        console.error('Mock API error:', mockError)
        toast.error('Login failed. Please try again.')
        return { success: false, message: 'Login failed.' }
      }
    }
  }

  // Send OTP function
  const sendOTP = async (phone) => {
    try {
      // Try real API first, fallback to mock
      const response = await api.post('/auth/send-otp', { phone })
      
      if (response.data.success) {
        toast.success('OTP sent successfully!')
        return { success: true, otp: response.data.otp } // For demo purposes
      } else {
        toast.error(response.data.message)
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.log('Backend not available, using mock API')
      // Use mock API when backend is not available
      try {
        const response = await mockApi.sendOTP(phone)
        
        if (response.success) {
          toast.success('OTP sent successfully! (Demo Mode)')
          return { success: true, otp: response.otp }
        } else {
          toast.error(response.message)
          return { success: false, message: response.message }
        }
      } catch (mockError) {
        console.error('Mock API error:', mockError)
        toast.error('Failed to send OTP. Please try again.')
        return { success: false, message: 'Failed to send OTP.' }
      }
    }
  }

  // Admin login function
  const adminLogin = async (username, password) => {
    try {
      const response = await api.post('/admin/login', { username, password })
      
      if (response.data.success) {
        const { token: newToken, admin: adminData } = response.data
        setAdminToken(newToken)
        setAdmin(adminData)
        localStorage.setItem('adminToken', newToken)
        
        toast.success('Admin login successful!')
        return { success: true }
      } else {
        toast.error(response.data.message)
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.log('Backend not available, using mock API')
      // Use mock API when backend is not available
      const response = await mockApi.adminLogin(username, password)
      
      if (response.success) {
        const { token: newToken, admin: adminData } = response
        setAdminToken(newToken)
        setAdmin(adminData)
        localStorage.setItem('adminToken', newToken)
        
        toast.success('Admin login successful! (Demo Mode)')
        return { success: true }
      } else {
        toast.error(response.message)
        return { success: false, message: response.message }
      }
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setAdmin(null)
    setToken(null)
    setAdminToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('adminToken')
    navigate('/')
    toast.success('Logged out successfully!')
  }

  // Update user data
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user
  }

  // Check if admin is authenticated
  const isAdminAuthenticated = () => {
    return !!adminToken && !!admin
  }

  const value = {
    user,
    admin,
    loading,
    token,
    adminToken,
    login,
    sendOTP,
    adminLogin,
    logout,
    updateUser,
    isAuthenticated,
    isAdminAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
