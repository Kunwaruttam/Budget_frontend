'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { tutorialAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { TUTORIAL_STEPS_CONFIG } from '@/lib/tutorialConfig'

const TutorialContext = createContext()

// Tutorial state reducer
const tutorialReducer = (state, action) => {
  
  switch (action.type) {
    case 'SET_LOADING':
      const loadingState = { 
        ...state, 
        loading: action.loading,
        error: action.loading ? null : state.error // Clear error when starting to load
      }
      return loadingState
    
    case 'START_TUTORIAL':
      const startState = { 
        ...state, 
        isActive: true, 
        currentStep: action.step,
        loading: false,
        error: null
      }
      return startState
    
    case 'SET_TUTORIAL_DATA':
      const dataState = {
        ...state,
        steps: action.steps,
        gameData: action.gameData,
        overview: action.overview,
        loading: false,
        error: null
      }
      return dataState
    
    case 'COMPLETE_STEP':
      const completeState = { 
        ...state, 
        currentStep: action.nextStep,
        completedSteps: [...state.completedSteps, action.completedStep],
        loading: false
      }
      return completeState
    
    case 'SHOW_CELEBRATION':
      const celebrationState = {
        ...state,
        showCelebration: {
          show: true,
          celebration: action.celebration
        }
      }
      return celebrationState
    
    case 'HIDE_CELEBRATION':
      return {
        ...state,
        showCelebration: { show: false, celebration: null }
      }
    
    case 'END_TUTORIAL':
      return { 
        ...state, 
        isActive: false, 
        completed: true,
        currentStep: null
      }
    
    case 'SKIP_TUTORIAL':
      return {
        ...state,
        isActive: false,
        skipped: true,
        currentStep: null
      }
    
    case 'RESET_TUTORIAL':
      return {
        ...initialState,
        isActive: true
      }
    
    case 'SET_ERROR':
      const errorState = {
        ...state,
        error: action.error,
        loading: false,
        isActive: false // Stop tutorial on error
      }
      return errorState
    
    default:
      return state
  }
}

// Initial state
const initialState = {
  isActive: false,
  completed: false,
  skipped: false,
  loading: false,
  currentStep: null,
  steps: [],
  completedSteps: [],
  overview: null,
  showCelebration: { show: false, celebration: null },
  error: null
}

