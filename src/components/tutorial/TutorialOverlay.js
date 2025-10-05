'use client'

import React, { useEffect } from 'react'

const TutorialOverlay = ({ currentStep }) => {
  useEffect(() => {
    if (currentStep && currentStep.target_element) {
      const element = document.querySelector(currentStep.target_element)
      
      if (element) {
        // Scroll element into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center' 
        })
        
        // Add highlight class
        element.classList.add('tutorial-highlight')
        
        // Cleanup function
        return () => {
          element.classList.remove('tutorial-highlight')
        }
      }
    }
    
    return () => {
      // Clean up any existing highlights
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight')
      })
    }
  }, [currentStep])

  // No background overlay - just element highlighting through CSS
  return (
    <style jsx global>{`
      .tutorial-highlight {
        position: relative !important;
        z-index: 10000 !important;
        border-radius: 8px !important;
        pointer-events: auto !important;
      }
      
      /* Pulse animation for highlighted elements */
      .tutorial-highlight::before {
        content: '';
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
        border: 3px solid #4F46E5;
        border-radius: 12px;
        animation: tutorialPulse 2s infinite;
        pointer-events: none;
        z-index: -1;
      }
      
      @keyframes tutorialPulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.05);
          opacity: 0.7;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      /* Make sure highlighted elements are clickable */
      .tutorial-highlight button,
      .tutorial-highlight input,
      .tutorial-highlight a,
      .tutorial-highlight [role="button"] {
        pointer-events: auto !important;
        position: relative !important;
        z-index: 10001 !important;
      }
      
      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .tutorial-highlight::before {
          border: 2px solid #4F46E5;
        }
      }
    `}</style>
  )
}

export default TutorialOverlay