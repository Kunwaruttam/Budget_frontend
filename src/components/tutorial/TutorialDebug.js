'use client'

import React from 'react'
import { useTutorial } from '@/contexts/TutorialContext'
import { useAuth } from '@/hooks/useAuth'

const TutorialDebug = () => {
  const {
    isActive,
    loading,
    currentStep,
    steps,
    gameData,
    completed,
    skipped,
    error,
    startTutorial,
    skipTutorial,
    resetTutorial
  } = useTutorial()

  const { user, isAuthenticated } = useAuth()

  const startManualTutorial = async () => {
    try {
      await startTutorial()
    } catch (error) {
      // Silently handle error
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg z-50 max-w-md">
      <h3 className="font-bold text-lg mb-2">Tutorial Debug Panel</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Auth Status:</strong>
          <ul className="ml-4">
            <li>Authenticated: {isAuthenticated ? '✅' : '❌'}</li>
            <li>User ID: {user?.id || 'None'}</li>
            <li>Tutorial Completed: {user?.tutorial_completed ? '✅' : '❌'}</li>
          </ul>
        </div>
        
        <div>
          <strong>Tutorial Status:</strong>
          <ul className="ml-4">
            <li>Active: {isActive ? '✅' : '❌'}</li>
            <li>Loading: {loading ? '⏳' : '❌'}</li>
            <li>Completed: {completed ? '✅' : '❌'}</li>
            <li>Skipped: {skipped ? '✅' : '❌'}</li>
            <li>Error: {error || 'None'}</li>
          </ul>
        </div>
        
        <div>
          <strong>Current Step:</strong>
          <div className="ml-4">
            {currentStep ? (
              <div>
                <div>Step {currentStep.step_number}: {currentStep.title}</div>
                <div>Target: {currentStep.target_element}</div>
              </div>
            ) : (
              'None'
            )}
          </div>
        </div>
        
        <div>
          <strong>Steps Loaded:</strong> {steps?.length || 0}
        </div>
        
        <div>
          <strong>Game Data:</strong>
          <div className="ml-4">
            Points: {gameData?.total_points || 0} | 
            Level: {gameData?.user_level || 1} |
            Badges: {gameData?.badges_earned?.length || 0}
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <button 
          onClick={startManualTutorial}
          disabled={loading}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Force Start Tutorial'}
        </button>
        
        {isActive && (
          <button 
            onClick={skipTutorial}
            className="w-full bg-orange-500 text-white px-3 py-2 rounded text-sm hover:bg-orange-600"
          >
            Skip Tutorial
          </button>
        )}
        
        <button 
          onClick={resetTutorial}
          className="w-full bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600"
        >
          Reset Tutorial
        </button>
        
        <button 
          onClick={() => {
            localStorage.removeItem('budget_token')
            localStorage.removeItem('budget_user')
            window.location.reload()
          }}
          className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
        >
          Clear Auth & Reload
        </button>
        
        <a
          href="/tutorial-api-test" 
          target="_blank"
          className="block w-full bg-indigo-500 text-white px-3 py-2 rounded text-sm hover:bg-indigo-600 text-center"
        >
          Test API Endpoints
        </a>
      </div>
    </div>
  )
}

export default TutorialDebug