'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/contexts/ProfileContext'
import { useTutorial } from '@/contexts/TutorialContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { expenseAPI, budgetAPI } from '@/lib/api'
import TutorialIntegration from '@/components/tutorial/TutorialIntegration'

// Icons Component
const Icons = {
  Plus: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  DollarSign: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  Calendar: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  TrendingUp: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Search: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
    </svg>
  ),
  Edit: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  X: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-card border border-border rounded-lg shadow-xl">
          {children}
        </div>
      </div>
    </div>
  )
}

// ExpenseCard Component
const ExpenseCard = ({ expense, onEdit, onDelete, categories = [], formatCurrency }) => {
  // Find the matching budget category to get color and icon
  const category = categories.find(cat => 
    cat.id === expense.category_id || 
    cat.name === expense.category_name || 
    cat.name === expense.category
  )
  
  const categoryColor = category?.color || '#6b7280'
  const categoryIcon = category?.icon || '💰'
  const categoryDescription = category?.description
  
  // Convert hex color to RGB for transparency
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 107, g: 114, b: 128 }
  }
  
  const rgb = hexToRgb(categoryColor)
  
  return (
    <div 
      className="border border-border rounded-lg shadow-card p-6 hover:shadow-card-hover transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
      style={{
        background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
        borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">{categoryIcon}</span>
            <h3 className="text-lg font-semibold text-foreground">
              {expense.description}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            {expense.category_name || expense.category || 'Uncategorized'}
          </p>
          {categoryDescription && (
            <p className="text-xs text-muted-foreground/80 italic mb-2">
              {categoryDescription}
            </p>
          )}
          {expense.notes && (
            <div 
              className="mt-2 p-3 rounded-lg border backdrop-blur-sm"
              style={{
                background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`,
                borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`
              }}
            >
              <p className="text-sm text-foreground">
                <span className="font-medium" style={{ color: categoryColor }}>Note:</span> {expense.notes}
              </p>
            </div>
          )}
        </div>
        <div className="text-right">
          <p 
            className="text-2xl font-bold"
            style={{ color: categoryColor }}
          >
            {formatCurrency(parseFloat(expense.amount) || 0)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {new Date(expense.expense_date || expense.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <Icons.Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded-lg transition-colors"
          >
            <Icons.Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ExpenseForm Component
const ExpenseForm = ({ expense, onSubmit, onCancel, categories = [], autoProgressStep }) => {
  const [formData, setFormData] = useState({
    description: expense?.description || '',
    amount: expense?.amount || '',
    category: expense?.category_id || expense?.category || '',
    date: expense?.expense_date ? expense.expense_date.split('T')[0] : expense?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
    notes: expense?.notes || ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Default categories if API doesn't provide them
  const defaultCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Personal Care',
    'Gifts & Donations'
  ]

  const availableCategories = categories.length > 0 ? categories : defaultCategories

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Map form data to API structure
      const apiData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        expense_date: new Date(formData.date).toISOString(), // Format date with timezone
        notes: formData.notes,
        category_id: formData.category
      }
      
      // Only include id for updates, not for creation
      if (expense?.id) {
        apiData.id = expense.id
      }
      
      await onSubmit(apiData)
      
      // Auto-progress tutorial when expense is submitted
      if (autoProgressStep) {
        autoProgressStep('submit-expense', formData)
      }
    } catch (error) {
      // Handle submission error silently or show user-friendly message
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input changes with tutorial auto-progression
  const handleAmountChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, amount: value }))
    if (autoProgressStep && value.length > 0) {
      autoProgressStep('fill-expense-amount', { value })
    }
  }

  const handleDescriptionChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, description: value }))
    if (autoProgressStep && value.length > 0) {
      autoProgressStep('fill-expense-description', { value })
    }
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, category: value }))
    if (autoProgressStep && value) {
      autoProgressStep('select-expense-category', { value })
    }
  }

  return (
    <div className="expense-form">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          {expense ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <Icons.X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={handleDescriptionChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
            placeholder="Enter expense description"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleAmountChange}
                className="w-full pl-8 pr-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
            required
          >
            <option value="">Select a category</option>
            {availableCategories.map((category) => (
              <option 
                key={typeof category === 'string' ? category : category.id} 
                value={typeof category === 'string' ? category : category.id}
                style={{
                  backgroundColor: typeof category === 'object' && category.color ? `${category.color}15` : 'transparent'
                }}
              >
                {typeof category === 'string' 
                  ? category 
                  : `${category.icon || '💰'} ${category.name}${category.description ? ` - ${category.description}` : ''}`
                }
              </option>
            ))}
          </select>
          
          {/* Show selected category info */}
          {formData.category && availableCategories.find(cat => 
            (typeof cat === 'object' && cat.id === formData.category) || 
            (typeof cat === 'string' && cat === formData.category)
          ) && (
            <div className="mt-2 p-2 rounded-lg border border-border bg-muted/50">
              {(() => {
                const selectedCat = availableCategories.find(cat => 
                  (typeof cat === 'object' && cat.id === formData.category) || 
                  (typeof cat === 'string' && cat === formData.category)
                )
                if (typeof selectedCat === 'object') {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedCat.icon || '💰'}</span>
                      <div>
                        <p className="font-medium" style={{ color: selectedCat.color }}>{selectedCat.name}</p>
                        {selectedCat.description && (
                          <p className="text-xs text-muted-foreground">{selectedCat.description}</p>
                        )}
                      </div>
                    </div>
                  )
                }
                return <p className="text-sm">{selectedCat}</p>
              })()}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
            rows="3"
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors focus-ring"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors focus-ring disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (expense ? 'Update Expense' : 'Add Expense')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [timeoutReached, setTimeoutReached] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user: authUser, loading: authLoading } = useAuth()
  const { autoProgressStep } = useTutorial()
  const { formatCurrency: formatCurrencyHook } = useCurrency()
  const { 
    currentProfile, 
    isLoading: profileLoading, 
    isPersonalProfile,
    currentOrganization
  } = useProfile()

  // Add a timeout fallback to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeoutReached(true)
      setIsLoading(false)
    }, 10000) // 10 second timeout

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    // Wait for auth and profile loading to complete
    if (!authLoading && !profileLoading) {
      if (!authUser) {
        router.push('/auth/login')
        return
      }
      // Load expense data even if profile is still loading
      // This prevents blank screen on first login
      loadData()
    }
  }, [authUser, authLoading, profileLoading, currentProfile, router])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load categories and expenses in parallel
      await Promise.all([
        loadCategories(),
        loadExpenses()
      ])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load expense data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const result = await budgetAPI.getCategories()
      if (result.success) {
        setCategories(result.data)
      } else {
        // Use default categories as fallback
        setCategories([])
      }
    } catch (error) {
      setCategories([])
    }
  }

  const loadExpenses = async () => {
    try {
      const params = {
        limit: 1000, // Get up to 1000 expenses instead of default 100
      }
      
      // Add profile filtering if not personal profile
      if (!isPersonalProfile && currentProfile?.id) {
        params.profile_id = currentProfile.id
      }
      
      const result = await expenseAPI.getExpenses(params)
      if (result.success) {
        setExpenses(result.data)
        setFilteredExpenses(result.data)
      } else {
        setExpenses([])
        setFilteredExpenses([])
      }
    } catch (error) {
      setExpenses([])
      setFilteredExpenses([])
    }
  }

  useEffect(() => {
    // Filter expenses based on search term and category
    let filtered = expenses

    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.category_name && expense.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(expense => {
        const expenseCategory = expense.category_name || expense.category?.name || expense.category
        return expenseCategory === selectedCategory
      })
    }

    setFilteredExpenses(filtered)
  }, [expenses, searchTerm, selectedCategory])

  const handleCreateExpense = async (expenseData) => {
    try {
      // Add profile context to expense data
      const expenseWithProfile = {
        ...expenseData,
        profile_id: currentProfile?.id,
        organization_id: isPersonalProfile ? null : currentOrganization?.id
      }

      const result = await expenseAPI.createExpense(expenseWithProfile)
      
      if (result.success) {
        // Add the new expense to the list
        setExpenses([result.data, ...expenses])
        setShowModal(false)
        toast({
          title: "Expense Added",
          description: `Expense "${expenseData.description}" has been added successfully.`,
          variant: "success",
        })
      } else {
        // Handle different error response formats
        let errorMessage = 'Failed to create expense'
        if (result.error) {
          if (typeof result.error === 'string') {
            errorMessage = result.error
          } else if (result.error.message) {
            errorMessage = result.error.message
          } else if (result.error.detail) {
            errorMessage = result.error.detail
          } else {
            errorMessage = JSON.stringify(result.error)
          }
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add expense. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditExpense = async (expenseData) => {
    try {
      const result = await expenseAPI.updateExpense(expenseData.id, expenseData)
      
      if (result.success) {
        // Update the expense in the list
        setExpenses(expenses.map(expense =>
          expense.id === expenseData.id ? result.data : expense
        ))
        setShowModal(false)
        setEditingExpense(null)
        toast({
          title: "Expense Updated",
          description: `Expense "${expenseData.description}" has been updated successfully.`,
          variant: "success",
        })
      } else {
        // Handle different error response formats
        let errorMessage = 'Failed to update expense'
        if (result.error) {
          if (typeof result.error === 'string') {
            errorMessage = result.error
          } else if (result.error.message) {
            errorMessage = result.error.message
          } else if (result.error.detail) {
            errorMessage = result.error.detail
          } else {
            errorMessage = JSON.stringify(result.error)
          }
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update expense. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        const result = await expenseAPI.deleteExpense(expenseId)
        
        if (result.success) {
          const expense = expenses.find(e => e.id === expenseId)
          setExpenses(expenses.filter(expense => expense.id !== expenseId))
          toast({
            title: "Expense Deleted",
            description: expense ? `Expense "${expense.description}" has been deleted.` : "Expense has been deleted.",
            variant: "success",
          })
        } else {
          // Handle different error response formats
          let errorMessage = 'Failed to delete expense'
          if (result.error) {
            if (typeof result.error === 'string') {
              errorMessage = result.error
            } else if (result.error.message) {
              errorMessage = result.error.message
            } else if (result.error.detail) {
              errorMessage = result.error.detail
            } else {
              errorMessage = JSON.stringify(result.error)
            }
          }
          throw new Error(errorMessage)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete expense. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const openEditModal = (expense) => {
    setEditingExpense(expense)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingExpense(null)
  }

  const totalExpenses = expenses.reduce((sum, expense) => {
    const amount = parseFloat(expense.amount) || 0
    return sum + amount
  }, 0)
  
  const thisMonthExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.expense_date || expense.date)
      const now = new Date()
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, expense) => {
      const amount = parseFloat(expense.amount) || 0
      return sum + amount
    }, 0)

  // Ensure totalExpenses and thisMonthExpenses are valid numbers
  const safeTotalExpenses = Number.isFinite(totalExpenses) ? totalExpenses : 0
  const safeThisMonthExpenses = Number.isFinite(thisMonthExpenses) ? thisMonthExpenses : 0

  if ((authLoading || profileLoading || isLoading) && !timeoutReached) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    )
  }

  // If timeout reached, show page anyway with whatever data we have
  if (timeoutReached && !authUser) {
    return null
  }

  if (!authUser) return null

  return (
    <TutorialIntegration>
      <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isPersonalProfile ? 'Personal Expenses' : `${currentOrganization?.name || 'Team'} Expenses`}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isPersonalProfile 
                  ? 'Track and manage all your personal expenses in one place'
                  : `Track and manage ${currentProfile?.role?.toLowerCase() || 'team'} expenses for your organization`
                }
              </p>
            </div>
            <button
              id="add-expense-btn"
              onClick={() => {
                setShowModal(true)
                autoProgressStep && autoProgressStep('click-add-expense')
              }}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus-ring"
            >
              <Icons.Plus className="w-4 h-4 mr-2" />
              Add Expense
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrencyHook(safeTotalExpenses)}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Icons.DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrencyHook(safeThisMonthExpenses)}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Icons.Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold text-foreground">{expenses.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Icons.TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-card border border-border rounded-lg shadow-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search expenses..."
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 border border-border rounded-lg focus-ring bg-background text-foreground"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option 
                      key={typeof category === 'string' ? category : category.id} 
                      value={typeof category === 'string' ? category : category.name}
                      style={{
                        backgroundColor: typeof category === 'object' && category.color ? `${category.color}15` : 'transparent'
                      }}
                    >
                      {typeof category === 'string' 
                        ? category 
                        : `${category.icon || '💰'} ${category.name}`
                      }
                    </option>
                  ))}
                </select>
                <Icons.Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Expenses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                categories={categories}
                onEdit={openEditModal}
                onDelete={handleDeleteExpense}
                formatCurrency={formatCurrencyHook}
              />
            ))}
          </div>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <Icons.DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">
                {expenses.length === 0 ? 'No expenses yet' : 'No expenses found'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {expenses.length === 0 
                  ? 'Get started by adding your first expense.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {expenses.length === 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus-ring"
                  >
                    <Icons.Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Expense Modal */}
      <Modal isOpen={showModal} onClose={closeModal}>
        <ExpenseForm
          expense={editingExpense}
          categories={categories}
          onSubmit={editingExpense ? handleEditExpense : handleCreateExpense}
          onCancel={closeModal}
          autoProgressStep={autoProgressStep}
        />
      </Modal>
      </div>
    </TutorialIntegration>
  )
}
