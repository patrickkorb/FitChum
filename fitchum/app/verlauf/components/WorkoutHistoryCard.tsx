'use client';

import { Clock, Dumbbell, TrendingUp, ChevronRight } from 'lucide-react';
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
  let templateName: string | null = null;
  if (workout.templateId) {
    const templates = getWorkoutTemplates();
    const template = templates.find((t) => t.id === workout.templateId);
    if (template) {
      templateName = template.name;
    }
  }

  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {templateName && (
              <h3 className="text-lg font-semibold text-foreground">
                {templateName}
              </h3>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-3">{dateStr}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(duration)}</span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Dumbbell className="w-4 h-4" />
              <span>{completedSets} Sets</span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>{totalVolume.toLocaleString()} kg</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            {workout.exercises.length} Übungen
          </p>
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
      </div>
    </Card>
  );
}
