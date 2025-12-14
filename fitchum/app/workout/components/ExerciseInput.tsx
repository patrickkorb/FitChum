'use client';

import { Trash2, Check, Circle } from 'lucide-react';
import { useState, useRef } from 'react';
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
}: ExerciseInputProps) {
  const [shakeReps, setShakeReps] = useState(false);
  const [shakeWeight, setShakeWeight] = useState(false);
  const repsInputRef = useRef<HTMLInputElement>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);

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

  const hasPreviousData = previousReps !== null && previousWeight !== null;

  return (
    <div className={`flex flex-row items-center justify-between gap-1 sm:gap-2 rounded-lg p-2 transition-colors ${
      completed ? 'bg-success/20 border border-success/50' : 'bg-background'
    }`}>
      <Badge variant="muted" className="min-w-[1.5rem] sm:min-w-[2rem] justify-center text-xs sm:text-sm shrink-0">
        {setNumber}
      </Badge>

      <div
        onClick={handleCopyPreviousData}
        className={`w-16 sm:w-20 text-center text-xs sm:text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap ${
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
          className={`w-12 sm:w-16 px-1 sm:px-2 py-1 text-center text-sm rounded border border-muted bg-background text-foreground focus:outline-none focus:border-primary shrink-0 ${shakeReps ? 'shake border-accent-red' : ''}`}
          aria-label={`Set ${setNumber} reps`}
        />

        <span className="text-muted-foreground text-xs sm:text-sm shrink-0">x</span>

        <input
          ref={weightInputRef}
          type="number"
          inputMode="numeric"
          min="0"
          step="0.5"
          value={currentWeight || ''}
          onChange={handleWeightChange}
          placeholder="kg"
          className={`w-12 sm:w-16 px-1 sm:px-2 py-1 text-center text-sm rounded border border-muted bg-background text-foreground focus:outline-none focus:border-primary shrink-0 ${shakeWeight ? 'shake border-accent-red' : ''}`}
          aria-label={`Set ${setNumber} weight`}
        />
      </div>

      <Button
        onClick={handleCompletedChange}
        variant={completed ? "primary" : "ghost"}
        size="sm"
        className="p-1 sm:p-1.5 shrink-0 min-w-[2rem] sm:min-w-[2.5rem]"
        aria-label={`Mark set ${setNumber} as ${completed ? 'incomplete' : 'completed'}`}
      >
        {completed ? (
          <Check className="w-6 h-6"/>
        ) : (
          <Check className="w-6 h-6 border border-muted rounded-sm" />
        )}
      </Button>
    </div>
  );
}
