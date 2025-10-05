'use client'

import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { ThemeProvider } from '@/components/theme-provider'
import { ProfileProvider } from '@/contexts/ProfileContext'
import { TokenRefreshProvider } from '@/components/token-refresh-provider'
import { TutorialProvider } from '@/contexts/TutorialContext'
import ConditionalNavbar from '@/components/conditional-navbar'
import { Toaster } from '@/components/ui/toaster'

export function ClientProviders({ children }) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <TokenRefreshProvider>
          <ProfileProvider>
            <TutorialProvider>
              <div className="min-h-screen bg-background">
                <ConditionalNavbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  {children}
                </main>
              </div>
              <Toaster />
            </TutorialProvider>
          </ProfileProvider>
        </TokenRefreshProvider>
      </CurrencyProvider>
    </ThemeProvider>
  )
}
