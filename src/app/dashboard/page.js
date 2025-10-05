'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FaDollarSign, 
  FaCreditCard, 
  FaArrowUp, 
  FaChartPie, 
  FaPlus, 
  FaChartBar, 
  FaCog,
  FaUsers,
  FaBuilding,
  FaUserTie,
  FaClipboardList
} from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/contexts/ProfileContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { expenseAPI, budgetAPI, reportsAPI } from '@/lib/api'
import TutorialIntegration from '@/components/tutorial/TutorialIntegration'
import { useTutorial } from '@/contexts/TutorialContext'

// Hierarchical Chart component for organizations
const HierarchicalChart = ({ hierarchicalData, currentProfile, formatCurrency }) => {
  if (!hierarchicalData || !currentProfile) return null

  const { budgetSummary, subordinates } = hierarchicalData

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {currentProfile?.role === 'OWNER' || currentProfile?.role === 'CEO' ? 'Organization Overview' : 'Team Overview'}
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Budget Allocated</span>
          <span className="text-sm font-medium text-foreground">
            {formatCurrency(budgetSummary?.totalAllocated || 0)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Utilized</span>
          <span className="text-sm font-medium text-foreground">
            {formatCurrency(budgetSummary?.totalUtilized || 0)}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all-smooth ${
              (budgetSummary?.utilizationPercent || 0) < 75 ? 'bg-green-500' :
              (budgetSummary?.utilizationPercent || 0) < 90 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(budgetSummary?.utilizationPercent || 0, 100)}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-primary">
              {subordinates?.length || 0}
            </p>
            <p className="text-xs text-muted-foreground">Team Members</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(budgetSummary?.remainingBudget || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Personal Budget Chart component
const BudgetChart = ({ data, formatCurrency }) => (
  <div className="bg-card border border-border rounded-lg shadow-card p-6">
    <h3 className="text-lg font-semibold text-foreground mb-4">Budget Overview</h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Budget Utilization</span>
        <span className="text-sm font-medium text-foreground">{data?.budgetUtilization?.toFixed(1) || 0}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all-smooth ${
            (data?.budgetUtilization || 0) < 75 ? 'bg-green-500' :
            (data?.budgetUtilization || 0) < 90 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(data?.budgetUtilization || 0, 100)}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-primary">{formatCurrency(data?.totalBudget || 0)}</p>
          <p className="text-xs text-muted-foreground">Total Budget</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">{formatCurrency(data?.totalSpent || 0)}</p>
          <p className="text-xs text-muted-foreground">Spent</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-green-600">{formatCurrency(data?.remainingBudget || 0)}</p>
          <p className="text-xs text-muted-foreground">Remaining</p>
        </div>
      </div>
    </div>
  </div>
)

const StatCard = ({ title, value, icon: Icon, trend, color = "primary", subtitle }) => (
  <div className="bg-card border border-border rounded-lg shadow-card p-6 transition-all-smooth hover:shadow-professional">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend} from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-${color}/10`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
    </div>
  </div>
)

// Subordinate/Team List Component
const SubordinatesList = ({ subordinates, currentProfile, formatCurrency }) => {
  if (!currentProfile) return null
  
  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          {currentProfile?.role === 'OWNER' || currentProfile?.role === 'CEO' ? 'Organization Members' : 'Team Members'}
        </h3>
      </div>
      <div className="p-6">
        {subordinates?.length > 0 ? (
          <div className="space-y-4">
            {subordinates.slice(0, 5).map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {member.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(member.budget?.allocated || 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.budget?.utilized || 0}% used
                  </p>
                </div>
              </div>
            ))}
            {subordinates.length > 5 && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  +{subordinates.length - 5} more members
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaUsers className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No team members</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentProfile?.canAllocate ? 'Invite team members to get started.' : 'No members assigned to your team.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const QuickActionCard = ({ title, description, icon: Icon, href, color = "primary", onClick, id }) => {
  const router = useRouter()
  
  const handleClick = (e) => {
    e.preventDefault()
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    }
  }

  return (
    <div
      id={id}
      onClick={handleClick}
      className="bg-card border border-border rounded-lg shadow-card p-6 transition-all-smooth hover:shadow-professional hover:border-primary/20 group cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg bg-${color}/10 group-hover:bg-${color}/20 transition-all-smooth`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user: authUser, loading: authLoading } = useAuth()
  const { 
    currentProfile, 
    isLoading: profileLoading, 
    isPersonalProfile,
    currentGroup,
    canManageGroup
  } = useProfile()
  const { formatCurrency } = useCurrency()
  const { startTutorial, autoProgressStep, resetTutorial } = useTutorial()
  const [stats, setStats] = useState(null)
  const [recentExpenses, setRecentExpenses] = useState([])
  const [hierarchicalData, setHierarchicalData] = useState(null)
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeoutReached, setTimeoutReached] = useState(false)
  const router = useRouter()

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
      
      // Load dashboard data even if profile is still loading
      // This prevents blank screen on first login
      loadDashboardData()
    }
  }, [authUser, authLoading, currentProfile, profileLoading, isPersonalProfile, router])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      if (isPersonalProfile) {
        // Get personal stats and expenses from API
        const [statsData, expensesData, insightsData] = await Promise.all([
          getPersonalStats(),
          getRecentExpenses(5),
          loadInsights()
        ])
        
        setStats(statsData)
        setRecentExpenses(expensesData)
        setInsights(insightsData)
      } else {
        // Get organization stats from profile context and API
        const statsData = await getOrganizationStats()
        const expensesData = await getRecentExpenses(5)
        const hierarchicalDataResult = await loadHierarchicalData()
        const insightsData = await loadInsights()
        
        setStats(statsData)
        setRecentExpenses(expensesData)
        setHierarchicalData(hierarchicalDataResult)
        setInsights(insightsData)
      }
    } catch (error) {
      // Set default values on error
      setStats({
        totalBudget: 0,
        totalSpent: 0,
        remainingBudget: 0,
        budgetUtilization: 0
      })
      setRecentExpenses([])
      setInsights(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getPersonalStats = async () => {
    try {
      // Get data from available endpoints
      const [budgetResult, expensesResult] = await Promise.all([
        budgetAPI.getBudgetSummary(),
        expenseAPI.getExpenses({ limit: 1000 }) // Get more expenses to calculate accurate totals
      ])

      const budgetData = budgetResult.success ? budgetResult.data : {}
      const expensesArray = expensesResult.success ? expensesResult.data : []

      // Parse budget values
      const totalBudget = parseFloat(budgetData.total_budget) || 0
      const totalExpensesFromBudget = parseFloat(budgetData.total_expenses) || 0
      const remainingBudget = parseFloat(budgetData.remaining_budget) || (totalBudget - totalExpensesFromBudget)

      // Calculate total from individual expenses
      let calculatedTotal = 0
      const categoryTotals = {}
      
      if (Array.isArray(expensesArray) && expensesArray.length > 0) {
        expensesArray.forEach(expense => {
          const amount = parseFloat(expense.amount) || 0
          calculatedTotal += amount
          
          // Calculate category totals
          const categoryName = expense.category_name || expense.category || 'Unknown'
          categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + amount
        })
      }

      // Use calculated total or budget total, whichever is higher
      const totalSpent = Math.max(totalExpensesFromBudget, calculatedTotal)

      // Create top categories from calculated totals
      const topCategories = Object.entries(categoryTotals)
        .map(([categoryName, amount]) => ({ categoryName, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)

      return {
        totalBudget,
        totalSpent,
        remainingBudget: totalBudget - totalSpent,
        budgetUtilization: totalBudget > 0 
          ? (totalSpent / totalBudget) * 100 
          : 0,
        activeBudgets: parseInt(budgetData.categories_count) || 0,
        monthlyTrend: '+0%', // This would need to be calculated from expense trends
        topCategories
      }
    } catch (error) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        remainingBudget: 0,
        budgetUtilization: 0,
        activeBudgets: 0,
        topCategories: []
      }
    }
  }

  const getOrganizationStats = async () => {
    try {
      const [budgetResult, expensesResult] = await Promise.all([
        budgetAPI.getBudgetSummary(),
        expenseAPI.getExpenses({ limit: 1000 })
      ])
      
      const budgetData = budgetResult.success ? budgetResult.data : {}
      const expensesArray = expensesResult.success ? expensesResult.data : []

      // Parse budget values
      const totalBudget = parseFloat(budgetData.total_budget) || 0
      const totalExpensesFromBudget = parseFloat(budgetData.total_expenses) || 0

      // Calculate total from individual expenses
      let calculatedTotal = 0
      const categoryTotals = {}
      
      if (Array.isArray(expensesArray) && expensesArray.length > 0) {
        expensesArray.forEach(expense => {
          const amount = parseFloat(expense.amount) || 0
          calculatedTotal += amount
          
          // Calculate category totals
          const categoryName = expense.category_name || expense.category || 'Unknown'
          categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + amount
        })
      }

      const totalSpent = Math.max(totalExpensesFromBudget, calculatedTotal)

      // Create top categories from calculated totals
      const topCategories = Object.entries(categoryTotals)
        .map(([categoryName, amount]) => ({ categoryName, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)

      return {
        totalBudget,
        totalSpent,
        remainingBudget: totalBudget - totalSpent,
        budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
        activeBudgets: parseInt(budgetData.categories_count) || 0,
        topCategories
      }
    } catch (error) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        remainingBudget: 0,
        budgetUtilization: 0,
        activeBudgets: 0,
        topCategories: []
      }
    }
  }

  const loadHierarchicalData = async () => {
    try {
      // For now, return a basic structure with empty subordinates
      // This could be expanded to call group/team APIs when available
      return {
        budgetSummary: {
          totalAllocated: stats?.totalBudget || 0,
          totalUtilized: stats?.totalSpent || 0,
          utilizationPercent: stats?.budgetUtilization || 0
        },
        subordinates: [] // Empty for now - could be populated from group member APIs
      }
    } catch (error) {
      return {
        budgetSummary: {
          totalAllocated: 0,
          totalUtilized: 0,
          utilizationPercent: 0
        },
        subordinates: []
      }
    }
  }

  const getRecentExpenses = async (limit = 5) => {
    try {
      const params = { limit }
      
      if (!isPersonalProfile && currentProfile?.id) {
        params.profile_id = currentProfile.id
      }
      
      const result = await expenseAPI.getExpenses(params)
      const expenses = result.success ? result.data : []
      
      // Transform the expenses to ensure proper data formatting
      const transformedExpenses = expenses.map(expense => ({
        id: expense.id,
        description: expense.description || 'No description',
        amount: parseFloat(expense.amount) || 0,
        date: expense.expense_date || expense.date || new Date().toISOString(),
        category: expense.category_name || expense.category || 'Uncategorized'
      }))
      
      // Sort by date (most recent first) and limit to requested amount
      const sortedExpenses = transformedExpenses
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit)
      
      return sortedExpenses
    } catch (error) {
      return []
    }
  }

  const loadInsights = async () => {
    try {
      const params = { period: 'month' } // Load monthly insights for dashboard
      const result = await reportsAPI.getInsights(params)
      
      if (result.success) {
        const insightsData = result.data.data?.insights || result.data.insights
        
        // Handle nested structure
        let monthlyInsights = []
        if (insightsData?.monthly) {
          monthlyInsights = insightsData.monthly
        } else if (Array.isArray(insightsData)) {
          monthlyInsights = insightsData
        }
        
        // Categorize insights by type
        return {
          dangers: monthlyInsights.filter(insight => insight?.type === 'danger'),
          warnings: monthlyInsights.filter(insight => insight?.type === 'warning'),
          info: monthlyInsights.filter(insight => insight?.type === 'info')
        }
      }
      
      return { dangers: [], warnings: [], info: [] }
    } catch (error) {
      return { dangers: [], warnings: [], info: [] }
    }
  }

  if ((authLoading || profileLoading || isLoading) && !timeoutReached) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If timeout reached, show dashboard anyway with whatever data we have
  if (timeoutReached && !authUser) {
    return null
  }

  return (
    <TutorialIntegration>
      <div className="space-y-8">
        {/* Header - Tutorial Welcome Container */}
        <div className="mb-8 welcome-container">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isPersonalProfile ? 
                  `Welcome back, ${authUser?.first_name || 'User'}` :
                  `${currentGroup?.name || 'Organization'} Dashboard`
                }
              </h1>
              <p className="text-muted-foreground mt-2">
                {isPersonalProfile ? 
                  "Here's an overview of your personal financial activity" :
                  `Overview of ${currentProfile?.group_role?.toLowerCase() || 'member'} activities and team performance`
                }
              </p>
            </div>
          </div>
        </div>

      {/* Stats Grid - Different for personal vs organization */}
      {isPersonalProfile ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Budget"
            value={formatCurrency(stats?.totalBudget || 0)}
            icon={FaDollarSign}
            trend={stats?.monthlyTrend}
            color="primary"
          />
          <StatCard
            title="Total Spent"
            value={formatCurrency(stats?.totalSpent || 0)}
            icon={FaCreditCard}
            color="destructive"
          />
          <StatCard
            title="Remaining Budget"
            value={formatCurrency(stats?.remainingBudget || 0)}
            icon={FaArrowUp}
            color="green-600"
          />
          <StatCard
            title="Budget Utilization"
            value={`${(stats?.budgetUtilization || 0).toFixed(1)}%`}
            icon={FaChartPie}
            color="primary"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Allocated Budget"
            value={formatCurrency(stats?.totalBudget || 0)}
            icon={FaDollarSign}
            subtitle={`${stats?.activeBudgets || 0} active budgets`}
            color="primary"
          />
          <StatCard
            title="Budget Utilized"
            value={formatCurrency(stats?.totalSpent || 0)}
            icon={FaCreditCard}
            color="destructive"
          />
          <StatCard
            title="Team Members"
            value={0} // To be implemented with group members API
            icon={FaUsers}
            subtitle={`${currentProfile?.group_role || 'Member'} level`}
            color="blue-600"
          />
          <StatCard
            title="Utilization Rate"
            value={`${(stats?.budgetUtilization || 0).toFixed(1)}%`}
            icon={FaChartPie}
            color="primary"
          />
        </div>
      )}

      {/* Charts and Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          {isPersonalProfile ? (
            <div className="budget-progress">
              <BudgetChart data={stats} formatCurrency={formatCurrency} />
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg shadow-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Group Overview</h3>
              <p className="text-muted-foreground">Group budget and expense tracking coming soon...</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          
          {isPersonalProfile ? (
            <>
              <QuickActionCard
                title="Add Expense"
                description="Record a new expense"
                icon={FaPlus}
                href="/expenses"
                color="primary"
                id="add-expense-btn"
              />
              <QuickActionCard
                title="View Reports"
                description="Analyze spending patterns"
                icon={FaChartBar}
                href="/reports"
                color="green-600"
                id="reports-nav"
              />
              <QuickActionCard
                title="Manage Budget"
                description="Set budget limits"
                icon={FaCog}
                href="/budget"
                color="purple-600"
                id="add-category-btn"
                onClick={() => {
                  autoProgressStep && autoProgressStep('click-manage-budget')
                  router.push('/budget')
                }}
              />
            </>
          ) : (
            <>
              {canManageGroup && (
                <QuickActionCard
                  title="Allocate Budget"
                  description="Distribute budget to team"
                  icon={FaDollarSign}
                  href="/organization"
                  color="primary"
                />
              )}
              <QuickActionCard
                title="Team Expenses"
                description="Review team spending"
                icon={FaClipboardList}
                href="/expenses"
                color="blue-600"
              />
              <QuickActionCard
                title="Team Reports"
                description="Analyze team performance"
                icon={FaChartBar}
                href="/reports"
                color="green-600"
              />
              <QuickActionCard
                title="Organization"
                description="Manage organization"
                icon={FaBuilding}
                href="/organization"
                color="purple-600"
              />
            </>
          )}
        </div>
      </div>

      {/* Financial Insights - Warnings and Alerts */}
      {insights && (insights.dangers?.length > 0 || insights.warnings?.length > 0) && (
        <div className="mb-8 space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Financial Insights</h3>
          
          {/* Critical Alerts */}
          {insights.dangers?.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40">
                  <FaArrowUp className="w-5 h-5 text-red-600 transform rotate-45" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 ml-3">Critical Alerts</h3>
              </div>
              <div className="space-y-3">
                {insights.dangers.map((alert, index) => (
                  <div key={index} className="bg-white dark:bg-red-900/30 rounded-lg p-4 border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-900 dark:text-red-100">{alert.title}</h4>
                    <p className="text-red-700 dark:text-red-200 mt-1">{alert.message}</p>
                    {alert.amount && (
                      <p className="text-lg font-bold text-red-800 dark:text-red-100 mt-2">
                        {formatCurrency(parseFloat(alert.amount))}
                        {alert.category && <span className="text-sm font-normal"> in {alert.category}</span>}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {insights.warnings?.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/40">
                  <FaArrowUp className="w-5 h-5 text-yellow-600 transform rotate-180" />
                </div>
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 ml-3">Warnings</h3>
              </div>
              <div className="space-y-3">
                {insights.warnings.map((alert, index) => (
                  <div key={index} className="bg-white dark:bg-yellow-900/30 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">{alert.title}</h4>
                    <p className="text-yellow-700 dark:text-yellow-200 mt-1">{alert.message}</p>
                    {alert.amount && (
                      <p className="text-lg font-bold text-yellow-800 dark:text-yellow-100 mt-2">
                        {formatCurrency(parseFloat(alert.amount))}
                        {alert.category && <span className="text-sm font-normal"> in {alert.category}</span>}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lower Section - Different content for personal vs organization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity/Team Members */}
        {isPersonalProfile ? (
          <>
            {/* Recent Expenses */}
            <div className="bg-card border border-border rounded-lg shadow-card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Recent Expenses</h3>
              </div>
              <div className="p-6">
                {recentExpenses.length > 0 ? (
                  <div className="space-y-4">
                    {recentExpenses.slice(0, 5).map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{expense.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {expense.category} • {(() => {
                              try {
                                return new Date(expense.date).toLocaleDateString()
                              } catch (error) {
                                return 'Recent'
                              }
                            })()}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {formatCurrency(typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount || 0))}
                        </span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => router.push('/expenses')}
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        View all expenses →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaCreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium text-foreground">No expenses yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Get started by adding your first expense.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => router.push('/expenses')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-button text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 transition-all-smooth focus-ring"
                      >
                        <FaPlus className="w-4 h-4 mr-2" />
                        Add Expense
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-card border border-border rounded-lg shadow-card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Top Categories</h3>
              </div>
              <div className="p-6">
                {stats?.topCategories?.length > 0 ? (
                  <div className="space-y-4">
                    {stats?.topCategories?.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                          <span className="text-sm font-medium text-foreground">
                            {category.categoryName || category.category_name || category.name || 'Unknown Category'}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {formatCurrency(parseFloat(category.amount || category.total_amount || 0))}
                        </span>
                      </div>
                    )) || []}
                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => router.push('/reports')}
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        View detailed reports →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaChartPie className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium text-foreground">No data available</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Start adding expenses to see category breakdown.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Team Members */}
            <SubordinatesList 
              subordinates={hierarchicalData?.subordinates || []} 
              currentProfile={currentProfile}
              formatCurrency={formatCurrency}
            />

            {/* Budget Allocation Overview */}
            <div className="bg-card border border-border rounded-lg shadow-card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Budget Allocations</h3>
              </div>
              <div className="p-6">
                {hierarchicalData?.budgetSummary ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Allocated</span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(hierarchicalData.budgetSummary.totalAllocated || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Utilized</span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(hierarchicalData.budgetSummary.totalUtilized || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Utilization Rate</span>
                      <span className="text-sm font-semibold text-foreground">
                        {hierarchicalData.budgetSummary.utilizationPercent?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => router.push('/organization')}
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        Manage allocations →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaDollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium text-foreground">No allocations yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {canManageGroup ? 'Start by allocating budget to your team.' : 'No budget allocated to your team yet.'}
                    </p>
                    {canManageGroup && (
                      <div className="mt-6">
                        <button
                          onClick={() => router.push('/organization')}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-button text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 transition-all-smooth focus-ring"
                        >
                          <FaDollarSign className="w-4 h-4 mr-2" />
                          Allocate Budget
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </TutorialIntegration>
  )
}
