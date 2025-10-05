'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { authAPI } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)

    try {
      // Call real API
      const result = await authAPI.forgotPassword(email)
      
      if (result.success) {
        setIsSubmitted(true)
        // Store email for potential resend functionality
        localStorage.setItem('password_reset_email', email)
      } else {
        setErrors({ 
          email: result.error?.message || result.error?.detail || 'Failed to send reset email. Please try again.' 
        })
      }
    } catch (error) {
      setErrors({ email: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    try {
      const result = await authAPI.forgotPassword(email)
      if (result.success) {
        // Show brief success feedback
        setErrors({})
      } else {
        setErrors({ 
          email: result.error?.message || result.error?.detail || 'Failed to resend email. Please try again.' 
        })
      }
    } catch (error) {
      setErrors({ email: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-card p-8">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <FaCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
              <p className="text-muted-foreground text-sm">
                We've sent a password reset link to
              </p>
              <p className="text-foreground font-medium mt-1">{email}</p>
            </div>

            {/* Instructions */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-foreground mb-2">Next Steps:</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Check your email inbox</li>
                <li>Click the reset link in the email</li>
                <li>Create your new password</li>
                <li>Log in with your new credentials</li>
              </ol>
            </div>

            {/* Additional Actions */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Didn't receive the email? Check your spam folder or
                </p>
                <button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="text-sm text-primary hover:text-primary/80 font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Resend Email'}
                </button>
              </div>

              {errors.email && (
                <div className="text-center">
                  <p className="text-sm text-destructive">{errors.email}</p>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FaArrowLeft className="w-3 h-3 mr-2" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <FaEnvelope className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground text-sm">
              No worries! Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={`block w-full pl-10 pr-4 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all-smooth ${
                    errors.email ? 'border-destructive' : 'border-input'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-button text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all-smooth"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaArrowLeft className="w-3 h-3 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact our{' '}
            <a href="#" className="text-primary hover:text-primary/80">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}