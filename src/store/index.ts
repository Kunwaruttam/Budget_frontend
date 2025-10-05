import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Profile, DashboardStats } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  currentProfile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>
  setLoading: (loading: boolean) => void
}

interface AppState {
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
  notifications: any[]
  dashboardStats: DashboardStats | null
}

interface AppActions {
  toggleTheme: () => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  addNotification: (notification: any) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  setDashboardStats: (stats: DashboardStats) => void
}

type AuthStore = AuthState & AuthActions
type AppStore = AppState & AppActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      currentProfile: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // For now, just create a simple user object
          const user: User = {
            id: 'user-1',
            email,
            firstName: 'User',
            lastName: 'Name',
            currentProfileId: 'profile-1',
            isActive: true,
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString()
          }

          const token = 'mock-jwt-token-' + Date.now()
          
          set({ 
            user, 
            token,
            currentProfile: null, // Will be loaded by ProfileContext
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          currentProfile: null,
          isAuthenticated: false
        })
      },

      register: async (userData) => {
        set({ isLoading: true })
        
        try {
          // Mock registration - replace with actual API call
          const newUser: User = {
            id: `user-${Date.now()}`,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            isActive: true,
            lastLogin: new Date().toISOString(),
            currentProfileId: `profile-${Date.now()}`,
            createdAt: new Date().toISOString()
          }

          const newProfile: Profile = {
            id: newUser.currentProfileId,
            userId: newUser.id,
            profileName: 'Personal Budget',
            profileType: 'PERSONAL',
            isActive: true,
            createdAt: new Date().toISOString()
          }

          const mockToken = `mock-token-${newUser.id}-${Date.now()}`
          
          set({
            user: newUser,
            token: mockToken,
            currentProfile: newProfile,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        currentProfile: state.currentProfile,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // State
      theme: 'light',
      sidebarCollapsed: false,
      notifications: [],
      dashboardStats: null,

      // Actions
      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }))
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed })
      },

      addNotification: (notification: any) => {
        set((state) => ({
          notifications: [notification, ...state.notifications]
        }))
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      setDashboardStats: (stats: DashboardStats) => {
        set({ dashboardStats: stats })
      }
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        sidebarCollapsed: state.sidebarCollapsed 
      }),
    }
  )
)
