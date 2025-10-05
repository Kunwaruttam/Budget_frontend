'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { tokenManager } from '@/lib/api'

export function useTokenRefresh() {
  const router = useRouter()
  const intervalRef = useRef(null)

  useEffect(() => {
    // Check token validity every 5 minutes
    const checkAndRefreshToken = async () => {
      try {
        const token = tokenManager.getToken()
        if (!token) {
          return
        }

        // Check if token needs refresh (within 5 minutes of expiry)
        if (tokenManager.isTokenExpired()) {
          try {
            await tokenManager.refreshAccessToken()
          } catch (error) {
            // Clear tokens and redirect to login
            tokenManager.clearAll()
            router.push('/auth/login')
          }
        }
      } catch (error) {
        // Silent error handling for token refresh
      }
    }

    // Check immediately when hook mounts
    checkAndRefreshToken()

    // Set up interval to check every 5 minutes (300,000 ms)
    intervalRef.current = setInterval(checkAndRefreshToken, 5 * 60 * 1000)

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [router])

  return null // This hook doesn't render anything
}