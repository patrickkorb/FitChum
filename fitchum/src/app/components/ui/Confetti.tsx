'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface ConfettiCelebrationProps {
  trigger: boolean;
  type?: 'workout' | 'achievement' | 'streak' | 'milestone';
  duration?: number;
  onComplete?: () => void;
}

const confettiPresets = {
  workout: {
    colors: ['#4CAF50', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9'],
    numberOfPieces: 150,
    gravity: 0.6,
    friction: 0.95,
    wind: 0.02,
    initialVelocityX: { min: -15, max: 15 },
    initialVelocityY: { min: -20, max: 5 },
  },
  achievement: {
    colors: ['#FFD700', '#FFA500', '#FF8C00', '#FFB347', '#FFCC5C'],
    numberOfPieces: 250,
    gravity: 0.5,
    friction: 0.94,
    wind: 0.03,
    initialVelocityX: { min: -20, max: 20 },
    initialVelocityY: { min: -25, max: 0 },
  },
  streak: {
    colors: ['#FF5722', '#FF7043', '#FF8A65', '#FFAB40', '#FFB74D'],
    numberOfPieces: 200,
    gravity: 0.65,
    friction: 0.95,
    wind: 0.025,
    initialVelocityX: { min: -18, max: 18 },
    initialVelocityY: { min: -22, max: 3 },
  },
  milestone: {
    colors: ['#E91E63', '#F06292', '#BA68C8', '#9C27B0', '#673AB7'],
    numberOfPieces: 300,
    gravity: 0.45,
    friction: 0.93,
    wind: 0.035,
    initialVelocityX: { min: -25, max: 25 },
    initialVelocityY: { min: -30, max: -5 },
  }
};

export default function ConfettiCelebration({ 
  trigger, 
  type = 'workout', 
  duration = 2000, // Reduced from 3000ms to 2000ms
  onComplete 
}: ConfettiCelebrationProps) {
  const [isActive, setIsActive] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set initial window size
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      
      // Auto-stop confetti after duration
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, onComplete]);

  if (!isActive || windowSize.width === 0) {
    return null;
  }

  const preset = confettiPresets[type];

  return (
    <Confetti
      width={windowSize.width}
      height={windowSize.height}
      numberOfPieces={preset.numberOfPieces}
      colors={preset.colors}
      gravity={preset.gravity}
      friction={preset.friction}
      wind={preset.wind}
      initialVelocityX={preset.initialVelocityX}
      initialVelocityY={preset.initialVelocityY}
      confettiSource={{
        x: windowSize.width / 2,
        y: windowSize.height / 2,
        w: 10,
        h: 10
      }}
      recycle={false}
      run={isActive}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
}

// Hook for easy confetti triggering
export function useConfetti() {
  const [confettiState, setConfettiState] = useState({
    trigger: false,
    type: 'workout' as 'workout' | 'achievement' | 'streak' | 'milestone',
    key: 0 // Add key to force re-render
  });

  const celebrate = (type: 'workout' | 'achievement' | 'streak' | 'milestone' = 'workout') => {
    setConfettiState(prev => ({ 
      trigger: true, 
      type, 
      key: prev.key + 1 // Increment to force new confetti instance
    }));
  };

  const reset = () => {
    setConfettiState(prev => ({ 
      trigger: false, 
      type: 'workout',
      key: prev.key
    }));
  };

  return {
    ...confettiState,
    celebrate,
    reset
  };
}