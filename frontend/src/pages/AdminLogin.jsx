import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Shield, Eye, EyeOff, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { adminLogin } = useAuth()
  const { isHindi } = useLanguage()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      toast.error(isHindi ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const result = await adminLogin(formData.username, formData.password)
      if (result.success) {
        navigate('/admin')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error(isHindi ? 'लॉगिन असफल' : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('admin.login.title')}
          </h2>
          <p className="text-gray-600">
            {isHindi 
              ? 'उद्यम यूनियन एडमिन पैनल में प्रवेश करें'
              : 'Access Udyam Union Admin Panel'
            }
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.login.username')}
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="input-field pl-10"
                  placeholder={isHindi ? 'उपयोगकर्ता नाम दर्ज करें' : 'Enter username'}
                  disabled={loading}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.login.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="input-field pl-10 pr-10"
                  placeholder={isHindi ? 'पासवर्ड दर्ज करें' : 'Enter password'}
                  disabled={loading}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2" />
                  {isHindi ? 'लॉगिन हो रहा है...' : 'Logging in...'}
                </div>
              ) : (
                t('admin.login.login')
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">
                {isHindi ? 'डेवलपमेंट मोड' : 'Development Mode'}
              </h4>
              <div className="text-xs text-yellow-700 space-y-1">
                <p><strong>{isHindi ? 'उपयोगकर्ता नाम:' : 'Username:'}</strong> admin</p>
                <p><strong>{isHindi ? 'पासवर्ड:' : 'Password:'}</strong> admin123</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isHindi 
              ? 'केवल अधिकृत व्यक्तियों के लिए'
              : 'For authorized personnel only'
            }
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-primary-600 hover:text-primary-700 mt-2"
          >
            {isHindi ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Back to main page'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
