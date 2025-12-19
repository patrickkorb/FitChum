'use client';

import { Clock, Dumbbell, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import type { Workout } from '@/types/workout.types';
import {
  calculateTotalVolume,
  calculateCompletedSets,
  getWorkoutDuration,
  formatDuration,
  formatWorkoutDate,
} from '@/lib/workoutUtils';
import { getWorkoutTemplates } from '@/lib/localStorage';

interface WorkoutHistoryCardProps {
  workout: Workout;
  onClick: () => void;
}

export default function WorkoutHistoryCard({
  workout,
  onClick,
}: WorkoutHistoryCardProps) {
  const totalVolume = calculateTotalVolume(workout);
  const completedSets = calculateCompletedSets(workout);
  const duration = getWorkoutDuration(workout);
  const dateStr = formatWorkoutDate(workout.startTime);

  // Get template name if workout was from template
  let workoutTitle = 'Freies Workout';
  if (workout.templateId) {
    const templates = getWorkoutTemplates();
    const template = templates.find((t) => t.id === workout.templateId);
    if (template) {
      workoutTitle = template.name;
    }
  }

  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors border border-muted/80 py-4 px-3"
      onClick={onClick}
    >
      <div>
        {/* Header with title and date */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {workoutTitle}
          </h3>
          <p className="text-sm text-muted-foreground">{dateStr}</p>
        </div>

        {/* Exercise List */}
        <div className="space-y-2">
          {workout.exercises.map((exercise) => (
            <div key={exercise.id} className="text-sm text-foreground">
              <span className="font-medium">{exercise.name}</span>
              <span className="text-muted-foreground ml-2">
                ({exercise.sets.filter((s) => s.completed).length} Sets)
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="pt-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(duration)}</span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Dumbbell className="w-4 h-4" />
              <span>{completedSets} Reps</span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>{totalVolume.toLocaleString()} kg</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
