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
    numberOfPieces: 100,
    gravity: 0.3,
    friction: 0.99,
    wind: 0.01,
  },
  achievement: {
    colors: ['#FFD700', '#FFA500', '#FF8C00', '#FFB347', '#FFCC5C'],
    numberOfPieces: 200,
    gravity: 0.25,
    friction: 0.98,
    wind: 0.02,
  },
  streak: {
    colors: ['#FF9800', '#FFB74D', '#FFCC02', '#FFF176', '#FFEB3B'],
    numberOfPieces: 150,
    gravity: 0.35,
    friction: 0.99,
    wind: 0.015,
  },
  milestone: {
    colors: ['#E91E63', '#F06292', '#BA68C8', '#9C27B0', '#673AB7'],
    numberOfPieces: 250,
    gravity: 0.2,
    friction: 0.97,
    wind: 0.025,
  }
};

export default function ConfettiCelebration({ 
  trigger, 
  type = 'workout', 
  duration = 3000,
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
    if (trigger && !isActive) {
      setIsActive(true);
      
      // Auto-stop confetti after duration
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, isActive, duration, onComplete]);

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
    type: 'workout' as 'workout' | 'achievement' | 'streak' | 'milestone'
  });

  const celebrate = (type: 'workout' | 'achievement' | 'streak' | 'milestone' = 'workout') => {
    setConfettiState({ trigger: true, type });
  };

  const reset = () => {
    setConfettiState({ trigger: false, type: 'workout' });
  };

  return {
    ...confettiState,
    celebrate,
    reset
  };
}