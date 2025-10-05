'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { authAPI } from '@/lib/api'

function VerifyEmailContent() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token])

  const verifyEmail = async (verificationToken) => {
    setIsVerifying(true)
    setError('')

    try {
      const result = await authAPI.verifyEmail(verificationToken)
      
      if (result.success) {
        setIsVerified(true)
        toast({
          title: "Email Verified!",
          description: "Your email has been verified successfully. Redirecting to login...",
          variant: "success",
        })
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?message=Email verified successfully. You can now login.')
        }, 3000)
      } else {
        const errorMessage = result.error.detail || 'Email verification failed'
        setError(errorMessage)
        toast({
          title: "Verification Failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (err) {
      setError('Network error occurred. Please try again.')
      toast({
        title: "Verification Failed", 
        description: "Network error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendEmail = async (e) => {
    e.preventDefault()
    setIsResending(true)
    setError('')

    try {
      const result = await authAPI.resendVerification({ email: resendEmail })
      
      if (result.success) {
        toast({
          title: "Email Sent!",
          description: "Verification email has been sent. Please check your inbox.",
          variant: "success",
        })
      } else {
        const errorMessage = result.error.detail || 'Failed to resend verification email'
        setError(errorMessage)
        toast({
          title: "Resend Failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (err) {
      setError('Network error occurred. Please try again.')
      toast({
        title: "Resend Failed",
        description: "Network error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Email Verification</h2>
          {!token ? (
            <p className="mt-2 text-sm text-muted-foreground">Verify your email address to complete registration</p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Processing your email verification...</p>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-card border border-border sm:rounded-lg sm:px-10">
          
          {/* Loading State */}
          {isVerifying && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-sm text-muted-foreground">Verifying your email address...</p>
            </div>
          )}

          {/* Success State */}
          {isVerified && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">Email Verified!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your email has been verified successfully. You will be redirected to the login page shortly.
              </p>
              <div className="mt-6">
                <Link 
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus-ring"
                >
                  Continue to Login
                </Link>
              </div>
            </div>
          )}

          {/* Resend Email Form */}
          {!token && !isVerified && (
            <div className="mt-8 border-t border-border pt-8">
              <h3 className="text-lg font-medium text-foreground mb-4">Resend Verification Email</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your email address and we'll send you a new verification link.
              </p>
              
              <form onSubmit={handleResendEmail} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-border rounded-md placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResending}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </form>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="text-sm text-primary hover:text-primary/80"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
