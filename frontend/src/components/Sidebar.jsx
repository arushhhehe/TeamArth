import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { 
  X, 
  Home, 
  User, 
  Package, 
  Gift, 
  HelpCircle, 
  Users, 
  BarChart3,
  Shield,
  Settings
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose, isAdmin = false }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, admin } = useAuth()

  const navigationItems = isAdmin ? [
    {
      name: t('navigation.dashboard'),
      href: '/admin',
      icon: BarChart3,
      current: location.pathname === '/admin'
    },
    {
      name: 'Manage Sellers',
      href: '/admin/sellers',
      icon: Users,
      current: location.pathname === '/admin/sellers'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      current: location.pathname === '/admin/analytics'
    }
  ] : [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    {
      name: t('navigation.profile'),
      href: '/dashboard/profile',
      icon: User,
      current: location.pathname === '/dashboard/profile'
    },
    {
      name: t('navigation.products'),
      href: '/dashboard/products',
      icon: Package,
      current: location.pathname === '/dashboard/products'
    },
    {
      name: t('navigation.benefits'),
      href: '/dashboard/benefits',
      icon: Gift,
      current: location.pathname === '/dashboard/benefits'
    },
    {
      name: t('navigation.support'),
      href: '/dashboard/support',
      icon: HelpCircle,
      current: location.pathname === '/dashboard/support'
    },
    {
      name: t('navigation.referrals'),
      href: '/dashboard/referrals',
      icon: Users,
      current: location.pathname === '/dashboard/referrals'
    }
  ]

  const handleNavigation = (href) => {
    navigate(href)
    onClose()
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {isAdmin ? 'Admin Panel' : 'Navigation'}
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User info */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || admin?.username || 'User'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {isAdmin ? 'Administrator' : 'Seller'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${item.current
                      ? 'bg-primary-100 text-primary-700 border-l-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              {isAdmin ? 'Admin Panel v1.0' : 'Udyam Union v1.0'}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
