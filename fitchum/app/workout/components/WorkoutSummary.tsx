'use client';

import { Dumbbell, Clock, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import type { Workout } from '@/types/workout.types';
import {
  calculateTotalVolume,
  calculateCompletedSets,
  getWorkoutDuration,
  formatDuration,
} from '@/lib/workoutUtils';

interface WorkoutSummaryProps {
  workout: Workout;
  onClose: () => void;
}

export default function WorkoutSummary({
  workout,
  onClose,
}: WorkoutSummaryProps) {
  const totalVolume = calculateTotalVolume(workout);
  const completedSets = calculateCompletedSets(workout);
  const duration = getWorkoutDuration(workout);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Workout Complete! 🎉
          </h2>
          <p className="text-muted-foreground">Great job crushing it!</p>
        </div>

        <div className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">
                {formatDuration(duration)}
              </div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <Dumbbell className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">
                {completedSets}
              </div>
              <div className="text-sm text-muted-foreground">Sets</div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">
              {totalVolume.toLocaleString()} kg
            </div>
            <div className="text-sm text-muted-foreground">Total Volume</div>
          </div>

          {/* Exercises Summary */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">
              Exercises ({workout.exercises.length})
            </h3>
            <div className="space-y-2">
              {workout.exercises.map((exercise) => {
                const completedSetsCount = exercise.sets.filter(
                  (s) => s.completed
                ).length;
                return (
                  <div
                    key={exercise.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-foreground">{exercise.name}</span>
                    <span className="text-muted-foreground">
                      {completedSetsCount} / {exercise.sets.length} sets
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Button onClick={onClose} className="w-full" size="lg">
          Done
        </Button>
      </Card>
    </div>
  );
}
