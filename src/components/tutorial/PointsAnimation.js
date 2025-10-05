'use client'

import React, { useEffect, useState } from 'react'

const PointsAnimation = ({ points, onComplete, show = false }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show && points > 0) {
      setIsVisible(true)
      
      // Hide animation after duration
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          onComplete()
        }, 300) // Wait for fade out animation
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [show, points, onComplete])

  if (!show || points <= 0) return null

  return (
    <>
      <div className={`points-animation ${isVisible ? 'visible' : ''}`}>
        <div className="points-popup">
          <div className="points-icon">🏆</div>
          <div className="points-text">
            <span className="points-earned">+{points}</span>
            <span className="points-label">Points!</span>
          </div>
          <div className="sparkles">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`sparkle sparkle-${i + 1}`}>✨</div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .points-animation {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10002;
          opacity: 0;
          pointer-events: none;
        }
        
        .points-animation.visible {
          animation: pointsEarned 2.5s ease-out forwards;
        }
        
        .points-popup {
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          color: white;
          padding: 24px 32px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(79, 70, 229, 0.3);
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }
        
        .points-popup::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: shimmer 1s ease-out 0.5s;
        }
        
        .points-icon {
          font-size: 32px;
          animation: iconBounce 0.6s ease-out 0.2s both;
        }
        
        .points-text {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .points-earned {
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
          animation: textSlideIn 0.5s ease-out 0.3s both;
        }
        
        .points-label {
          font-size: 16px;
          font-weight: 600;
          opacity: 0.9;
          animation: textSlideIn 0.5s ease-out 0.4s both;
        }
        
        .sparkles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .sparkle {
          position: absolute;
          font-size: 16px;
          opacity: 0;
        }
        
        .sparkle-1 { top: 10%; left: 20%; animation: sparkleFloat 1.5s ease-out 0.5s both; }
        .sparkle-2 { top: 20%; right: 20%; animation: sparkleFloat 1.5s ease-out 0.7s both; }
        .sparkle-3 { bottom: 20%; left: 15%; animation: sparkleFloat 1.5s ease-out 0.9s both; }
        .sparkle-4 { bottom: 15%; right: 25%; animation: sparkleFloat 1.5s ease-out 1.1s both; }
        .sparkle-5 { top: 50%; left: 10%; animation: sparkleFloat 1.5s ease-out 0.6s both; }
        .sparkle-6 { top: 60%; right: 10%; animation: sparkleFloat 1.5s ease-out 1.0s both; }
        
        @keyframes pointsEarned {
          0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.3) translateY(20px);
          }
          20% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.1) translateY(-5px);
          }
          30% { 
            transform: translate(-50%, -50%) scale(0.95) translateY(0);
          }
          40% { 
            transform: translate(-50%, -50%) scale(1.05) translateY(-2px);
          }
          50% { 
            transform: translate(-50%, -50%) scale(1) translateY(0);
          }
          85% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1) translateY(0);
          }
          100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.8) translateY(-10px);
          }
        }
        
        @keyframes iconBounce {
          0% { transform: scale(0.5) rotate(-10deg); }
          50% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        
        @keyframes textSlideIn {
          0% { 
            opacity: 0; 
            transform: translateY(10px);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes sparkleFloat {
          0% { 
            opacity: 0; 
            transform: scale(0.5) translateY(0px) rotate(0deg);
          }
          50% { 
            opacity: 1; 
            transform: scale(1) translateY(-20px) rotate(180deg);
          }
          100% { 
            opacity: 0; 
            transform: scale(0.3) translateY(-40px) rotate(360deg);
          }
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .points-popup {
            padding: 20px 24px;
            gap: 12px;
          }
          
          .points-icon {
            font-size: 24px;
          }
          
          .points-earned {
            font-size: 24px;
          }
          
          .points-label {
            font-size: 14px;
          }
          
          .sparkle {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  )
}

export default PointsAnimation