export const TutorialProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tutorialReducer, initialState)
  const { user } = useAuth() || { user: null } // Safe fallback

  // Auto-detect first-time users and start tutorial
  useEffect(() => {
    // Check if user needs tutorial (tutorial_completed is false or undefined)
    const userNeedsTutorial = user && (user.tutorial_completed === false || user.tutorial_completed === undefined)
    const canStartTutorial = !state.isActive && !state.completed && !state.skipped
    
    if (userNeedsTutorial && canStartTutorial) {
      // Add a small delay to ensure components are mounted
      setTimeout(() => {
        initializeTutorial()
      }, 1000)
    }
  }, [user, state.isActive, state.completed, state.skipped])

  const initializeTutorial = async () => {
    try {
      dispatch({ type: 'SET_LOADING', loading: true })
      
      
      // Call APIs individually to catch specific failures
      let overviewResult, stepsResult, gameDataResult
      
      try {
        overviewResult = await tutorialAPI.getOverview()
      } catch (err) {
        throw new Error(`Overview API failed: ${err.message}`)
      }
      
      try {
        stepsResult = await tutorialAPI.getAllSteps()
      } catch (err) {
        throw new Error(`Steps API failed: ${err.message}`)
      }
      
      try {
        gameDataResult = await tutorialAPI.getGameData()
      } catch (err) {
        throw new Error(`GameData API failed: ${err.message}`)
      }

      // Check if all API calls were successful
      if (!overviewResult || !overviewResult.success) {
        throw new Error(`Overview API unsuccessful: ${JSON.stringify(overviewResult)}`)
      }
      if (!stepsResult || !stepsResult.success) {
        throw new Error(`Steps API unsuccessful: ${JSON.stringify(stepsResult)}`)
      }
      if (!gameDataResult || !gameDataResult.success) {
        throw new Error(`GameData API unsuccessful: ${JSON.stringify(gameDataResult)}`)
      }

      
      // Use backend data if available, otherwise fallback to local config
      let finalSteps = stepsResult.data
      let finalGameData = gameDataResult.data || {}
      let finalOverview = overviewResult.data || {}

      // If backend returns empty steps, use local configuration
      if (!finalSteps || !Array.isArray(finalSteps) || finalSteps.length === 0) {
        finalSteps = TUTORIAL_STEPS_CONFIG.map((step, index) => ({
          id: step.stepNumber || index + 1,
          step_number: step.stepNumber || index + 1,
          title: step.title,
          description: step.description,
          target_element: step.targetElement,
          position: step.position,
          action_type: step.actionType,
          action_data: step.actionData || {},
          content: step.content,
          points_reward: step.pointsReward || 10,
          badge_unlock: step.badgeUnlock || null,
          celebration_message: step.celebrationMessage || null,
          next_step_preview: step.nextStepPreview || null,
          is_final_step: step.isFinalStep || false
        }))
        
        // Set default game data if not available
        if (!finalGameData || Object.keys(finalGameData).length === 0) {
          finalGameData = {
            user_level: 1,
            total_points: 0,
            badges_earned: [],
            current_streak: 0,
            achievements: []
          }
        }
        
        // Set default overview if not available
        if (!finalOverview || Object.keys(finalOverview).length === 0) {
          finalOverview = {
            current_step: finalSteps[0],
            total_steps: finalSteps.length,
            completed_steps: 0,
            tutorial_progress: 0,
            estimated_time: "10-15 minutes"
          }
        }
      }

      // Validate final data structure
      if (!finalSteps || !Array.isArray(finalSteps) || finalSteps.length === 0) {
        throw new Error(`No valid tutorial steps available. Backend: ${JSON.stringify(stepsResult.data)}, Fallback: ${finalSteps?.length || 0}`)
      }

      dispatch({
        type: 'SET_TUTORIAL_DATA',
        steps: finalSteps,
        gameData: finalGameData,
        overview: finalOverview
      })

      // Start from current step or beginning
      const currentStep = finalOverview.current_step || finalSteps[0]
      
      if (!currentStep) {
        throw new Error('No valid step found to start tutorial')
      }
      
      dispatch({ type: 'START_TUTORIAL', step: currentStep })
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message })
    }
  }

  const startTutorial = async () => {
    try {
      dispatch({ type: 'SET_LOADING', loading: true })
      await initializeTutorial()
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message })
    }
  }

  const completeStep = async (stepId, actionData = {}) => {
    try {
      const result = await tutorialAPI.completeStep(stepId, {
        ...actionData,
        timestamp: new Date().toISOString()
      })

      if (result.success) {
        const data = result.data

        // Show points earned animation
        if (data.points_earned > 0) {
          dispatch({
            type: 'COMPLETE_STEP',
            completedStep: stepId,
            nextStep: getNextStep(stepId),
            pointsEarned: data.points_earned,
            totalPoints: data.total_points,
            newLevel: data.current_level,
            badgesEarned: data.badges_earned
          })

          // Hide points animation after delay
          setTimeout(() => {
            dispatch({ type: 'HIDE_POINTS_ANIMATION' })
          }, 3000)
        }

        // Check if tutorial is completed
        if (data.tutorial_completed && data.celebration) {
          dispatch({ type: 'SHOW_CELEBRATION', celebration: data.celebration })
        } else if (!getNextStep(stepId)) {
          // No more steps - end tutorial
          dispatch({ type: 'END_TUTORIAL' })
        }
      } else {
        throw new Error(result.error?.message || 'Failed to complete step')
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message })
    }
  }

  // Auto-progress to next step when user performs required action
  const autoProgressStep = (actionType, actionData = {}) => {
    if (!state.isActive || !state.currentStep) return

    const currentStep = state.currentStep
    let shouldProgress = false

    // Define action-to-step mappings for auto-progression
    const progressionRules = {
      'click-manage-budget': currentStep.id === 'step-2',
      'click-create-budget': currentStep.id === 'step-3',
      'fill-budget-name': currentStep.id === 'step-4' && actionData.value,
      'fill-budget-amount': currentStep.id === 'step-5' && actionData.value,
      'select-budget-color': currentStep.id === 'step-6' && actionData.value,
      'submit-budget': currentStep.id === 'step-7',
      'click-add-expense': currentStep.id === 'step-8',
      'fill-expense-amount': currentStep.id === 'step-9' && actionData.value,
      'fill-expense-description': currentStep.id === 'step-10' && actionData.value,
      'select-expense-category': currentStep.id === 'step-11' && actionData.value,
      'submit-expense': currentStep.id === 'step-12',
    }

    shouldProgress = progressionRules[actionType]

    if (shouldProgress) {
      completeStep(currentStep.id, actionData)
    }
  }

  const getNextStep = (currentStepId) => {
    const currentStepIndex = state.steps.findIndex(step => step.id === currentStepId)
    return state.steps[currentStepIndex + 1] || null
  }

  const skipTutorial = async () => {
    try {
      const result = await tutorialAPI.skipTutorial()
      if (result.success) {
        dispatch({ type: 'SKIP_TUTORIAL' })
      }
    } catch (error) {
      // Skip anyway for UX
      dispatch({ type: 'SKIP_TUTORIAL' })
    }
  }

  const resetTutorial = async () => {
    try {
      const result = await tutorialAPI.resetTutorial()
      if (result.success) {
        dispatch({ type: 'RESET_TUTORIAL' })
        await initializeTutorial()
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message })
    }
  }

  const hideCelebration = () => {
    dispatch({ type: 'HIDE_CELEBRATION' })
    dispatch({ type: 'END_TUTORIAL' })
  }

  const value = {
    ...state,
    startTutorial,
    completeStep,
    autoProgressStep,
    skipTutorial,
    resetTutorial,
    hideCelebration
  }

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  )
}

export const useTutorial = () => {
  const context = useContext(TutorialContext)
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider')
  }
  return context
}

export default TutorialContext
