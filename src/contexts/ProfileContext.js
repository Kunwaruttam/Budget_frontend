'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '@/lib/api'

const ProfileContext = createContext()

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

export const ProfileProvider = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProfileContext()
  }, [])

  const loadProfileContext = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem('budget_token')
      const savedUser = localStorage.getItem('budget_user')
      
      if (!token) {
        setCurrentProfile(null)
        setPermissions([])
        setIsLoading(false)
        return
      }

      // If we have saved user data, create profile immediately
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          const profile = {
            id: userData.id,
            name: `${userData.first_name || userData.firstName || ''} ${userData.last_name || userData.lastName || ''}`.trim() || 'User',
            profile_type: 'PERSONAL',
            user_id: userData.id,
            email: userData.email
          }
          setCurrentProfile(profile)
          setPermissions(['view', 'create', 'edit', 'delete'])
        } catch (parseError) {
          // Failed to parse saved user, continue to API call
        }
      }

      // Try to fetch fresh data from API with timeout
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile loading timeout')), 8000)
        )

        const result = await Promise.race([
          authAPI.getCurrentUser(),
          timeoutPromise
        ])
        
        if (result.success && result.data) {
          // Update with fresh user data
          const profile = {
            id: result.data.id,
            name: `${result.data.first_name || result.data.firstName || ''} ${result.data.last_name || result.data.lastName || ''}`.trim() || 'User',
            profile_type: 'PERSONAL',
            user_id: result.data.id,
            email: result.data.email
          }

          setCurrentProfile(profile)
          setPermissions(['view', 'create', 'edit', 'delete'])
        }
      } catch (apiError) {
        // API call failed, but if we already set profile from savedUser, keep it
        if (!currentProfile && savedUser) {
          try {
            const userData = JSON.parse(savedUser)
            const profile = {
              id: userData.id,
              name: `${userData.first_name || userData.firstName || ''} ${userData.last_name || userData.lastName || ''}`.trim() || 'User',
              profile_type: 'PERSONAL',
              user_id: userData.id,
              email: userData.email
            }
            setCurrentProfile(profile)
            setPermissions(['view', 'create', 'edit', 'delete'])
          } catch (parseError) {
            setError('Failed to load profile')
          }
        }
      }
    } catch (error) {
      // On critical error, try one last time with saved data
      const savedUser = localStorage.getItem('budget_user')
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          const profile = {
            id: userData.id,
            name: `${userData.first_name || userData.firstName || ''} ${userData.last_name || userData.lastName || ''}`.trim() || 'User',
            profile_type: 'PERSONAL',
            user_id: userData.id,
            email: userData.email
          }
          setCurrentProfile(profile)
          setPermissions(['view', 'create', 'edit', 'delete'])
          setError(null) // Clear error if we recovered with saved data
        } catch (parseError) {
          setError(error.message || 'Failed to load profile information')
          setCurrentProfile(null)
          setPermissions([])
        }
      } else {
        setError(error.message || 'Failed to load profile information')
        setCurrentProfile(null)
        setPermissions([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const hasPermission = (permission) => {
    if (!permissions || permissions.length === 0) return true // Allow basic operations
    return permissions.includes(permission)
  }

  const isPersonalProfile = true // Always personal now

  const contextValue = {
    currentProfile,
    permissions,
    isLoading,
    error,
    refreshProfileContext: loadProfileContext,
    hasPermission,
    isPersonalProfile,
    // Removed group functionality - provide defaults to avoid breaking existing components
    currentGroup: null,
    canManageGroup: false,
    getProfileDisplayName: () => {
      if (!currentProfile) {
        return 'Personal Budget'
      }
      return currentProfile.name || 'Personal Budget'
    },
    getProfileType: () => 'PERSONAL'
  }

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  )
}

export default ProfileProvider
