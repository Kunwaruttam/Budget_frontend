'use client'

import React, { useEffect, useState } from 'react'
import { useTutorial } from '@/contexts/TutorialContext'
import TutorialOverlay from './TutorialOverlay'
import TutorialTooltipSimple from './TutorialTooltipSimple'
import CompletionCelebration from './CompletionCelebration'

const Tutorial = () => {
  const {
    isActive,
    loading,
    currentStep,
    steps,
    showCelebration,
    completeStep,
    skipTutorial,
    hideCelebration,
    error,
    goToPreviousStep
  } = useTutorial()

  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // Update tutorial state
  useEffect(() => {
    // State tracking without debug logging
  }, [isActive, loading, currentStep, steps, error])

  // Update current step index when step changes
  useEffect(() => {
    if (currentStep && steps.length > 0) {
      const index = steps.findIndex(step => step.id === currentStep.id)
      setCurrentStepIndex(index >= 0 ? index : 0)
    }
  }, [currentStep, steps])

  // Handle step completion
  const handleStepComplete = async (stepId, actionData) => {
    try {
      await completeStep(stepId, actionData)
    } catch (error) {
      // Continue to next step anyway for better UX
      handleNext()
    }
  }

  // Handle navigation
  const handleNext = () => {
    const nextStep = steps[currentStepIndex + 1]
    if (nextStep) {
      // Manual navigation - we'll call completeStep with the current step
      handleStepComplete(currentStep.id, {
        action_type: 'navigation',
        manual_advance: true
      })
    }
  }

  const handlePrevious = () => {
    const prevStep = steps[currentStepIndex - 1]
    if (prevStep) {
      // For demo purposes, we'll just show the previous step
      // In a real implementation, you might want to track step history
    }
  }

  // Hide points animation
  const handleHidePointsAnimation = () => {
    // This is handled by the context automatically after timeout
  }

  // Error handling
  if (error) {
    return (
      <div className="tutorial-error">
        <div className="error-content">
          <h3>Tutorial Error</h3>
          <p>{error}</p>
          <button onClick={skipTutorial} className="error-button">
            Continue to App
          </button>
        </div>
        <style jsx>{`
          .tutorial-error {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .error-content {
            background: white;
            padding: 32px;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
          }
          
          .error-content h3 {
            margin: 0 0 16px 0;
            color: #dc2626;
          }
          
          .error-content p {
            margin: 0 0 24px 0;
            color: #6b7280;
          }
          
          .error-button {
            background: #4F46E5;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          }
        `}</style>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="tutorial-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading tutorial...</p>
        </div>
        <style jsx>{`
          .tutorial-loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .loading-spinner {
            background: white;
            padding: 32px;
            border-radius: 12px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }
          
          .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #f3f4f6;
            border-top: 3px solid #4F46E5;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          .loading-spinner p {
            margin: 0;
            color: #6b7280;
            font-weight: 500;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Don't render if tutorial is not active
  if (!isActive || !currentStep) {
    return null
  }

  return (
    <>
      {/* Main tutorial overlay and tooltip */}
      <TutorialOverlay currentStep={currentStep} />
      
      <TutorialTooltipSimple
        step={currentStep}
        onComplete={handleStepComplete}
        onSkip={skipTutorial}
        onPrevious={handlePrevious}
        currentStepNumber={currentStepIndex + 1}
        totalSteps={steps.length}
      />

      {/* Completion celebration */}
      <CompletionCelebration
        celebration={showCelebration.celebration}
        show={showCelebration.show}
        onClose={hideCelebration}
      />
    </>
  )
}

export default Tutorial