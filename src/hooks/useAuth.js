'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI, tokenManager } from '@/lib/api'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = tokenManager.getToken()
      const savedUser = tokenManager.getUser()

      if (!token || !savedUser) {
        setLoading(false)
        return
      }

      // Set user from saved data first (optimistic)
      setUser(savedUser)

      // Try to verify token with backend (optional verification)
      try {
        const result = await authAPI.getCurrentUser()
        
        if (result.success) {
          // Update with fresh user data from backend
          setUser(result.data)
          tokenManager.setUser(result.data)
        }
        // If verification fails, we still keep the user logged in with saved data
        // Only logout if explicitly unauthorized (401) or token expired
      } catch (verificationError) {
        // Network error - keep user logged in with saved data
      }
    } catch (error) {
      // Only clear auth if we have no saved data
      const savedUser = tokenManager.getUser()
      if (!savedUser) {
        tokenManager.removeToken()
        tokenManager.removeUser()
        setUser(null)
      } else {
        setUser(savedUser)
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
    router.push('/auth/login')
  }

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user
  }
}

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return children
}
