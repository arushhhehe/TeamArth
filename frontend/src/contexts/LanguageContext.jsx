import { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('language') || 'en'
  )

  // Initialize language
  useEffect(() => {
    i18n.changeLanguage(currentLanguage)
    
    // Update document language attribute
    document.documentElement.lang = currentLanguage === 'hi' ? 'hi' : 'en'
    
    // Update font family based on language
    if (currentLanguage === 'hi') {
      document.documentElement.classList.add('hindi-font')
    } else {
      document.documentElement.classList.remove('hindi-font')
    }
  }, [currentLanguage, i18n])

  const changeLanguage = (language) => {
    setCurrentLanguage(language)
    localStorage.setItem('language', language)
    i18n.changeLanguage(language)
    
    // Update document language attribute
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en'
    
    // Update font family
    if (language === 'hi') {
      document.documentElement.classList.add('hindi-font')
    } else {
      document.documentElement.classList.remove('hindi-font')
    }
  }

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'hi' : 'en'
    changeLanguage(newLanguage)
  }

  const value = {
    currentLanguage,
    changeLanguage,
    toggleLanguage,
    isHindi: currentLanguage === 'hi',
    isEnglish: currentLanguage === 'en'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
