'use client'

import React from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const TutorialTooltipSimple = ({ 
  step, 
  onComplete, 
  onSkip, 
  onPrevious,
  currentStepNumber,
  totalSteps 
}) => {
  if (!step) return null

  const handleNext = () => {
    onComplete(step.id, { completed_at: new Date().toISOString() })
  }

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    }
  }

  return (
    <div className="tutorial-tooltip-small">
      {/* Small hint box */}
      <div className="hint-box">
        <div className="hint-header">
          <span className="step-counter">Step {currentStepNumber} of {totalSteps}</span>
          <button onClick={onSkip} className="close-btn">
            <X size={16} />
          </button>
        </div>
        
        <div className="hint-content">
          <h3 className="hint-title">{step.title}</h3>
          <p className="hint-description">{step.content}</p>
        </div>
        
        <div className="hint-actions">
          {currentStepNumber > 1 && (
            <button onClick={handlePrevious} className="btn-previous">
              <ChevronLeft size={16} />
              Previous
            </button>
          )}
          <button onClick={handleNext} className="btn-next">
            Next
            <ChevronRight size={16} />
          </button>
          <button onClick={onSkip} className="btn-skip">
            Skip Tutorial
          </button>
        </div>
      </div>

      <style jsx>{`
        .tutorial-tooltip-small {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          max-width: 350px;
        }

        .hint-box {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
        }

        .hint-header {
          background: #4f46e5;
          color: white;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .step-counter {
          font-size: 14px;
          font-weight: 500;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .hint-content {
          padding: 16px;
        }

        .hint-title {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .hint-description {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
        }

        .hint-actions {
          padding: 12px 16px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .btn-previous,
        .btn-next,
        .btn-skip {
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-previous {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          color: #6b7280;
        }

        .btn-previous:hover {
          background: #e5e7eb;
        }

        .btn-next {
          background: #4f46e5;
          border: 1px solid #4f46e5;
          color: white;
        }

        .btn-next:hover {
          background: #4338ca;
        }

        .btn-skip {
          background: transparent;
          border: 1px solid #d1d5db;
          color: #6b7280;
        }

        .btn-skip:hover {
          background: #f9fafb;
        }

        @keyframes slideIn {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .tutorial-tooltip-small {
            bottom: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }

          .hint-actions {
            flex-direction: column;
          }

          .btn-previous,
          .btn-next,
          .btn-skip {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default TutorialTooltipSimple