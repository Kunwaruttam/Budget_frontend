'use client'

import { tutorialAPI } from '@/lib/api'

class TutorialService {
  constructor() {
    this.currentStepId = null
    this.actionHandlers = new Map()
    this.setupActionHandlers()
  }

  setupActionHandlers() {
    this.actionHandlers.set('info', this.handleInfoAction.bind(this))
    this.actionHandlers.set('click', this.handleClickAction.bind(this))
    this.actionHandlers.set('input', this.handleInputAction.bind(this))
    this.actionHandlers.set('navigation', this.handleNavigationAction.bind(this))
  }

  async getTutorialOverview() {
    const response = await tutorialAPI.getOverview()
    return response
  }

  async getAllSteps() {
    const response = await tutorialAPI.getAllSteps()
    return response
  }

  async startStep(stepId) {
    this.currentStepId = stepId
    const response = await tutorialAPI.startStep(stepId)
    return response
  }

  async completeStep(stepId, actionData = {}) {
    const response = await tutorialAPI.completeStep(stepId, actionData)
    return response
  }

  async getGameData() {
    const response = await tutorialAPI.getGameData()
    return response
  }

  async skipTutorial() {
    const response = await tutorialAPI.skipTutorial()
    return response
  }

  async resetTutorial() {
    const response = await tutorialAPI.resetTutorial()
    return response
  }

  // Action handlers for different step types
  handleInfoAction(step, onComplete) {
    // Auto-advance after delay
    if (step.action_data?.auto_advance) {
      const delay = step.action_data.delay || 3000
      setTimeout(() => {
        onComplete(step.id, {
          action_type: 'info',
          auto_advanced: true
        })
      }, delay)
    }
  }

  handleClickAction(step, onComplete) {
    const element = document.querySelector(step.target_element)
    if (!element) {
      return false
    }

    const clickHandler = (event) => {
      event.preventDefault()
      event.stopPropagation()
      
      onComplete(step.id, {
        action_type: 'click',
        element_clicked: step.target_element,
        element_text: element.textContent?.trim() || '',
        click_coordinates: {
          x: event.clientX,
          y: event.clientY
        }
      })

      element.removeEventListener('click', clickHandler)
    }

    element.addEventListener('click', clickHandler, { once: true })
    return true
  }

  handleInputAction(step, onComplete) {
    const element = document.querySelector(step.target_element)
    if (!element) {
      return false
    }

    const inputHandler = (event) => {
      const value = event.target.value
      const expectedValue = step.action_data?.value

      if (expectedValue && value === expectedValue) {
        onComplete(step.id, {
          action_type: 'input',
          input_value: value,
          element_selector: step.target_element
        })

        element.removeEventListener('input', inputHandler)
      } else if (!expectedValue && value.trim().length > 0) {
        // If no specific value is expected, complete on any input
        onComplete(step.id, {
          action_type: 'input',
          input_value: value,
          element_selector: step.target_element
        })

        element.removeEventListener('input', inputHandler)
      }
    }

    element.addEventListener('input', inputHandler)
    return true
  }

  handleNavigationAction(step, onComplete) {
    const targetRoute = step.action_data?.route
    if (!targetRoute) {
      return false
    }

    // Watch for route changes
    const routeWatcher = () => {
      if (window.location.pathname === targetRoute || 
          window.location.pathname.includes(targetRoute)) {
        onComplete(step.id, {
          action_type: 'navigation',
          route_navigated: window.location.pathname,
          target_route: targetRoute
        })

        // Remove event listener
        window.removeEventListener('popstate', routeWatcher)
      }
    }

    // Listen for browser navigation
    window.addEventListener('popstate', routeWatcher)

    // Also check current route in case it's already correct
    setTimeout(() => routeWatcher(), 100)

    return true
  }

  // Initialize step action based on type
  initializeStepAction(step, onComplete) {
    const handler = this.actionHandlers.get(step.action_type)
    if (handler) {
      return handler(step, onComplete)
    } else {
      return false
    }
  }

  // Validate if target element exists
  validateTargetElement(step) {
    if (step.action_type === 'info') {
      return true // Info steps don't require specific elements
    }

    const element = document.querySelector(step.target_element)
    if (!element) {
      return false
    }
    return true
  }

  // Cleanup any active listeners
  cleanup() {
    // Remove any remaining event listeners
    this.currentStepId = null
  }

  // Calculate tooltip position based on target element and preferred position
  calculateTooltipPosition(targetElement, preferredPosition = 'top') {
    if (!targetElement) {
      return {
        position: 'center',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }
    }

    const rect = targetElement.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    const elementTop = rect.top + scrollTop
    const elementLeft = rect.left + scrollLeft
    const elementWidth = rect.width
    const elementHeight = rect.height

    const tooltipWidth = 400 // Approximate tooltip width
    const tooltipHeight = 200 // Approximate tooltip height
    const offset = 20 // Offset from element

    let position = {}

    switch (preferredPosition) {
      case 'top':
        position = {
          top: elementTop - tooltipHeight - offset,
          left: elementLeft + (elementWidth / 2) - (tooltipWidth / 2),
          transform: 'none'
        }
        break
      case 'bottom':
        position = {
          top: elementTop + elementHeight + offset,
          left: elementLeft + (elementWidth / 2) - (tooltipWidth / 2),
          transform: 'none'
        }
        break
      case 'left':
        position = {
          top: elementTop + (elementHeight / 2) - (tooltipHeight / 2),
          left: elementLeft - tooltipWidth - offset,
          transform: 'none'
        }
        break
      case 'right':
        position = {
          top: elementTop + (elementHeight / 2) - (tooltipHeight / 2),
          left: elementLeft + elementWidth + offset,
          transform: 'none'
        }
        break
      case 'center':
      default:
        position = {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
        break
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (position.left < 0) {
      position.left = 10
    } else if (position.left + tooltipWidth > viewportWidth) {
      position.left = viewportWidth - tooltipWidth - 10
    }

    if (position.top < 0) {
      position.top = 10
    } else if (position.top + tooltipHeight > viewportHeight) {
      position.top = viewportHeight - tooltipHeight - 10
    }

    return position
  }
}

// Create singleton instance
const tutorialService = new TutorialService()

export default tutorialService