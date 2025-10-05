'use client'

import React, { useState } from 'react'
import { Play, RotateCcw, Skip, Info, Trophy, Star, BookOpen } from 'lucide-react'
import { useTutorialControls } from '@/hooks/useTutorialDetection'
import { useTutorial } from '@/contexts/TutorialContext'

const TutorialSettings = () => {
  const {
    startTutorial,
    skipTutorial,
    resetTutorial,
    isTutorialActive,
    isTutorialCompleted,
    isTutorialLoading,
    tutorialError
  } = useTutorialControls()

  const { gameData } = useTutorial()
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  const handleResetConfirm = async () => {
    await resetTutorial()
    setShowConfirmReset(false)
  }

  return (
    <div className="tutorial-settings">
      <div className="settings-header">
        <div className="header-icon">
          <BookOpen size={24} />
        </div>
        <div className="header-text">
          <h3>Interactive Tutorial</h3>
          <p>Learn how to use Budget Tracker with our step-by-step guide</p>
        </div>
      </div>

      {/* Tutorial Status */}
      <div className="tutorial-status">
        {isTutorialCompleted && (
          <div className="status-card completed">
            <Trophy size={20} />
            <span>Tutorial Completed!</span>
          </div>
        )}
        
        {isTutorialActive && (
          <div className="status-card active">
            <Play size={20} />
            <span>Tutorial In Progress</span>
          </div>
        )}
        
        {!isTutorialCompleted && !isTutorialActive && (
          <div className="status-card pending">
            <Info size={20} />
            <span>Tutorial Available</span>
          </div>
        )}
      </div>

      {/* Game Stats (if completed) */}
      {gameData && isTutorialCompleted && (
        <div className="game-stats">
          <h4>Your Tutorial Achievements</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-text">
                <span className="stat-value">{gameData.total_points}</span>
                <span className="stat-label">Total Points</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-text">
                <span className="stat-value">{gameData.user_level}</span>
                <span className="stat-label">Level Reached</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-text">
                <span className="stat-value">{gameData.badges_earned?.length || 0}</span>
                <span className="stat-label">Badges Earned</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Controls */}
      <div className="tutorial-controls">
        <h4>Tutorial Actions</h4>
        
        <div className="control-buttons">
          {!isTutorialActive && (
            <button
              onClick={startTutorial}
              disabled={isTutorialLoading}
              className="control-button primary"
            >
              <Play size={18} />
              {isTutorialCompleted ? 'Replay Tutorial' : 'Start Tutorial'}
            </button>
          )}

          {isTutorialActive && (
            <button
              onClick={skipTutorial}
              disabled={isTutorialLoading}
              className="control-button secondary"
            >
              <Skip size={18} />
              Skip Tutorial
            </button>
          )}

          {isTutorialCompleted && (
            <button
              onClick={() => setShowConfirmReset(true)}
              disabled={isTutorialLoading}
              className="control-button outline"
            >
              <RotateCcw size={18} />
              Reset Progress
            </button>
          )}
        </div>

        {tutorialError && (
          <div className="error-message">
            <Info size={16} />
            <span>{tutorialError}</span>
          </div>
        )}
      </div>

      {/* Tutorial Info */}
      <div className="tutorial-info">
        <h4>What You'll Learn</h4>
        <ul className="feature-list">
          <li>
            <Star size={16} />
            <span>How to create and manage budget categories</span>
          </li>
          <li>
            <Star size={16} />
            <span>Adding and tracking your expenses</span>
          </li>
          <li>
            <Star size={16} />
            <span>Understanding your spending patterns</span>
          </li>
          <li>
            <Star size={16} />
            <span>Using reports and insights</span>
          </li>
          <li>
            <Star size={16} />
            <span>Setting up budget alerts and notifications</span>
          </li>
        </ul>
        
        <div className="tutorial-duration">
          <Info size={16} />
          <span>Estimated completion time: 5-10 minutes</span>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reset Tutorial Progress?</h3>
            <p>
              This will reset all your tutorial progress including points, 
              badges, and completion status. You'll be able to go through 
              the tutorial again from the beginning.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="modal-button secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="modal-button danger"
                disabled={isTutorialLoading}
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .tutorial-settings {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .settings-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f3f4f6;
        }

        .header-icon {
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-text h3 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .header-text p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .tutorial-status {
          margin-bottom: 24px;
        }

        .status-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
        }

        .status-card.completed {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #10b981;
        }

        .status-card.active {
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #3b82f6;
        }

        .status-card.pending {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #f59e0b;
        }

        .game-stats {
          margin-bottom: 24px;
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .game-stats h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .stat-icon {
          font-size: 24px;
        }

        .stat-text {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .tutorial-controls {
          margin-bottom: 24px;
        }

        .tutorial-controls h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }

        .control-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .control-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          width: 100%;
        }

        .control-button.primary {
          background: #4F46E5;
          color: white;
        }

        .control-button.primary:hover:not(:disabled) {
          background: #4338CA;
          transform: translateY(-1px);
        }

        .control-button.secondary {
          background: #6b7280;
          color: white;
        }

        .control-button.secondary:hover:not(:disabled) {
          background: #4b5563;
        }

        .control-button.outline {
          background: white;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .control-button.outline:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .control-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding: 12px;
          background: #fef2f2;
          color: #dc2626;
          border-radius: 6px;
          border: 1px solid #fecaca;
          font-size: 14px;
        }

        .tutorial-info h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0 0 16px 0;
        }

        .feature-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          font-size: 14px;
          color: #4b5563;
        }

        .feature-list li svg {
          color: #4F46E5;
          flex-shrink: 0;
        }

        .tutorial-duration {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f0f9ff;
          border-radius: 6px;
          border: 1px solid #bae6fd;
          font-size: 14px;
          color: #0369a1;
        }

        .tutorial-duration svg {
          flex-shrink: 0;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .modal-content h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .modal-content p {
          margin: 0 0 24px 0;
          color: #6b7280;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .modal-button {
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .modal-button.secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .modal-button.secondary:hover {
          background: #e5e7eb;
        }

        .modal-button.danger {
          background: #dc2626;
          color: white;
        }

        .modal-button.danger:hover:not(:disabled) {
          background: #b91c1c;
        }

        .modal-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .tutorial-settings {
            padding: 20px;
          }

          .settings-header {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .modal-content {
            margin: 20px;
            padding: 20px;
          }

          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default TutorialSettings