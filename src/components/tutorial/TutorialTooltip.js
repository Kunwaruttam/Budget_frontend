'use client'

import React, { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Skip, RotateCcw } from 'lucide-react'
import tutorialService from '@/lib/tutorialService'

const TutorialTooltip = ({ 
  step, 
  gameData, 
  onComplete, 
  onSkip, 
  onPrevious,
  currentStepNumber = 1,
  totalSteps = 10 
}) => {
  const [position, setPosition] = useState({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (step) {
      // Calculate tooltip position
      const targetElement = document.querySelector(step.target_element)
      const calculatedPosition = tutorialService.calculateTooltipPosition(
        targetElement, 
        step.position
      )
      setPosition(calculatedPosition)
      
      // Show tooltip with animation
      setTimeout(() => setIsVisible(true), 100)
      
      // Initialize step action
      tutorialService.initializeStepAction(step, onComplete)
    }
    
    return () => {
      setIsVisible(false)
    }
  }, [step, onComplete])

  if (!step) return null

  const progressPercentage = ((currentStepNumber - 1) / totalSteps) * 100
  const isLastStep = currentStepNumber === totalSteps
  const isFirstStep = currentStepNumber === 1

  const handleManualComplete = () => {
    onComplete(step.id, {
      action_type: step.action_type,
      manual_completion: true
    })
  }

  return (
    <>
      <div 
        className={`tutorial-tooltip ${isVisible ? 'visible' : ''}`}
        style={position}
      >
        {/* Header */}
        <div className="tutorial-header">
          <div className="tutorial-progress">
            <div className="progress-info">
              <span className="step-counter">
                Step {currentStepNumber} of {totalSteps}
              </span>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={onSkip}
            className="skip-button"
            title="Skip Tutorial"
          >
            <X size={16} />
          </button>
        </div>

        {/* Game Data Display */}
        {gameData && (
          <div className="game-stats">
            <div className="stat">
              <span className="stat-label">Level</span>
              <span className="stat-value">{gameData.user_level}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Points</span>
              <span className="stat-value">{gameData.total_points}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Badges</span>
              <span className="stat-value">{gameData.badges_earned?.length || 0}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="tutorial-content">
          <h3 className="tutorial-title">{step.title}</h3>
          <p className="tutorial-description">{step.description}</p>
          
          {step.image_url && (
            <div className="tutorial-image">
              <img src={step.image_url} alt="Tutorial step illustration" />
            </div>
          )}

          {step.content && (
            <div className="tutorial-extended-content">
              <p>{step.content}</p>
            </div>
          )}

          {/* Points reward preview */}
          {step.points_reward && (
            <div className="points-preview">
              <span className="points-icon">🏆</span>
              <span>+{step.points_reward} points for completing this step!</span>
            </div>
          )}

          {/* Action hints */}
          <div className="action-hint">
            {step.action_type === 'click' && (
              <p>👆 Click the highlighted element to continue</p>
            )}
            {step.action_type === 'input' && (
              <p>✍️ {step.action_data?.value ? 
                `Enter "${step.action_data.value}" in the highlighted field` : 
                'Fill in the highlighted field'
              }</p>
            )}
            {step.action_type === 'navigation' && (
              <p>🧭 Navigate to {step.action_data?.route} to continue</p>
            )}
            {step.action_type === 'info' && (
              <p>📖 Read the information and continue</p>
            )}
          </div>

          {/* Next step preview */}
          {step.next_step_preview && !isLastStep && (
            <div className="next-preview">
              <small>Next: {step.next_step_preview}</small>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="tutorial-footer">
          <div className="footer-left">
            {!isFirstStep && (
              <button 
                onClick={onPrevious}
                className="nav-button secondary"
                disabled={isFirstStep}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
            )}
          </div>
          
          <div className="footer-right">
            {step.action_type === 'info' && (
              <button 
                onClick={handleManualComplete}
                className="nav-button primary"
              >
                {isLastStep ? 'Complete Tutorial' : 'Continue'}
                <ChevronRight size={16} />
              </button>
            )}
            
            {step.action_type !== 'info' && (
              <button 
                onClick={handleManualComplete}
                className="nav-button secondary small"
              >
                Skip Step
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .tutorial-tooltip {
          position: fixed;
          background: white;
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          max-width: 420px;
          min-width: 320px;
          z-index: 10001;
          opacity: 0;
          transform: scale(0.9) translateY(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e5e7eb;
        }
        
        .tutorial-tooltip.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        
        .tutorial-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .tutorial-progress {
          flex: 1;
        }
        
        .progress-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .step-counter {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
        }
        
        .progress-bar {
          width: 200px;
          height: 6px;
          background: #f3f4f6;
          border-radius: 3px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4F46E5, #7C3AED);
          border-radius: 3px;
          transition: width 0.5s ease;
        }
        
        .skip-button {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        
        .skip-button:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .game-stats {
          display: flex;
          gap: 16px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-bottom: 1px solid #f3f4f6;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }
        
        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #4F46E5;
        }
        
        .tutorial-content {
          padding: 24px;
        }
        
        .tutorial-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }
        
        .tutorial-description {
          font-size: 16px;
          color: #4b5563;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }
        
        .tutorial-image img {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin: 16px 0;
        }
        
        .tutorial-extended-content {
          margin: 16px 0;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 4px solid #4F46E5;
        }
        
        .tutorial-extended-content p {
          margin: 0;
          color: #374151;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .points-preview {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 16px 0;
          padding: 12px 16px;
          background: linear-gradient(135deg, #fef3c7, #fed7aa);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #92400e;
        }
        
        .points-icon {
          font-size: 18px;
        }
        
        .action-hint {
          margin: 20px 0;
          padding: 16px;
          background: #eff6ff;
          border-radius: 8px;
          border: 1px solid #dbeafe;
        }
        
        .action-hint p {
          margin: 0;
          font-size: 14px;
          color: #1e40af;
          font-weight: 500;
        }
        
        .next-preview {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
        }
        
        .next-preview small {
          color: #6b7280;
          font-size: 13px;
          font-style: italic;
        }
        
        .tutorial-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-top: 1px solid #f3f4f6;
          background: #fafafa;
          border-radius: 0 0 16px 16px;
        }
        
        .footer-left,
        .footer-right {
          display: flex;
          gap: 12px;
        }
        
        .nav-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        
        .nav-button.primary {
          background: #4F46E5;
          color: white;
        }
        
        .nav-button.primary:hover {
          background: #4338CA;
          transform: translateY(-1px);
        }
        
        .nav-button.secondary {
          background: white;
          color: #4b5563;
          border: 1px solid #d1d5db;
        }
        
        .nav-button.secondary:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
        
        .nav-button.small {
          padding: 8px 12px;
          font-size: 13px;
        }
        
        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .nav-button:disabled:hover {
          transform: none;
          background: #f3f4f6;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .tutorial-tooltip {
            max-width: 90vw;
            min-width: 280px;
            margin: 10px;
            position: fixed !important;
            bottom: 20px !important;
            left: 5% !important;
            right: 5% !important;
            top: auto !important;
            transform: none !important;
          }
          
          .tutorial-tooltip.visible {
            transform: none !important;
          }
          
          .progress-bar {
            width: 150px;
          }
          
          .game-stats {
            gap: 12px;
          }
          
          .tutorial-content {
            padding: 20px;
          }
          
          .tutorial-title {
            font-size: 18px;
          }
          
          .tutorial-footer {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          
          .footer-left,
          .footer-right {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  )
}

export default TutorialTooltip