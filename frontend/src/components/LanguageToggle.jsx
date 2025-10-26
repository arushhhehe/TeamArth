import { useLanguage } from '../contexts/LanguageContext'
import { Globe } from 'lucide-react'

const LanguageToggle = () => {
  const { isHindi, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-200 text-white font-medium"
      aria-label="Toggle language"
    >
      <Globe className="h-5 w-5" />
      <span>{isHindi ? 'English' : 'हिंदी'}</span>
    </button>
  )
}

export default LanguageToggle
