import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem('highContrast') === 'true'
  )
  const [largeFont, setLargeFont] = useState(
    localStorage.getItem('largeFont') === 'true'
  )

  // Apply theme classes to document
  useEffect(() => {
    const root = document.documentElement
    
    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    if (largeFont) {
      root.classList.add('large-font')
    } else {
      root.classList.remove('large-font')
    }
  }, [highContrast, largeFont])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('highContrast', highContrast.toString())
  }, [highContrast])

  useEffect(() => {
    localStorage.setItem('largeFont', largeFont.toString())
  }, [largeFont])

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev)
  }

  const toggleLargeFont = () => {
    setLargeFont(prev => !prev)
  }

  const value = {
    highContrast,
    largeFont,
    toggleHighContrast,
    toggleLargeFont
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
