'use client';

import { Save, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface WorkoutControlsProps {
  onSaveTemplate: () => void;
  onCompleteWorkout: () => void;
  hasExercises: boolean;
}

export default function WorkoutControls({
  onSaveTemplate,
  onCompleteWorkout,
  hasExercises,
}: WorkoutControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        <Button
            onClick={onCompleteWorkout}
            variant="primary"
            disabled={!hasExercises}
            className="flex-1 flex flex-row justify-center items-center"
        >
          Workout beenden
        </Button>

        <Button
          onClick={onSaveTemplate}
          variant="outline"
          disabled={!hasExercises}
          className="flex-1"
        >
          Als Template speichern
        </Button>
      </div>
    </div>
  );
}
