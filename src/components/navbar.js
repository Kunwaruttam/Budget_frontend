'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from './theme-provider'
import { useAuth } from '@/hooks/useAuth'
import { 
  FaHome, 
  FaChartBar, 
  FaWallet, 
  FaReceipt, 
  FaCog, 
  FaUser,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaEyeSlash,
  FaEye
} from 'react-icons/fa'
import { MdDashboard, MdAccountBalance, MdSettings } from 'react-icons/md'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { user: authUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: MdDashboard },
    { name: 'Budget', href: '/budget', icon: FaWallet },
    { name: 'Expenses', href: '/expenses', icon: FaReceipt },
    { name: 'Reports', href: '/reports', icon: FaChartBar },
    { name: 'Settings', href: '/settings', icon: MdSettings }
  ]

  const isActivePath = (path) => pathname === path

  return (
    <>
      {/* Navbar Toggle Button - Fixed position */}
      {!isNavbarVisible && (
        <button
          onClick={() => setIsNavbarVisible(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
        >
          <FaEye className="h-4 w-4" />
        </button>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col transition-transform duration-300 ${
        isNavbarVisible ? 'lg:translate-x-0' : 'lg:-translate-x-full'
      }`}>
        <div className="flex min-h-0 flex-1 flex-col bg-card border-r border-border">
          {/* Navbar Toggle for Desktop */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsNavbarVisible(!isNavbarVisible)}
              className="p-2 bg-muted/50 text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors"
            >
              <FaEyeSlash className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center px-4">
              <MdAccountBalance className="h-8 w-8 text-primary mr-3" />
              <span className="text-xl font-bold text-foreground">Budget Tracker</span>
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActivePath(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="flex flex-shrink-0 border-t border-border p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div className="inline-block h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <FaUser className="h-5 w-5" />
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {authUser?.first_name} {authUser?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {authUser?.email}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <FaChevronDown className={`h-4 w-4 transition-transform ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-card border border-border rounded-lg shadow-lg z-20">
                      <div className="py-2">
                        <Link
                          href="/settings"
                          className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FaUserCog className="mr-3 h-4 w-4" />
                          Profile Settings
                        </Link>
                        <button
                          onClick={toggleTheme}
                          className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted"
                        >
                          {theme === 'dark' ? (
                            <>
                              <FaSun className="mr-3 h-4 w-4" />
                              Light Mode
                            </>
                          ) : (
                            <>
                              <FaMoon className="mr-3 h-4 w-4" />
                              Dark Mode
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <FaSignOutAlt className="mr-3 h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between bg-card border-b border-border px-4 py-3">
          <div className="flex items-center">
            <MdAccountBalance className="h-6 w-6 text-primary mr-2" />
            <span className="text-lg font-bold text-foreground">Budget Tracker</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {theme === 'dark' ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col h-full">
                {/* Mobile Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActivePath(item.href)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile User Profile */}
                <div className="border-t border-border p-4">
                  <div className="flex items-center mb-4">
                    <div className="inline-block h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <FaUser className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-foreground">
                        {authUser?.first_name} {authUser?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {authUser?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                    >
                      <FaUserCog className="mr-3 h-4 w-4" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                    >
                      <FaSignOutAlt className="mr-3 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
