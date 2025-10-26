import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Menu, X, User, LogOut, Settings, Globe } from 'lucide-react'

const Header = ({ onMenuClick, isAdmin = false }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, admin, logout } = useAuth()
  const { currentLanguage, toggleLanguage } = useLanguage()

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  const handleProfileClick = () => {
    if (isAdmin) {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
    setUserMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and title */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center ml-4 lg:ml-0">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-primary-600">
                  {isAdmin ? 'Udyam Union Admin' : 'Udyam Union'}
                </h1>
              </div>
            </div>
          </div>

          {/* Right side - User menu and language toggle */}
          <div className="flex items-center space-x-4">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={`Switch to ${currentLanguage === 'en' ? 'Hindi' : 'English'}`}
            >
              <Globe className="h-4 w-4" />
              <span>{currentLanguage === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            {/* User menu */}
            {(user || admin) && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="User menu"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">
                    {user?.name || admin?.username || 'User'}
                  </span>
                </button>

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      {isAdmin ? 'Admin Panel' : 'Dashboard'}
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      {t('navigation.logout')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  )
}

export default Header
