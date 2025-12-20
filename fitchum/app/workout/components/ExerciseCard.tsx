'use client';

import { Trash2, Plus, MoreVertical, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DropdownMenu from '@/components/ui/DropdownMenu';
import ExerciseInput from './ExerciseInput';
import type { Exercise, Set } from '@/types/workout.types';
import { addSetToExercise, removeSetFromExercise, updateSetInExercise } from '@/lib/workoutUtils';
import { getPreviousExerciseData } from '@/lib/localStorage';

export interface ExerciseCardProps {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  onDelete: () => void;
  onReplace?: () => void;
}

export default function ExerciseCard({
  exercise,
  onUpdate,
  onDelete,
  onReplace,
}: ExerciseCardProps) {
  const handleAddSet = () => {
    const updatedExercise = addSetToExercise(exercise);
    onUpdate(updatedExercise);
  };

  const handleDeleteSet = (setId: string) => {
    if (exercise.sets.length === 1) {
      return;
    }
    const updatedExercise = removeSetFromExercise(exercise, setId);
    onUpdate(updatedExercise);
  };

  const handleSetUpdate = (setId: string, updates: Partial<Set>) => {
    const updatedExercise = updateSetInExercise(exercise, setId, updates);
    onUpdate(updatedExercise);
  };

  const getPreviousData = (setNumber: number) => {
    return getPreviousExerciseData(exercise.name, setNumber);
  };

  const menuItems = [
    ...(onReplace
      ? [
          {
            label: 'Übung ersetzen',
            onClick: onReplace,
            icon: <RefreshCw size={16} />,
          },
        ]
      : []),
    {
      label: 'Übung löschen',
      onClick: onDelete,
      icon: <Trash2 size={16} />,
      destructive: true,
    },
  ];

  return (
    <Card className="space-y-3 w-full">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-semibold text-primary">
          {exercise.name}
        </h3>
        <DropdownMenu
          trigger={
            <button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Options for ${exercise.name}`}
            >
              <MoreVertical size={20} />
            </button>
          }
          items={menuItems}
        />
      </div>

      <div className="space-y-2">
        {exercise.sets.map((set) => {
          const previousData = getPreviousData(set.setNumber);

          return (
            <ExerciseInput
              key={set.id}
              setNumber={set.setNumber}
              previousReps={previousData?.reps ?? null}
              previousWeight={previousData?.weight ?? null}
              currentReps={set.currentReps}
              currentWeight={set.currentWeight}
              completed={set.completed}
              onRepsChange={(value) =>
                handleSetUpdate(set.id, { currentReps: value })
              }
              onWeightChange={(value) =>
                handleSetUpdate(set.id, { currentWeight: value })
              }
              onCompletedChange={(completed) =>
                handleSetUpdate(set.id, {
                  completed,
                  completedAt: completed ? Date.now() : undefined,
                })
              }
              onDelete={() => handleDeleteSet(set.id)}
              onBulkUpdate={(updates) => handleSetUpdate(set.id, updates)}
              canDelete={exercise.sets.length > 1}
            />
          );
        })}
      </div>

      <Button
        onClick={handleAddSet}
        variant="ghost"
        size="sm"
        className="w-full"
      >
        Set hinzufügen
      </Button>
    </Card>
  );
}
