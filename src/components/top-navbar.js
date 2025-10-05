'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { tokenManager } from '@/lib/api'
import { 
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChevronDown,
  FaBell
} from 'react-icons/fa'
import { 
  MdDashboard, 
  MdAccountBalance, 
  MdSettings, 
  MdAttachMoney,
  MdReceipt,
  MdBarChart
} from 'react-icons/md'

export default function TopNavbar() {
  const [user, setUser] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem('budget_user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])

  const handleLogout = () => {
    tokenManager.clearAll()
    router.push('/auth/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: MdDashboard },
    { name: 'Budget', href: '/budget', icon: MdAttachMoney },
    { name: 'Expenses', href: '/expenses', icon: MdReceipt },
    { name: 'Reports', href: '/reports', icon: MdBarChart },
    { name: 'Settings', href: '/settings', icon: MdSettings }
  ]

  const isActivePath = (path) => pathname === path

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex items-center">
                <MdAccountBalance className="h-8 w-8 text-primary mr-3" />
                <span className="text-xl font-bold text-foreground">Budget Tracker</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:ml-10 lg:flex lg:space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActivePath(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                <FaBell className="h-5 w-5" />
              </button>

              {/* User Menu - Desktop */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <FaUser className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <FaChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${
                    isProfileMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* User Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <Link
                        href="/settings"
                        className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md mx-2 transition-all duration-200 hover:shadow-sm border border-transparent hover:border-muted-foreground/20"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <MdSettings className="mr-3 h-4 w-4 text-blue-600" />
                        <span className="font-medium">Settings</span>
                      </Link>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mx-2 transition-all duration-200"
                      >
                        <FaSignOutAlt className="mr-3 h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation */}
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActivePath(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>

              {/* Mobile User Menu */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <FaUser className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-all duration-200 hover:shadow-sm border border-transparent hover:border-muted-foreground/20"
                  >
                    <MdSettings className="mr-3 h-4 w-4 text-blue-600" />
                    <span className="font-medium">Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                  >
                    <FaSignOutAlt className="mr-3 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={() => {
            setIsProfileMenuOpen(false)
          }}
        />
      )}
    </>
  )
}
