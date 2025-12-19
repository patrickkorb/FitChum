'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ConfirmDialog from './ConfirmDialog';
import type { Workout } from '@/types/workout.types';

interface WorkoutControlsProps {
  workout: Workout;
  onCompleteWorkout: () => void;
  onCancelWorkout: () => void;
}

export default function WorkoutControls({
  workout,
  onCompleteWorkout,
  onCancelWorkout,
}: WorkoutControlsProps) {
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Check if cancel button should be visible
  const hasExercises = workout.exercises.length > 0;
  const workoutDuration = Date.now() - workout.startTime;
  const isWithinFiveMinutes = workoutDuration < 300000; // 5 minutes in ms
  const hasCompletedSets = workout.exercises.some((exercise) =>
    exercise.sets.some((set) => set.completed)
  );

  const showCancelButton = isWithinFiveMinutes || !hasCompletedSets;

  const handleCompleteConfirm = () => {
    setShowCompleteConfirm(false);
    onCompleteWorkout();
  };

  const handleCancelConfirm = () => {
    setShowCancelConfirm(false);
    onCancelWorkout();
  };

  return (
    <>
      <div className="mt-8 mb-6 space-y-3">
        <Button
          onClick={() => setShowCompleteConfirm(true)}
          variant="ghost"
          disabled={!hasExercises}
          className="w-full text-primary flex flex-row justify-center items-center"
        >
          Workout beenden
        </Button>

        {showCancelButton && (
          <Button
            onClick={() => setShowCancelConfirm(true)}
            variant="ghost"
            className="w-full text-red-500 flex flex-row justify-center items-center"
          >
            Workout abbrechen
          </Button>
        )}
      </div>

      {showCompleteConfirm && (
        <ConfirmDialog
          title="Workout beenden"
          message="Möchtest du das Workout wirklich beenden? Es wird in deinem Verlauf gespeichert."
          confirmText="Beenden"
          onConfirm={handleCompleteConfirm}
          onCancel={() => setShowCompleteConfirm(false)}
        />
      )}

      {showCancelConfirm && (
        <ConfirmDialog
          title="Workout abbrechen"
          message="Möchtest du das Workout wirklich abbrechen? Alle Daten gehen verloren."
          confirmText="Abbrechen"
          onConfirm={handleCancelConfirm}
          onCancel={() => setShowCancelConfirm(false)}
          isDanger
        />
      )}
    </>
  );
}
