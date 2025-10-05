'use client'

import React, { useState } from 'react'
import { Plus, DollarSign, Palette, Bell } from 'lucide-react'
import TutorialIntegration from '@/components/tutorial/TutorialIntegration'
import TutorialSettings from '@/components/tutorial/TutorialSettings'

const TutorialDemo = () => {
  const [budgetAmount, setBudgetAmount] = useState('')
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)

  return (
    <TutorialIntegration>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Welcome Section - Tutorial Step 1 */}
        <div className="welcome-container bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Budget Tracker! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Your journey to better financial management starts here
          </p>
        </div>

        {/* Quick Actions - Tutorial Steps 2, 5, 8 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            id="add-category-btn"
            onClick={() => setShowCategoryForm(true)}
            className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md"
          >
            <DollarSign className="mx-auto h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Manage Budget
            </h3>
            <p className="text-gray-600 text-sm">
              Create and manage your budget categories
            </p>
          </button>

          <button
            id="add-expense-btn"
            onClick={() => setShowExpenseForm(true)}
            className="bg-white border-2 border-green-200 hover:border-green-400 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md"
          >
            <Plus className="mx-auto h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Add Expense
            </h3>
            <p className="text-gray-600 text-sm">
              Record a new expense transaction
            </p>
          </button>

          <button
            id="reports-nav"
            onClick={() => alert('Reports feature!')}
            className="bg-white border-2 border-purple-200 hover:border-purple-400 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md"
          >
            <Palette className="mx-auto h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              View Reports
            </h3>
            <p className="text-gray-600 text-sm">
              Analyze your spending patterns
            </p>
          </button>
        </div>

        {/* Budget Progress - Tutorial Step 7 */}
        <div className="budget-progress bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Budget Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Budget Utilization</span>
              <span className="font-semibold">45.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: '45.2%' }}></div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-600">$2,000</p>
                <p className="text-xs text-gray-500">Total Budget</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-red-600">$904</p>
                <p className="text-xs text-gray-500">Spent</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600">$1,096</p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Form Modal - Tutorial Steps 3, 4 */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Create Budget Category</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Amount
                  </label>
                  <input
                    id="budget-amount-input"
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    placeholder="Enter amount (e.g., 300)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="category-customization">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Style
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button className="w-8 h-8 bg-red-500 rounded-full"></button>
                    <button className="w-8 h-8 bg-blue-500 rounded-full"></button>
                    <button className="w-8 h-8 bg-green-500 rounded-full"></button>
                    <button className="w-8 h-8 bg-purple-500 rounded-full"></button>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 border rounded">🍔</button>
                    <button className="p-2 border rounded">🚗</button>
                    <button className="p-2 border rounded">🎮</button>
                    <button className="p-2 border rounded">💰</button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCategoryForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCategoryForm(false)
                    alert('Category created!')
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expense Form Modal - Tutorial Step 6 */}
        {showExpenseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Add Expense</h3>
              
              <div className="expense-form space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="What did you buy?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowExpenseForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowExpenseForm(false)
                    alert('Expense added!')
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings - Tutorial Step 9 */}
        <div className="notifications-settings bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Budget Alerts
                </h3>
                <p className="text-gray-600 text-sm">
                  Get notified when you're close to your budget limit
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Tutorial Settings Panel */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Tutorial Settings
          </h3>
          <TutorialSettings />
        </div>

        {/* Completion Celebration - Tutorial Step 10 */}
        <div className="completion-celebration bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 text-center border-2 border-green-200">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Congratulations!
          </h2>
          <p className="text-gray-600">
            You've completed the Budget Tracker tutorial and earned the Tutorial Master badge!
          </p>
        </div>
      </div>
    </TutorialIntegration>
  )
}

export default TutorialDemo