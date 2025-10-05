'use client'

import React, { useEffect, useState } from 'react'
import { Trophy, Star, Gift, ArrowRight } from 'lucide-react'

const CompletionCelebration = ({ celebration, onClose, show = false }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [confettiPieces, setConfettiPieces] = useState([])

  useEffect(() => {
    if (show && celebration) {
      setIsVisible(true)
      startConfetti()
    }
  }, [show, celebration])

  const startConfetti = () => {
    const pieces = []
    const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#EF4444', '#F59E0B', '#10B981']
    
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
        x: Math.random() * 100,
        rotation: Math.random() * 360
      })
    }
    
    setConfettiPieces(pieces)
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 500)
  }

  if (!show || !celebration) return null

  return (
    <>
      <div className={`celebration-overlay ${isVisible ? 'visible' : ''}`}>
        {/* Confetti */}
        <div className="confetti-container">
          {confettiPieces.map(piece => (
            <div
              key={piece.id}
              className="confetti-piece"
              style={{
                backgroundColor: piece.color,
                left: `${piece.x}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                transform: `rotate(${piece.rotation}deg)`
              }}
            />
          ))}
        </div>

        {/* Main celebration content */}
        <div className={`celebration-content ${isVisible ? 'visible' : ''}`}>
          {/* Trophy animation */}
          <div className="trophy-container">
            <div className="trophy-glow" />
            <Trophy size={80} className="trophy-icon" />
            <div className="trophy-sparkles">
              {[...Array(8)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={`sparkle sparkle-${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Title and message */}
          <div className="celebration-text">
            <h1 className="celebration-title">
              {celebration.title || '🎉 Tutorial Complete! 🎉'}
            </h1>
            <p className="celebration-message">
              {celebration.message || 'Congratulations! You\'ve mastered the Budget Tracker!'}
            </p>
          </div>

          {/* Achievements */}
          <div className="achievements">
            {celebration.badge && (
              <div className="achievement-badge">
                <div className="badge-icon">
                  <Gift size={24} />
                </div>
                <div className="badge-text">
                  <span className="badge-title">New Badge Earned!</span>
                  <span className="badge-name">{celebration.badge}</span>
                </div>
              </div>
            )}

            {celebration.bonus_points && (
              <div className="bonus-points">
                <div className="bonus-icon">🏆</div>
                <div className="bonus-text">
                  <span className="bonus-label">Bonus Reward</span>
                  <span className="bonus-amount">+{celebration.bonus_points} Points</span>
                </div>
              </div>
            )}
          </div>

          {/* Stats summary */}
          <div className="completion-stats">
            <div className="stat-item">
              <div className="stat-icon">📚</div>
              <div className="stat-text">
                <span className="stat-number">10</span>
                <span className="stat-label">Steps Completed</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-text">
                <span className="stat-number">Tutorial</span>
                <span className="stat-label">Master Level</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-text">
                <span className="stat-number">100%</span>
                <span className="stat-label">Progress</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button 
            onClick={handleClose}
            className="continue-button"
          >
            <span>Continue to Budget Tracker</span>
            <ArrowRight size={20} />
          </button>

          {/* Motivational message */}
          <div className="motivation-message">
            <p>You're all set to take control of your finances! 💪</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .celebration-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.9);
          z-index: 10003;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .celebration-overlay.visible {
          opacity: 1;
        }
        
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confettiFall linear infinite;
        }
        
        .celebration-content {
          background: white;
          border-radius: 24px;
          padding: 48px 40px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          text-align: center;
          position: relative;
          transform: scale(0.8) translateY(20px);
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .celebration-content.visible {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        
        .trophy-container {
          position: relative;
          margin: 0 auto 32px;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .trophy-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.3), transparent);
          border-radius: 50%;
          animation: glowPulse 2s ease-in-out infinite;
        }
        
        .trophy-icon {
          color: #F59E0B;
          z-index: 1;
          animation: trophyFloat 3s ease-in-out infinite;
        }
        
        .trophy-sparkles {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .sparkle {
          position: absolute;
          color: #4F46E5;
          opacity: 0;
        }
        
        .sparkle-1 { top: 10%; left: 20%; animation: sparkleFloat 2s ease-in-out 0.2s infinite; }
        .sparkle-2 { top: 20%; right: 15%; animation: sparkleFloat 2s ease-in-out 0.4s infinite; }
        .sparkle-3 { bottom: 25%; left: 10%; animation: sparkleFloat 2s ease-in-out 0.6s infinite; }
        .sparkle-4 { bottom: 15%; right: 20%; animation: sparkleFloat 2s ease-in-out 0.8s infinite; }
        .sparkle-5 { top: 50%; left: 5%; animation: sparkleFloat 2s ease-in-out 1.0s infinite; }
        .sparkle-6 { top: 45%; right: 8%; animation: sparkleFloat 2s ease-in-out 1.2s infinite; }
        .sparkle-7 { top: 70%; left: 25%; animation: sparkleFloat 2s ease-in-out 1.4s infinite; }
        .sparkle-8 { top: 65%; right: 30%; animation: sparkleFloat 2s ease-in-out 1.6s infinite; }
        
        .celebration-text {
          margin-bottom: 32px;
        }
        
        .celebration-title {
          font-size: 32px;
          font-weight: 800;
          color: #111827;
          margin: 0 0 16px 0;
          line-height: 1.2;
          animation: titleSlideIn 0.8s ease-out 0.3s both;
        }
        
        .celebration-message {
          font-size: 18px;
          color: #4b5563;
          margin: 0;
          line-height: 1.5;
          animation: messageSlideIn 0.8s ease-out 0.5s both;
        }
        
        .achievements {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }
        
        .achievement-badge {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border-radius: 16px;
          border: 2px solid #3b82f6;
          animation: badgeSlideIn 0.8s ease-out 0.7s both;
        }
        
        .badge-icon {
          background: #3b82f6;
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .badge-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        
        .badge-title {
          font-size: 14px;
          color: #1e40af;
          font-weight: 600;
        }
        
        .badge-name {
          font-size: 18px;
          color: #1e3a8a;
          font-weight: 700;
        }
        
        .bonus-points {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #fef3c7, #fed7aa);
          border-radius: 16px;
          border: 2px solid #f59e0b;
          animation: bonusSlideIn 0.8s ease-out 0.9s both;
        }
        
        .bonus-icon {
          font-size: 32px;
        }
        
        .bonus-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        
        .bonus-label {
          font-size: 14px;
          color: #92400e;
          font-weight: 600;
        }
        
        .bonus-amount {
          font-size: 18px;
          color: #78350f;
          font-weight: 700;
        }
        
        .completion-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
          animation: statsSlideIn 0.8s ease-out 1.1s both;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
        }
        
        .stat-icon {
          font-size: 24px;
        }
        
        .stat-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .stat-number {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }
        
        .continue-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          animation: buttonSlideIn 0.8s ease-out 1.3s both;
        }
        
        .continue-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
        }
        
        .motivation-message {
          margin-top: 24px;
          animation: motivationSlideIn 0.8s ease-out 1.5s both;
        }
        
        .motivation-message p {
          margin: 0;
          font-size: 16px;
          color: #6b7280;
          font-weight: 500;
        }
        
        /* Animations */
        @keyframes confettiFall {
          0% {
            transform: translateY(-10px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
          }
        }
        
        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        @keyframes trophyFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes sparkleFloat {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        
        @keyframes titleSlideIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes messageSlideIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes badgeSlideIn {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes bonusSlideIn {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes statsSlideIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes buttonSlideIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes motivationSlideIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .celebration-content {
            padding: 32px 24px;
            margin: 20px;
            width: calc(100% - 40px);
          }
          
          .trophy-container {
            width: 100px;
            height: 100px;
            margin-bottom: 24px;
          }
          
          .trophy-icon {
            width: 60px;
            height: 60px;
          }
          
          .celebration-title {
            font-size: 24px;
          }
          
          .celebration-message {
            font-size: 16px;
          }
          
          .achievements {
            margin-bottom: 24px;
          }
          
          .achievement-badge,
          .bonus-points {
            padding: 16px;
            gap: 12px;
          }
          
          .completion-stats {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 24px;
          }
          
          .stat-item {
            padding: 12px;
          }
          
          .continue-button {
            padding: 14px 20px;
            font-size: 15px;
          }
        }
      `}</style>
    </>
  )
}

export default CompletionCelebration