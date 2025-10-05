'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: (theme) => {}
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Set mounted first to prevent hydration mismatch
    setMounted(true)
    
    // Get system preference if no theme is saved
    const getInitialTheme = () => {
      const savedTheme = localStorage.getItem('budget_theme')
      if (savedTheme) {
        return savedTheme
      }
      
      // Check system preference
      if (typeof window !== 'undefined') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark'
        }
      }
      
      return 'light'
    }
    
    const initialTheme = getInitialTheme()
    setTheme(initialTheme)
    
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(initialTheme)
    
    // Save initial theme if not already saved
    if (!localStorage.getItem('budget_theme')) {
      localStorage.setItem('budget_theme', initialTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('budget_theme', newTheme)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
  }

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('budget_theme', newTheme)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
  }

  if (!mounted) {
    return <div className="bg-background text-foreground">{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: handleSetTheme }}>
      <div className="bg-background text-foreground min-h-screen transition-all-smooth">
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
