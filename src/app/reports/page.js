'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/contexts/ProfileContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { reportsAPI, budgetAPI, expenseAPI } from '@/lib/api'

// Mock chart component
const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-card border border-border rounded-lg shadow-card p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
    {children}
  </div>
)

const MetricCard = ({ title, value, change, trend, icon: Icon }) => (
  <div className="bg-card border border-border rounded-lg shadow-card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}>
            {change}
          </p>
        )}
      </div>
      {Icon && (
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      )}
    </div>
  </div>
)

const ExpenseTable = ({ expenses, formatCurrency }) => (
  <div className="bg-card border border-border rounded-lg shadow-card">
    <div className="px-6 py-4 border-b border-border">
      <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {expenses.map((expense, index) => (
            <tr key={index} className="hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {expense.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-foreground">{expense.description}</div>
                  {expense.note && (
                    <div className="text-sm text-muted-foreground">{expense.note}</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-foreground">
                {formatCurrency ? formatCurrency(expense.amount) : `$${expense.amount.toFixed(2)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const CategoryBreakdown = ({ categories, formatCurrency }) => (
  <div className="space-y-4">
    {categories.map((category, index) => {
      const percentage = (category.amount / categories.reduce((sum, cat) => sum + cat.amount, 0)) * 100
      return (
        <div key={index}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">{category.name}</span>
            <div className="text-right">
              <span className="text-sm font-semibold text-foreground">{formatCurrency ? formatCurrency(category.amount) : `$${category.amount.toFixed(2)}`}</span>
              <span className="text-xs text-muted-foreground ml-2">({percentage.toFixed(1)}%)</span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all-smooth"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )
    })}
  </div>
)

const TrendChart = ({ data, period = 'month', formatCurrency }) => {
  const getPeriodLabel = () => {
    switch (period) {
      case 'month': return 'Last 6 Months' 
      case 'quarter': return 'Last 4 Quarters'
      case 'year': return 'Last 5 Years'
      default: return 'Spending Trend'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">Spending Trend ({getPeriodLabel()})</span>
      </div>
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((item, index) => {
          const maxAmount = Math.max(...data.map(d => d.amount))
          const height = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="text-xs text-muted-foreground mb-2">
                {formatCurrency ? formatCurrency(item.amount) : `$${item.amount.toFixed(0)}`}
              </div>
              <div
                className="w-full bg-primary rounded-t-sm transition-all-smooth hover:bg-primary/80"
                style={{ height: `${height}%`, minHeight: item.amount > 0 ? '20px' : '4px' }}
              />
              <div className="text-xs text-muted-foreground mt-2 font-medium truncate max-w-full" title={item.label}>
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Icons
const Icons = {
  TrendingUp: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  TrendingDown: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  ),
  AlertTriangle: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  DollarSign: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  Calculator: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  PieChart: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  ),
  Download: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Filter: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
    </svg>
  ),
  BarChart: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const { formatCurrency } = useCurrency()
  const { 
    currentProfile, 
    isLoading: profileLoading, 
    isPersonalProfile,
    currentOrganization 
  } = useProfile()

  useEffect(() => {
    // Wait for auth and profile loading to complete
    if (!authLoading && !profileLoading) {
      if (!authUser) {
        router.push('/auth/login')
        return
      }
      if (currentProfile) {
        loadReportData()
      }
    }
  }, [authUser, authLoading, profileLoading, currentProfile, selectedPeriod, router])

  const loadReportData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const params = {
        period: selectedPeriod
      }

      // Load all report data in parallel
      const [summaryResult, trendsResult, categoriesResult, recentResult, insightsResult] = await Promise.all([
        reportsAPI.getSummary(params).catch(err => {
          return { success: false, error: err }
        }),
        reportsAPI.getTrends({ 
          ...params, 
          months: selectedPeriod === 'month' ? 6 : undefined,
          quarters: selectedPeriod === 'quarter' ? 4 : undefined,
          years: selectedPeriod === 'year' ? 5 : undefined
        }).catch(err => {
          return { success: false, error: err }
        }),
        reportsAPI.getCategoryBreakdown(params).catch(err => {
          return { success: false, error: err }
        }),
        reportsAPI.getRecentExpenses({ ...params, limit: 10 }).catch(err => {
          return { success: false, error: err }
        }),
        reportsAPI.getInsights(params).catch(err => {
          return { success: false, error: err }
        })
      ])

      // Check if any critical APIs failed
      if (!summaryResult.success) {
        // Fallback to budget API
        try {
          const budgetResult = await budgetAPI.getBudgetSummary()
          const expensesResult = await expenseAPI.getExpenses({ limit: 1000 })
          
          if (budgetResult.success && expensesResult.success) {
            const totalBudget = parseFloat(budgetResult.data.total_budget) || 0
            const totalSpent = expensesResult.data.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
            
            summaryResult.success = true
            summaryResult.data = {
              total_spent: totalSpent,
              average_monthly: totalSpent,
              budget_utilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
              savings_rate: totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 0
            }
          }
        } catch (fallbackError) {
          // Fallback failed, continue with empty data
        }
      }

      // Process the results - handle double-wrapped API responses
      const combinedData = {
        summary: summaryResult.success ? 
          (summaryResult.data.data || summaryResult.data) : {
            total_spent: 0,
            average_monthly: 0,
            budget_utilization: 0,
            savings_rate: 0
          },
        trendData: trendsResult.success && (trendsResult.data.data?.trends || trendsResult.data.trends) ? 
          (trendsResult.data.data?.trends || trendsResult.data.trends).map(item => ({
            period: item.period,
            label: selectedPeriod === 'month'
              ? new Date(item.period + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
              : selectedPeriod === 'quarter'
              ? `Q${item.period}`
              : item.period,
            amount: parseFloat(item.amount) || 0,
            budget: parseFloat(item.budget) || 0,
            utilization: parseFloat(item.utilization) || 0
          })) : [],
        categoryBreakdown: categoriesResult.success && (categoriesResult.data.data?.categories || categoriesResult.data.categories) ? 
          (categoriesResult.data.data?.categories || categoriesResult.data.categories).map(item => ({
            id: item.category_name.toLowerCase().replace(/\s+/g, '-'),
            name: item.category_name,
            amount: parseFloat(item.spent) || 0,
            budget: parseFloat(item.budget) || 0,
            percentage: parseFloat(item.percentage) || 0,
            utilization: parseFloat(item.utilization) || 0,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            budgetLimit: parseFloat(item.budget) || 0,
            remaining: Math.max(0, (parseFloat(item.budget) || 0) - (parseFloat(item.spent) || 0))
          })) : [],
        recentExpenses: recentResult.success && (recentResult.data.data?.expenses || recentResult.data.expenses) ? 
          (recentResult.data.data?.expenses || recentResult.data.expenses).map(expense => ({
            id: expense.id,
            date: new Date(expense.expense_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            description: expense.description,
            category: expense.category_name,
            amount: parseFloat(expense.amount) || 0,
            daysAgo: expense.days_ago || 0
          })) : [],
        insights: insightsResult.success && (insightsResult.data.data?.insights || insightsResult.data.insights) ? (() => {
          const insightsData = insightsResult.data.data?.insights || insightsResult.data.insights
          
          // Handle new nested structure: { monthly: [], quarterly: [], yearly: [], all_time: [] }
          let allInsights = []
          if (insightsData.monthly || insightsData.quarterly || insightsData.yearly || insightsData.all_time) {
            // New nested structure - combine all periods
            allInsights = [
              ...(insightsData.monthly || []),
              ...(insightsData.quarterly || []),
              ...(insightsData.yearly || []),
              ...(insightsData.all_time || [])
            ]
          } else if (Array.isArray(insightsData)) {
            // Old flat array structure
            allInsights = insightsData
          }
          
          // Determine which insights to show based on selected period
          let periodInsights = []
          if (selectedPeriod === 'month') {
            periodInsights = insightsData.monthly || []
          } else if (selectedPeriod === 'quarter') {
            periodInsights = insightsData.quarterly || []
          } else if (selectedPeriod === 'year') {
            periodInsights = insightsData.yearly || []
          } else {
            // For 'custom' or any other period, show all_time or all combined
            periodInsights = insightsData.all_time || allInsights
          }
          
          const processedInsights = {
            alerts: periodInsights,
            monthly: insightsData.monthly || [],
            quarterly: insightsData.quarterly || [],
            yearly: insightsData.yearly || [],
            all_time: insightsData.all_time || [],
            info: periodInsights.filter(insight => insight?.type === 'info'),
            warnings: periodInsights.filter(insight => insight?.type === 'warning'),
            dangers: periodInsights.filter(insight => insight?.type === 'danger'),
            positive_trends: periodInsights
              .filter(insight => insight?.type === 'info')
              .map(insight => insight.message),
            areas_to_watch: periodInsights
              .filter(insight => insight?.type === 'warning' || insight?.type === 'danger')
              .map(insight => insight.message)
          }
          
          return processedInsights
        })() : {
          alerts: [],
          monthly: [],
          quarterly: [],
          yearly: [],
          all_time: [],
          info: [],
          warnings: [],
          dangers: [],
          positive_trends: [],
          areas_to_watch: []
        }
      }

      setReportData(combinedData)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportReport = async () => {
    try {
      const params = {
        period: selectedPeriod,
        format: 'csv'
      }

      // Add profile filtering if not personal profile
      if (!isPersonalProfile && currentProfile?.id) {
        params.profile_id = currentProfile.id
      }

      const result = await reportsAPI.exportReport(params)
      
      if (result.success && result.blob) {
        // Create download link with the blob
        const downloadUrl = URL.createObjectURL(result.blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = result.filename
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(downloadUrl)
      }
    } catch (error) {
      // Export failed - could show user-friendly error message here
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">Failed to load reports</p>
          <button 
            onClick={loadReportData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!authUser || !reportData) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isPersonalProfile ? 'Personal Financial Reports' : `${currentOrganization?.name || 'Team'} Financial Reports`}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isPersonalProfile 
                  ? 'Comprehensive analysis of your spending patterns and budget performance'
                  : `Financial insights and analysis for your ${currentProfile?.role?.toLowerCase() || 'team'} budget`
                }
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="appearance-none bg-card border border-border rounded-lg px-4 py-2 pr-8 text-sm focus-ring transition-all-smooth"
                >
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
                <Icons.Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              <button
                onClick={handleExportReport}
                className="inline-flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground bg-card hover:bg-accent transition-all-smooth focus-ring"
              >
                <Icons.Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Spent"
              value={formatCurrency(reportData.summary?.data?.total_spent || reportData.summary?.total_spent || 0)}
              icon={Icons.DollarSign}
            />
            <MetricCard
              title="Average Monthly"  
              value={formatCurrency(reportData.summary?.data?.average_monthly || reportData.summary?.average_monthly || 0)}
              icon={Icons.Calculator}
            />
            <MetricCard
              title="Budget Utilization"
              value={`${(reportData.summary?.data?.budget_utilization || reportData.summary?.budget_utilization || 0).toFixed(1)}%`}
              icon={Icons.PieChart}
            />
            <MetricCard
              title="Savings Rate"
              value={`${(reportData.summary?.data?.savings_rate || reportData.summary?.savings_rate || 0).toFixed(1)}%`}
              icon={Icons.TrendingUp}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Spending Trend */}
            <ChartCard title="Spending Trend">
              <TrendChart data={reportData.trendData} period={selectedPeriod} formatCurrency={formatCurrency} />
            </ChartCard>

            {/* Category Breakdown */}
            <ChartCard title="Category Breakdown">
              <CategoryBreakdown categories={reportData.categoryBreakdown} formatCurrency={formatCurrency} />
            </ChartCard>
          </div>

          {/* Recent Expenses Table */}
          <ExpenseTable expenses={reportData.recentExpenses} formatCurrency={formatCurrency} />

          {/* Insights Section - Alert-Based Display */}
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Financial Insights</h2>
            
            {/* Critical Alerts */}
            {reportData.insights.dangers?.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40">
                    <Icons.AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 ml-3">Critical Alerts</h3>
                </div>
                <div className="space-y-3">
                  {reportData.insights.dangers.map((alert, index) => (
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
            {reportData.insights.warnings?.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/40">
                    <Icons.TrendingDown className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 ml-3">Warnings</h3>
                </div>
                <div className="space-y-3">
                  {reportData.insights.warnings.map((alert, index) => (
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

            {/* Info Messages */}
            {reportData.insights.info?.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                    <Icons.TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 ml-3">Information</h3>
                </div>
                <div className="space-y-3">
                  {reportData.insights.info.map((alert, index) => (
                    <div key={index} className="bg-white dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">{alert.title}</h4>
                      <p className="text-blue-700 dark:text-blue-200 mt-1">{alert.message}</p>
                      {alert.category && (
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">Category: {alert.category}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Insights Message */}
            {(!reportData.insights.dangers?.length && !reportData.insights.warnings?.length && !reportData.insights.info?.length) && (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                <Icons.BarChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">No Insights Available</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Insights will appear here as you add more expenses and set up budgets.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
