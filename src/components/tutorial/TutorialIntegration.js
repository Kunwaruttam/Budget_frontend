'use client'

import React, { useEffect } from 'react'
import { useTutorialDetection } from '@/hooks/useTutorialDetection'
import Tutorial from './Tutorial'

/**
 * Tutorial Integration Component
 * Add this to your main dashboard or app component to enable automatic tutorial detection
 */
const TutorialIntegration = ({ children }) => {
  const {
    isTutorialActive,
    isTutorialCompleted,
    isTutorialSkipped,
    isTutorialLoading,
    userNeedsTutorial
  } = useTutorialDetection()

  // Log tutorial status for debugging
  useEffect(() => {
    // Remove debug logging in production
  }, [isTutorialActive, isTutorialCompleted, isTutorialSkipped, isTutorialLoading, userNeedsTutorial])

  return (
    <>
      {children}
      
      {/* Render Tutorial component */}
      <Tutorial />
      
      {/* Tutorial loading indicator (optional) */}
      {isTutorialLoading && (
        <div className="tutorial-loading-indicator">
          <div className="loading-content">
            <div className="spinner" />
            <span>Preparing tutorial...</span>
          </div>
          
          <style jsx>{`
            .tutorial-loading-indicator {
              position: fixed;
              top: 20px;
              right: 20px;
              background: white;
              padding: 12px 16px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border: 1px solid #e5e7eb;
              z-index: 1000;
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              color: #6b7280;
            }
            
            .loading-content {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .spinner {
              width: 16px;
              height: 16px;
              border: 2px solid #f3f4f6;
              border-top: 2px solid #4F46E5;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </>
  )
}

export default TutorialIntegration