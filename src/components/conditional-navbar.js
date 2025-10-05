'use client'

import { usePathname } from 'next/navigation'
import TopNavbar from './top-navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Don't show navbar on auth pages or landing page
  const isAuthPage = pathname?.startsWith('/auth')
  const isLandingPage = pathname === '/'
  
  if (isAuthPage || isLandingPage) {
    return null
  }
  
  return <TopNavbar />
}
