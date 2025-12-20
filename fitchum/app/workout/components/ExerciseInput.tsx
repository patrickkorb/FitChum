'use client';

import { Trash2, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatPreviousData, validateNumberInput } from '@/lib/workoutUtils';

export interface ExerciseInputProps {
  setNumber: number;
  previousReps: number | null;
  previousWeight: number | null;
  currentReps: number;
  currentWeight: number;
  completed: boolean;
  onRepsChange: (value: number) => void;
  onWeightChange: (value: number) => void;
  onCompletedChange: (completed: boolean) => void;
  onDelete: () => void;
  onBulkUpdate?: (updates: { currentReps: number; currentWeight: number }) => void;
  canDelete?: boolean;
}

export default function ExerciseInput({
  setNumber,
  previousReps,
  previousWeight,
  currentReps,
  currentWeight,
  completed,
  onRepsChange,
  onWeightChange,
  onCompletedChange,
  onDelete,
  onBulkUpdate,
  canDelete = true,
}: ExerciseInputProps) {
  const [shakeReps, setShakeReps] = useState(false);
  const [shakeWeight, setShakeWeight] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const repsInputRef = useRef<HTMLInputElement>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateNumberInput(e.target.value);
    onRepsChange(value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateNumberInput(e.target.value);
    onWeightChange(value);
  };

  const handleCopyPreviousData = () => {
    if (previousReps !== null && previousWeight !== null) {
      if (onBulkUpdate) {
        onBulkUpdate({
          currentReps: Number(previousReps),
          currentWeight: Number(previousWeight),
        });
      } else {
        onRepsChange(Number(previousReps));
        onWeightChange(Number(previousWeight));
      }
    }
  };

  const handleCompletedChange = () => {
    // If trying to mark as complete, validate inputs
    if (!completed) {
      const isRepsValid = currentReps > 0;
      const isWeightValid = currentWeight > 0;

      if (!isRepsValid || !isWeightValid) {
        // Trigger shake animation for missing inputs
        if (!isRepsValid) {
          setShakeReps(true);
          setTimeout(() => setShakeReps(false), 500);
        }
        if (!isWeightValid) {
          setShakeWeight(true);
          setTimeout(() => setShakeWeight(false), 500);
        }
        return; // Don't mark as complete
      }
    }

    // If all valid or unmarking as complete, proceed
    onCompletedChange(!completed);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    // Allow both left (negative) and right (positive) swipe
    if (diff < 0) {
      // Swipe left to complete
      setSwipeOffset(Math.max(diff, -100));
    } else if (diff > 0 && canDelete) {
      // Swipe right to delete (only if canDelete)
      setSwipeOffset(Math.min(diff, 100));
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    // Swipe left (negative) = complete/uncomplete
    if (swipeOffset < -60) {
      handleCompletedChange();
    }
    // Swipe right (positive) = delete
    else if (swipeOffset > 60 && canDelete) {
      onDelete();
    }

    // Reset position
    setSwipeOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping) return;
    const diff = e.clientX - startX;

    if (diff < 0) {
      setSwipeOffset(Math.max(diff, -100));
    } else if (diff > 0 && canDelete) {
      setSwipeOffset(Math.min(diff, 100));
    }
  };

  const handleMouseUp = () => {
    setIsSwiping(false);

    if (swipeOffset < -60) {
      handleCompletedChange();
    } else if (swipeOffset > 60 && canDelete) {
      onDelete();
    }

    setSwipeOffset(0);
  };

  const handleMouseLeave = () => {
    if (isSwiping) {
      setIsSwiping(false);
      setSwipeOffset(0);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSwiping) {
        setIsSwiping(false);
        if (swipeOffset < -60) {
          handleCompletedChange();
        } else if (swipeOffset > 60 && canDelete) {
          onDelete();
        }
        setSwipeOffset(0);
      }
    };

    if (isSwiping) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchend', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isSwiping, swipeOffset, canDelete]);

  const hasPreviousData = previousReps !== null && previousWeight !== null;

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Background revealed by swipe */}
      {/* Swipe left = green check background */}
      {swipeOffset < 0 && (
        <div className="absolute inset-0 bg-success flex items-center justify-start px-6">
          <Check size={24} className="text-white" />
        </div>
      )}

      {/* Swipe right = red delete background */}
      {swipeOffset > 0 && canDelete && (
        <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-6">
          <Trash2 size={24} className="text-white" />
        </div>
      )}

      {/* Main content - swipeable */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
        className={`flex flex-row items-center justify-between gap-1 sm:gap-2 rounded-lg p-2 transition-colors ${
          completed ? 'bg-success/20 border border-success/50' : 'bg-background'
        }`}
      >
        <Badge variant="warning" className="min-w-[1.5rem] sm:min-w-[2rem] justify-center text-sm shrink-0">
          {setNumber}
        </Badge>

        <div
          onClick={handleCopyPreviousData}
          className={`w-20 text-center text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap ${
            hasPreviousData ? 'cursor-pointer hover:text-primary transition-colors' : ''
          }`}
          title={hasPreviousData ? 'Click to copy previous values' : ''}
        >
          {formatPreviousData(previousReps, previousWeight)}
        </div>

        <div className="flex flex-row gap-1.5 items-center">
          <input
            ref={repsInputRef}
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={currentReps || ''}
            onChange={handleRepsChange}
            placeholder="reps"
            className={`w-16 px-1.5 py-1.5 text-center text-base rounded border border-muted bg-background text-foreground focus:outline-none focus:border-primary shrink-0 ${shakeReps ? 'shake border-accent-red' : ''}`}
            aria-label={`Set ${setNumber} reps`}
          />

          <span className="text-muted-foreground text-xs sm:text-sm shrink-0">x</span>

          <input
            ref={weightInputRef}
            type="number"
            inputMode="text"
            min="0"
            step="0.5"
            value={currentWeight || ''}
            onChange={handleWeightChange}
            placeholder="kg"
            className={`w-16 py-1.5 text-center text-base rounded border border-muted bg-background text-foreground focus:outline-none focus:border-primary shrink-0 ${shakeWeight ? 'shake border-accent-red' : ''}`}
            aria-label={`Set ${setNumber} weight`}
          />
        </div>
      </div>
    </div>
  );
}
