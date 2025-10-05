'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/components/theme-provider'
import { useToast } from '@/hooks/use-toast'
import { authAPI } from '@/lib/api'
import { 
  FaUser, 
  FaBell, 
  FaShieldAlt, 
  FaPalette, 
  FaGlobe,
  FaEdit,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaCheck
} from 'react-icons/fa'
import { MdNotifications, MdSecurity, MdLanguage } from 'react-icons/md'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    expenseNotifications: true,
    weeklyReports: false,
    monthlyReports: true
  })
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'America/New_York'
  })
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    // Wait for auth loading to complete
    if (!authLoading) {
      if (!authUser) {
        router.push('/auth/login')
        return
      }

      setFormData({
        firstName: authUser.first_name || '',
        lastName: authUser.last_name || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        department: authUser.department || '',
        role: authUser.role || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Load saved preferences from localStorage
      const savedCurrency = localStorage.getItem('budget_currency') || 'USD'
      
      // Sync theme preference with actual theme
      setPreferences(prev => ({
        ...prev,
        theme: theme,
        currency: savedCurrency
      }))
      
      setIsLoading(false)
    }
  }, [authUser, authLoading, router, theme])

  const handleSaveProfile = () => {
    // Mock API call to save profile
    const updatedUser = {
      ...authUser,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department
    }
    
    // Update localStorage with new user data
    localStorage.setItem('user_data', JSON.stringify(updatedUser))
    setIsEditing(false)
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
      variant: "default",
    })
  }

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    if (!formData.currentPassword) {
      toast({
        title: "Current Password Required",
        description: "Please enter your current password.",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await authAPI.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      )

      if (result.success) {
        toast({
          title: "Password Changed",
          description: "Your password has been successfully updated.",
          variant: "default",
        })
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      } else {
        toast({
          title: "Password Change Failed",
          description: result.error?.message || "Failed to change password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
    
    // Handle theme change specifically
    if (key === 'theme') {
      setTheme(value)
    }
    
    // Handle currency change - save to localStorage
    if (key === 'currency') {
      localStorage.setItem('budget_currency', value)
      // Show success message
      toast({
        title: "Currency Updated",
        description: `Currency changed to ${value}. All amounts will now display in ${value}.`,
        variant: "default",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!authUser) return null

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'preferences', label: 'Preferences', icon: FaPalette }
  ]

  return (
    <div className="min-h-screen bg-background">      
      {/* Main Content */}
      <main className="">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg shadow-card">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <FaEdit className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveProfile}
                            className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <FaSave className="h-4 w-4 mr-2" />
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="inline-flex items-center px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <FaTimes className="h-4 w-4 mr-2" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground disabled:bg-muted disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground disabled:bg-muted disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground disabled:bg-muted disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground disabled:bg-muted disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Department
                        </label>
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground disabled:bg-muted disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          value={formData.role}
                          disabled
                          className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Contact admin to change role</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Security Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-4">Change Password</h3>
                        <div className="grid grid-cols-1 gap-4 max-w-md">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus-ring bg-background text-foreground"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPassword ? (
                                  <FaEyeSlash className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <FaEye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={formData.newPassword}
                              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
                            />
                          </div>

                          <button
                            onClick={handleChangePassword}
                            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                          <div>
                            <h3 className="text-sm font-medium text-foreground">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                              {key === 'budgetAlerts' && 'Get alerted when budgets are close to limit'}
                              {key === 'expenseNotifications' && 'Notifications for new expense submissions'}
                              {key === 'weeklyReports' && 'Receive weekly budget summary reports'}
                              {key === 'monthlyReports' && 'Receive monthly financial reports'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange(key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Preferences</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Theme
                        </label>
                        <select
                          value={preferences.theme}
                          onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                          className="w-full max-w-xs px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Language
                        </label>
                        <select
                          value={preferences.language}
                          onChange={(e) => handlePreferenceChange('language', e.target.value)}
                          className="w-full max-w-xs px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Currency
                        </label>
                        <select
                          value={preferences.currency}
                          onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                          className="w-full max-w-xs px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                          <option value="INR">INR (₹)</option>
                          <option value="CAD">CAD (C$)</option>
                          <option value="AUD">AUD (A$)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Date Format
                        </label>
                        <select
                          value={preferences.dateFormat}
                          onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                          className="w-full max-w-xs px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Timezone
                        </label>
                        <select
                          value={preferences.timezone}
                          onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                          className="w-full max-w-xs px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
                        >
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                      <button
                        onClick={() => toast({
                          title: "Preferences Saved",
                          description: "Your preferences have been successfully updated.",
                          variant: "default",
                        })}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
