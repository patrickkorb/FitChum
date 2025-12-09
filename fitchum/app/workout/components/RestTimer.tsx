'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
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
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4">
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Skip rest timer"
      >
        <X size={32} />
      </button>

      <div className="flex flex-col items-center gap-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Rest Time
        </h2>

        <div className="relative w-80 h-80 flex items-center justify-center">
          <svg
            className="transform -rotate-90 w-full h-full"
            viewBox="0 0 300 300"
          >
            <circle
              cx="150"
              cy="150"
              r="140"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="150"
              cy="150"
              r="140"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl font-mono font-bold text-primary">
              {formatTimeRemaining(timeRemaining)}
            </div>
          </div>
        </div>

        <Button
          onClick={onSkip}
          variant="outline"
          size="lg"
          className="px-12"
        >
          Skip Rest
        </Button>
      </div>
    </div>
  );
}
