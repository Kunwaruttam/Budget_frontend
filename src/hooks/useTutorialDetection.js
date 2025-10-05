'use client'

import { useEffect } from 'react'
import { useTutorial } from '@/contexts/TutorialContext'
import { useAuth } from '@/hooks/useAuth'

/**
 * Tutorial detection hook that automatically starts tutorial for first-time users
 * This should be used in the main app layout or dashboard component
 */
export const useTutorialDetection = () => {
  const { user, isAuthenticated } = useAuth()
  const { 
    isActive, 
    completed, 
    skipped, 
    startTutorial, 
    loading 
  } = useTutorial()

  useEffect(() => {
    // Only trigger if user is authenticated and we have user data
    if (isAuthenticated && user && !loading) {
      // Check if user needs tutorial
      const needsTutorial = !user.tutorial_completed && !completed && !skipped && !isActive
      
      if (needsTutorial) {
        // Small delay to ensure the app has rendered
        const timer = setTimeout(() => {
          startTutorial()
        }, 1000)

        return () => clearTimeout(timer)
      }
    }
  }, [isAuthenticated, user, user?.tutorial_completed, completed, skipped, isActive, loading, startTutorial])

  // Add tutorial-active class to body when tutorial is active
  useEffect(() => {
    if (isActive) {
      document.body.classList.add('tutorial-active')
    } else {
      document.body.classList.remove('tutorial-active')
    }

    return () => {
      document.body.classList.remove('tutorial-active')
    }
  }, [isActive])

  return {
    isTutorialActive: isActive,
    isTutorialCompleted: completed,
    isTutorialSkipped: skipped,
    isTutorialLoading: loading,
    userNeedsTutorial: user && !user.tutorial_completed && !completed && !skipped
  }
}

/**
 * Manual tutorial control hook
 * Use this to provide manual tutorial controls in settings or help pages
 */
export const useTutorialControls = () => {
  const { 
    startTutorial, 
    skipTutorial, 
    resetTutorial,
    isActive,
    completed,
    loading,
    error
  } = useTutorial()

  const handleStartTutorial = async () => {
    try {
      await startTutorial()
    } catch (error) {
      // Silently handle error
    }
  }

  const handleSkipTutorial = async () => {
    try {
      await skipTutorial()
    } catch (error) {
      // Silently handle error
    }
  }

  const handleResetTutorial = async () => {
    try {
      await resetTutorial()
    } catch (error) {
      // Silently handle error
    }
  }

  return {
    startTutorial: handleStartTutorial,
    skipTutorial: handleSkipTutorial,
    resetTutorial: handleResetTutorial,
    isTutorialActive: isActive,
    isTutorialCompleted: completed,
    isTutorialLoading: loading,
    tutorialError: error
  }
}

/**
 * Tutorial step targeting hook
 * Use this to ensure your components have the right IDs/classes for tutorial targeting
 */
export const useTutorialTargeting = () => {
  const { currentStep, isActive } = useTutorial()

  // Helper to check if current element should be highlighted
  const isTargeted = (selector) => {
    return isActive && currentStep && currentStep.target_element === selector
  }

  // Helper to get tutorial-specific props for elements
  const getTutorialProps = (selector) => {
    if (isTargeted(selector)) {
      return {
        'data-tutorial-target': true,
        'data-tutorial-step': currentStep.step_number,
        className: 'tutorial-target'
      }
    }
    return {}
  }

  return {
    isTargeted,
    getTutorialProps,
    currentStep,
    isTutorialActive: isActive
  }
}

export default useTutorialDetection