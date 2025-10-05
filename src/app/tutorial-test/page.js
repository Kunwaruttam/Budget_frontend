'use client'

import React, { useState } from 'react'
import { TutorialProvider } from '@/contexts/TutorialContext'
import Tutorial from '@/components/tutorial/Tutorial'
import TutorialDebug from '@/components/tutorial/TutorialDebug'
import TutorialSettings from '@/components/tutorial/TutorialSettings'

// Mock user with tutorial_completed: false
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  tutorial_completed: false
}

// Mock auth hook for testing
const MockAuthProvider = ({ children }) => {
  const [user] = useState(mockUser)
  
  // Provide auth context
  const authContextValue = {
    user,
    isAuthenticated: true,
    loading: false
  }

  return (
    <div>
      {/* Mock the auth context by setting global properties for testing */}
      {React.cloneElement(children, { mockAuth: authContextValue })}
    </div>
  )
}

const TutorialTestPage = () => {
  return (
    <MockAuthProvider>
      <TutorialProvider>
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header - Tutorial Welcome Container */}
            <div className="welcome-container bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Tutorial Test Page 🎉
              </h1>
              <p className="text-lg text-gray-600">
                This page is for testing the tutorial system without backend dependencies
              </p>
            </div>

            {/* Tutorial Controls */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Tutorial Controls</h2>
              <TutorialSettings />
            </div>

            {/* Tutorial Target Elements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                id="add-category-btn"
                className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md"
              >
                <div className="text-blue-600 text-2xl mb-2">💰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Manage Budget
                </h3>
                <p className="text-gray-600 text-sm">
                  Create and manage your budget categories
                </p>
              </button>

              <button
                id="add-expense-btn"
                className="bg-white border-2 border-green-200 hover:border-green-400 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md"
              >
                <div className="text-green-600 text-2xl mb-2">➕</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Add Expense
                </h3>
                <p className="text-gray-600 text-sm">
                  Record a new expense transaction
                </p>
              </button>

              <button
                id="reports-nav"
                className="bg-white border-2 border-purple-200 hover:border-purple-400 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md"
              >
                <div className="text-purple-600 text-2xl mb-2">📊</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  View Reports
                </h3>
                <p className="text-gray-600 text-sm">
                  Analyze your spending patterns
                </p>
              </button>
            </div>

            {/* Budget Progress */}
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
              </div>
            </div>

            {/* Form Elements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Form Elements</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Amount
                  </label>
                  <input
                    id="budget-amount-input"
                    type="number"
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
                </div>

                <div className="expense-form">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expense Details
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Settings */}
            <div className="notifications-settings bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-yellow-600 text-2xl">🔔</div>
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

            {/* Completion Celebration */}
            <div className="completion-celebration bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 text-center border-2 border-green-200">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Congratulations!
              </h2>
              <p className="text-gray-600">
                You've completed the Budget Tracker tutorial!
              </p>
            </div>

            {/* API Test Section */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ⚠️ Backend API Testing
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                This page bypasses authentication for frontend testing. 
                For full functionality, ensure your backend has these endpoints:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• GET /tutorial/overview</li>
                <li>• GET /tutorial/steps</li>
                <li>• POST /tutorial/steps/{`{id}`}/start</li>
                <li>• POST /tutorial/steps/{`{id}`}/complete</li>
                <li>• GET /tutorial/game-data</li>
                <li>• POST /tutorial/skip</li>
                <li>• POST /tutorial/reset</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tutorial Components */}
        <Tutorial />
        <TutorialDebug />
      </TutorialProvider>
    </MockAuthProvider>
  )
}

export default TutorialTestPage