'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import WorkoutTimer from './WorkoutTimer';
import RestTimer from './RestTimer';
import ExerciseCard from './ExerciseCard';
import WorkoutControls from './WorkoutControls';
import AddExerciseDialog from './AddExerciseDialog';
import type { Workout, Exercise } from '@/types/workout.types';
import { useRestTimer } from '../hooks/useRestTimer';
import { useNavbar } from '@/app/contexts/NavbarContext';

interface ActiveWorkoutViewProps {
  workout: Workout;
  onAddExercise: (name: string) => void;
  onUpdateExercise: (exerciseId: string, exercise: Exercise) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onReplaceExercise: (exerciseId: string, newName: string) => void;
  onCompleteWorkout: () => void;
  onCancelWorkout: () => void;
}

export default function ActiveWorkoutView({
  workout,
  onAddExercise,
  onUpdateExercise,
  onDeleteExercise,
  onReplaceExercise,
  onCompleteWorkout,
  onCancelWorkout,
}: ActiveWorkoutViewProps) {
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [replacingExerciseId, setReplacingExerciseId] = useState<string | null>(null);
  const { restTimer, startRestTimer, stopRestTimer, skipRestTimer } = useRestTimer();
  const { setNavbarVisible } = useNavbar();

  useEffect(() => {
    setNavbarVisible(false);

    return () => {
      setNavbarVisible(true);
    };
  }, [setNavbarVisible]);

  const handleExerciseUpdate = (exerciseId: string, exercise: Exercise) => {
    onUpdateExercise(exerciseId, exercise);

    const hasCompletedSet = exercise.sets.some(
      (set) => set.completed && set.completedAt && Date.now() - set.completedAt < 1000
    );

    // Start or restart the timer when a set is completed (even if timer is already running)
    if (hasCompletedSet) {
      startRestTimer(exerciseId);
    }
  };

  const handleReplaceExercise = (exerciseId: string) => {
    setReplacingExerciseId(exerciseId);
    setShowAddExercise(true);
  };

  const handleAddOrReplaceExercise = (name: string) => {
    if (replacingExerciseId) {
      onReplaceExercise(replacingExerciseId, name);
      setReplacingExerciseId(null);
    } else {
      onAddExercise(name);
    }
    setShowAddExercise(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 pb-20">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-background z-10 py-4">
          <WorkoutTimer startTime={workout.startTime} />
        </div>

        {workout.exercises.length === 0 ? (
          <div className="text-center pb-12">
            <p className="text-muted-foreground mb-4">
              Keine Übungen hinzugefügt
            </p>
            <Button onClick={() => setShowAddExercise(true)} className={"flex flex-row justify-center items-center gap-2 w-full"}>
              <Plus size={18} className="mr-2" />
              Erste Übung hinzufügen
            </Button>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {workout.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onUpdate={(updated) => handleExerciseUpdate(exercise.id, updated)}
                onDelete={() => onDeleteExercise(exercise.id)}
                onReplace={() => handleReplaceExercise(exercise.id)}
              />
            ))}
          </div>
        )}

        {workout.exercises.length > 0 && (
          <Button
            onClick={() => setShowAddExercise(true)}
            variant="outline"
            className="w-full"
          >
            Übung hinzufügen
          </Button>
        )}

        <WorkoutControls
          workout={workout}
          onCompleteWorkout={onCompleteWorkout}
          onCancelWorkout={onCancelWorkout}
        />
      </div>

      {restTimer.active && (
        <RestTimer
          duration={restTimer.duration}
          onComplete={stopRestTimer}
          onSkip={skipRestTimer}
        />
      )}

      {showAddExercise && (
        <AddExerciseDialog
          onAdd={handleAddOrReplaceExercise}
          onClose={() => {
            setShowAddExercise(false);
            setReplacingExerciseId(null);
          }}
        />
      )}
    </div>
  );
}
