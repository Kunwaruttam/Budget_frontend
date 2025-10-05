'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { authAPI } from '@/lib/api'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState(null)
  const [isValidToken, setIsValidToken] = useState(null)
  const [tokenValidation, setTokenValidation] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const router = useRouter()

  useEffect(() => {
    // Extract token from query parameters
    const tokenFromQuery = searchParams.get('token')
    if (tokenFromQuery) {
      setToken(tokenFromQuery)
      // For real API, we'll validate the token when user submits the form
      // The API will handle token validation
      setIsValidToken(true)
      setTokenValidation({ email: 'your account' }) // Generic message since we don't validate upfront
    } else {
      setIsValidToken(false)
      setTokenValidation({ message: "No reset token provided" })
    }
  }, [searchParams])

  const validateForm = () => {
    const newErrors = {}

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      // Call real API with both password and confirm password
      const result = await authAPI.resetPassword(token, password, confirmPassword)
      
      if (result.success) {
        setIsSuccess(true)
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?message=password-reset-success')
        }, 3000)
      } else {
        // Handle different types of API errors
        let errorMessage = 'Failed to reset password. Please try again.'
        
        if (result.error) {
          if (result.error.message) {
            errorMessage = result.error.message
          } else if (result.error.detail) {
            errorMessage = result.error.detail
          } else if (typeof result.error === 'string') {
            errorMessage = result.error
          }
        }
        
        // Check if it's a token validation error
        if (errorMessage.toLowerCase().includes('token') || 
            errorMessage.toLowerCase().includes('expired') ||
            errorMessage.toLowerCase().includes('invalid')) {
          setIsValidToken(false)
          setTokenValidation({ message: errorMessage })
        } else {
          setErrors({ submit: errorMessage })
        }
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state while extracting token
  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading reset form...</p>
        </div>
      </div>
    )
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-card p-8">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <FaExclamationTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Reset Link</h1>
              <p className="text-muted-foreground text-sm">
                {tokenValidation?.message || "This password reset link is invalid or has expired."}
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/auth/forgot-password"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-button text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-all-smooth"
              >
                Request New Reset Link
              </Link>
              
              <Link
                href="/auth/login"
                className="w-full flex items-center justify-center px-4 py-3 border border-input rounded-lg text-sm font-medium text-foreground bg-background hover:bg-muted/50 transition-all-smooth"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-card p-8">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <FaCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Password Reset Successful!</h1>
              <p className="text-muted-foreground text-sm">
                Your password has been updated successfully.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-foreground text-center">
                You will be redirected to the login page in a few seconds...
              </p>
            </div>

            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-button text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-all-smooth"
            >
              Continue to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <FaLock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Reset Your Password</h1>
            <p className="text-muted-foreground text-sm">
              Enter your new password below for{' '}
              <span className="font-medium text-foreground">{tokenValidation?.email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all-smooth ${
                    errors.password ? 'border-destructive' : 'border-input'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  ) : (
                    <FaEye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all-smooth ${
                    errors.confirmPassword ? 'border-destructive' : 'border-input'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  ) : (
                    <FaEye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs font-medium text-foreground mb-2">Password Requirements:</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
                <li>Passwords must match</li>
              </ul>
            </div>

            {errors.submit && (
              <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-button text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all-smooth"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}