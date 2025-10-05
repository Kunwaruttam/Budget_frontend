'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const NavbarContext = createContext()

export function NavbarProvider({ children }) {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)

  // Save navbar state to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('navbar_visible')
    if (saved !== null) {
      setIsNavbarVisible(JSON.parse(saved))
    }
  }, [])

  const toggleNavbar = () => {
    const newState = !isNavbarVisible
    setIsNavbarVisible(newState)
    localStorage.setItem('navbar_visible', JSON.stringify(newState))
  }

  return (
    <NavbarContext.Provider value={{
      isNavbarVisible,
      setIsNavbarVisible,
      toggleNavbar
    }}>
      {children}
    </NavbarContext.Provider>
  )
}

export function useNavbar() {
  const context = useContext(NavbarContext)
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider')
  }
  return context
}
