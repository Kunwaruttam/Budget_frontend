'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FaEdit, 
  FaTrash, 
  FaShoppingCart, 
  FaCar, 
  FaHome, 
  FaFilm, 
  FaDollarSign, 
  FaPlus,
  FaTimes,
  FaWallet,
  FaGamepad,
  FaHeartbeat
} from 'react-icons/fa'
import { budgetAPI } from '@/lib/api'
import { useProfile } from '@/contexts/ProfileContext'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { useTutorial } from '@/contexts/TutorialContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import TutorialIntegration from '@/components/tutorial/TutorialIntegration'

// Modal Components
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75" onClick={onClose}></div>
        <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-card border border-border rounded-lg shadow-xl">
          {children}
        </div>
      </div>
    </div>
  )
}

const categoryIcons = {
  'Food & Dining': FaShoppingCart,
  'Transportation': FaCar,
  'Housing': FaHome,
  'Entertainment': FaFilm,
  'Shopping': FaShoppingCart,
  'Healthcare': FaHeartbeat,
  'Groceries': FaShoppingCart,
  'default': FaWallet
}

const getCategoryIcon = (categoryName) => {
  return categoryIcons[categoryName] || categoryIcons.default
}

const BudgetCard = ({ budget, onEdit, onDelete, formatCurrency }) => {
  // Map API data structure to component expectations - ensure numeric conversion
  const allocated = parseFloat(budget.budget_amount) || 0
  const spent = parseFloat(budget.total_expenses) || 0
  const percentage = allocated > 0 ? (spent / allocated) * 100 : 0
  const isOverBudget = percentage > 100
  const remaining = parseFloat(budget.remaining_budget) || (allocated - spent)
  const Icon = getCategoryIcon(budget.name)

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{budget.name}</h3>
            <p className="text-sm text-muted-foreground">Monthly budget</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(budget)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Allocated</span>
          <span className="font-medium text-foreground">{formatCurrency(allocated)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Spent</span>
          <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-foreground'}`}>
            {formatCurrency(spent)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span className={`font-medium ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(remaining)}
          </span>
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-foreground'}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all-smooth ${
                isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          {isOverBudget && (
            <p className="text-xs text-red-600 mt-1">
              Over budget by {formatCurrency(spent - allocated)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const BudgetForm = ({ budget, onSubmit, onCancel, autoProgressStep }) => {
  const [formData, setFormData] = useState({
    name: budget?.name || '',
    budget: budget?.budget_amount || budget?.budget || '',
    color: budget?.color || '#3b82f6',
    description: budget?.description || '',
    icon: budget?.icon || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Map form data to API structure (BudgetCategoryCreate)
    const apiData = {
      name: formData.name,
      budget_amount: parseFloat(formData.budget),
      color: formData.color
    }
    
    // Add optional fields if they have values
    if (formData.description && formData.description.trim()) {
      apiData.description = formData.description.trim()
    }
    
    if (formData.icon && formData.icon.trim()) {
      apiData.icon = formData.icon.trim()
    }
    
    // For editing, include the id
    if (budget?.id) {
      apiData.id = budget.id
    }
    
    onSubmit(apiData)
    
    // Auto-progress tutorial when budget is submitted
    if (autoProgressStep) {
      autoProgressStep('submit-budget', formData)
    }
  }

  // Handle input changes with tutorial auto-progression
  const handleNameChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, name: value })
    if (autoProgressStep && value.length > 0) {
      autoProgressStep('fill-budget-name', { value })
    }
  }

  const handleBudgetChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, budget: value })
    if (autoProgressStep && value.length > 0) {
      autoProgressStep('fill-budget-amount', { value })
    }
  }

  const handleColorChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, color: value })
    if (autoProgressStep) {
      autoProgressStep('select-budget-color', { value })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {budget ? 'Edit Budget Category' : 'Create New Budget Category'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Category Name
        </label>
        <input
          id="budget-category-name"
          type="text"
          value={formData.name}
          onChange={handleNameChange}
          className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
          placeholder="e.g., Food & Dining"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Budget Amount
        </label>
        <input
          id="budget-amount-input"
          type="number"
          step="0.01"
          value={formData.budget}
          onChange={handleBudgetChange}
          className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description (Optional)
        </label>
        <textarea
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
          placeholder="Add a description for this budget category..."
          rows="2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Icon (Optional)
        </label>
        <input
          type="text"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg focus-ring bg-background text-foreground"
          placeholder="Icon name or emoji (e.g., 🍔, shopping-cart)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Color
        </label>
        <input
          id="budget-color-picker"
          type="color"
          value={formData.color}
          onChange={handleColorChange}
          className="w-full h-10 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          id="submit-budget-btn"
          type="submit"
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus-ring"
        >
          {budget ? 'Update Budget' : 'Create Budget'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors focus-ring"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [timeoutReached, setTimeoutReached] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user: authUser, loading: authLoading } = useAuth()
  const { autoProgressStep } = useTutorial()
  const { formatCurrency: formatCurrencyHook } = useCurrency()
  const { 
    currentProfile, 
    isLoading: profileLoading, 
    isPersonalProfile 
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
      // Load budget data even if profile is still loading
      // This prevents blank screen on first login
      loadBudgetData()
    }
  }, [authUser, authLoading, profileLoading, currentProfile, router])

  const loadBudgetData = async () => {
    try {
      setIsLoading(true)
      
      // Load budgets from API
      const budgetsResult = await budgetAPI.getCategories()
      const budgetsData = budgetsResult.success ? budgetsResult.data : []
      
      // Load budget summary from API
      const summaryResult = await budgetAPI.getBudgetSummary()
      const statsData = summaryResult.success ? summaryResult.data : {}
      
      setBudgets(budgetsData)
      setStats({
        totalBudget: parseFloat(statsData.total_budget) || 0,
        totalSpent: parseFloat(statsData.total_expenses) || 0,
        totalRemaining: parseFloat(statsData.remaining_budget) || 0,
        activeBudgets: parseInt(statsData.categories_count) || budgetsData.length
      })
    } catch (error) {
      // Set fallback data
      setBudgets([])
      setStats({
        totalBudget: 0,
        totalSpent: 0,
        totalRemaining: 0,
        activeBudgets: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBudget = async (budgetData) => {
    try {
      // budgetData already comes from the form in the correct API structure
      const result = await budgetAPI.createCategory(budgetData)
      
      if (result.success) {
        await loadBudgetData()
        setShowModal(false)
        toast({
          title: "Budget Created",
          description: `Budget "${budgetData.name}" has been created successfully.`,
          variant: "success",
        })
      } else {
        throw new Error(result.error?.message || 'Failed to create budget')
      }
    } catch (error) {
      toast({
        title: "Error Creating Budget",
        description: error.message || "Failed to create budget. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditBudget = async (budgetData) => {
    try {
      // Extract the id and remove it from the data object for the API call
      const { id, ...updateData } = budgetData
      const result = await budgetAPI.updateCategory(id, updateData)
      
      if (result.success) {
        await loadBudgetData()
        setShowModal(false)
        setEditingBudget(null)
        toast({
          title: "Budget Updated",
          description: `Budget "${budgetData.name}" has been updated successfully.`,
          variant: "success",
        })
      } else {
        throw new Error(result.error?.message || 'Failed to update budget')
      }
    } catch (error) {
      toast({
        title: "Error Updating Budget",
        description: error.message || "Failed to update budget. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBudget = async (budgetId) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        const result = await budgetAPI.deleteCategory(budgetId)
        
        if (result.success) {
          await loadBudgetData()
          toast({
            title: "Budget Deleted",
            description: "Budget has been deleted successfully.",
            variant: "success",
          })
        } else {
          throw new Error(result.error?.message || 'Failed to delete budget')
        }
      } catch (error) {
        toast({
          title: "Error Deleting Budget",
          description: error.message || "Failed to delete budget. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const openEditModal = (budget) => {
    setEditingBudget(budget)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBudget(null)
  }

  const getSpentAmount = (categoryName) => {
    return stats?.categorySpending?.[categoryName] || 0
  }

  const totalAllocated = budgets.reduce((sum, budget) => sum + (parseFloat(budget.budget_amount) || 0), 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + (parseFloat(budget.total_expenses) || 0), 0)
  const overallUtilization = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0

  if ((authLoading || profileLoading || isLoading) && !timeoutReached) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading budgets...</p>
        </div>
      </div>
    )
  }

  // If timeout reached, show page anyway with whatever data we have
  if (timeoutReached && !authUser) {
    return null
  }

  return (
    <TutorialIntegration>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isPersonalProfile ? 'Personal Budget Management' : `${currentProfile?.group_name || 'Team'} Budget Management`}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isPersonalProfile 
              ? 'Set and track your personal spending limits across different categories'
              : 'Manage team budget categories and spending limits'
            }
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus-ring"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          New Budget
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Allocated</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrencyHook(totalAllocated)}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <FaDollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrencyHook(totalSpent)}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
              <FaShoppingCart className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overall Utilization</p>
              <p className={`text-2xl font-bold ${overallUtilization > 100 ? 'text-red-600' : 'text-foreground'}`}>
                {overallUtilization.toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-lg ${overallUtilization > 100 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'}`}>
              <FaDollarSign className={`w-6 h-6 ${overallUtilization > 100 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onEdit={openEditModal}
            onDelete={handleDeleteBudget}
            formatCurrency={formatCurrencyHook}
          />
        ))}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-12">
          <FaDollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No budgets</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating your first budget.
          </p>
          <div className="mt-6">
            <button
              id="create-budget-btn"
              onClick={() => {
                setShowModal(true)
                autoProgressStep && autoProgressStep('click-create-budget')
              }}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus-ring"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Create Budget
            </button>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      <Modal isOpen={showModal} onClose={closeModal}>
        <div className="budget-form-container">
          <BudgetForm
            budget={editingBudget}
            onSubmit={editingBudget ? handleEditBudget : handleCreateBudget}
            onCancel={closeModal}
            autoProgressStep={autoProgressStep}
          />
        </div>
      </Modal>
      </div>
    </TutorialIntegration>
  )
}
