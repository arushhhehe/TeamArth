import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Settings, 
  Globe, 
  Contrast, 
  Type, 
  Volume2,
  VolumeX,
  X
} from 'lucide-react'

const AccessibilityPanel = ({
  currentLanguage,
  onLanguageToggle,
  highContrast,
  onHighContrastToggle,
  largeFont,
  onLargeFontToggle
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const { t } = useTranslation()

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    // In a real implementation, this would enable/disable audio prompts
    console.log('Audio prompts:', !audioEnabled ? 'enabled' : 'disabled')
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
        aria-label="Open accessibility settings"
      >
        <Settings className="h-6 w-6" />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Accessibility Settings
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Close accessibility panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Language / भाषा
                </span>
              </div>
              <button
                onClick={onLanguageToggle}
                className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-100 rounded-md hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {currentLanguage === 'en' ? 'हिंदी' : 'English'}
              </button>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Contrast className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  High Contrast
                </span>
              </div>
              <button
                onClick={onHighContrastToggle}
                className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  highContrast
                    ? 'text-white bg-primary-600 hover:bg-primary-700'
                    : 'text-primary-600 bg-primary-100 hover:bg-primary-200'
                }`}
              >
                {highContrast ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Large Font */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Type className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Large Font
                </span>
              </div>
              <button
                onClick={onLargeFontToggle}
                className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  largeFont
                    ? 'text-white bg-primary-600 hover:bg-primary-700'
                    : 'text-primary-600 bg-primary-100 hover:bg-primary-200'
                }`}
              >
                {largeFont ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Audio Prompts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {audioEnabled ? (
                  <Volume2 className="h-5 w-5 text-gray-500" />
                ) : (
                  <VolumeX className="h-5 w-5 text-gray-500" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  Audio Prompts
                </span>
              </div>
              <button
                onClick={toggleAudio}
                className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  audioEnabled
                    ? 'text-white bg-primary-600 hover:bg-primary-700'
                    : 'text-primary-600 bg-primary-100 hover:bg-primary-200'
                }`}
              >
                {audioEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Accessibility features help make the platform more inclusive
            </p>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default AccessibilityPanel
