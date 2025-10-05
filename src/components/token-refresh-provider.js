'use client'

import { useTokenRefresh } from '@/hooks/useTokenRefresh'

export function TokenRefreshProvider({ children }) {
  useTokenRefresh() // Automatically handles token refresh
  
  return <>{children}</>
}