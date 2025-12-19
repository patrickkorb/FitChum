'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { formatTimeRemaining } from '@/lib/workoutUtils';

interface RestTimerProps {
  duration: number;
  onComplete: () => void;
  onSkip: () => void;
}

export default function RestTimer({
  duration,
  onComplete,
  onSkip,
}: RestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    if (timeRemaining <= 0) {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, onComplete]);

  const progress = ((duration - timeRemaining) / duration) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* Progress bar */}
          <div className="mb-2 h-1.5 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-foreground transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Timer info */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Rest Time</span>
              <span className="text-2xl font-mono font-bold">
                {formatTimeRemaining(timeRemaining)}
              </span>
            </div>

            {/* Skip button */}
            <button
              onClick={onSkip}
              className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              aria-label="Skip rest timer"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
