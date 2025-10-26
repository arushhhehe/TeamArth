import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import Header from './Header'
import Sidebar from './Sidebar'
import AccessibilityPanel from './AccessibilityPanel'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, isAdminAuthenticated } = useAuth()
  const { currentLanguage, toggleLanguage } = useLanguage()
  const { highContrast, largeFont, toggleHighContrast, toggleLargeFont } = useTheme()

  const isAdmin = isAdminAuthenticated()

  return (
    <div className={`min-h-screen bg-gray-50 ${highContrast ? 'high-contrast' : ''} ${largeFont ? 'large-font' : ''}`}>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <Header 
        onMenuClick={() => setSidebarOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Main layout container */}
      <div className="flex h-screen pt-16">
        {/* Main content */}
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>

        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isAdmin={isAdmin}
        />
      </div>

      {/* Accessibility Panel */}
      <AccessibilityPanel 
        currentLanguage={currentLanguage}
        onLanguageToggle={toggleLanguage}
        highContrast={highContrast}
        onHighContrastToggle={toggleHighContrast}
        largeFont={largeFont}
        onLargeFontToggle={toggleLargeFont}
      />
    </div>
  )
}

export default Layout
