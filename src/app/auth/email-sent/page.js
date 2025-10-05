'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { authAPI } from '@/lib/api'

function EmailSentContent() {
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const email = searchParams.get('email')

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email address not found. Please try registering again.",
        variant: "destructive",
      })
      return
    }

    setIsResending(true)

    try {
      const result = await authAPI.resendVerification({ email })
      
      if (result.success) {
        toast({
          title: "Email Sent!",
          description: "A new verification email has been sent. Please check your inbox.",
          variant: "success",
        })
        
        // Redirect to verify page after successful resend
        setTimeout(() => {
          router.push('/auth/verify')
        }, 2000)
      } else {
        const errorMessage = result.error.detail || 'Failed to resend verification email'
        toast({
          title: "Resend Failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (err) {
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
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-card border border-border sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Email Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h3 className="mt-6 text-xl font-semibold text-foreground">Verification Email Sent!</h3>
            
            <div className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                We've sent a verification email to:
              </p>
              <p className="text-sm font-medium text-foreground bg-muted px-3 py-2 rounded-md">
                {email || 'your email address'}
              </p>
              <p className="text-sm text-muted-foreground">
                Please check your inbox and click the verification link to activate your account.
              </p>
            </div>

            {/* Resend Section */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Didn't receive the email? Check your spam folder or request a new one.
              </p>
              
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
            </div>
          </div>
          
          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link 
              href="/auth/login" 
              className="text-sm text-primary hover:text-primary/80"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EmailSentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <EmailSentContent />
    </Suspense>
  )
}
