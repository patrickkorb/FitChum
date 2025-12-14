'use client';

import { X, Clock, Dumbbell, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ExerciseDetailView from './ExerciseDetailView';
import type { Workout } from '@/types/workout.types';
import {
  calculateTotalVolume,
  calculateCompletedSets,
  getWorkoutDuration,
  formatDuration,
  formatWorkoutDate,
} from '@/lib/workoutUtils';
import { getWorkoutTemplates } from '@/lib/localStorage';

interface WorkoutDetailModalProps {
  workout: Workout;
  onClose: () => void;
}

export default function WorkoutDetailModal({
  workout,
  onClose,
}: WorkoutDetailModalProps) {
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
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4">
      <div className="w-full max-w-2xl my-8">
        <Card className="space-y-0 overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-card z-10 border-b border-border px-4 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">
              Workout Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          {/* Workout Info */}
          <div className="px-4 py-4 border-b border-border">
            {templateName && (
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {templateName}
              </h3>
            )}
            <p className="text-muted-foreground mb-4">{dateStr}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-lg font-bold text-foreground">
                  {formatDuration(duration)}
                </div>
                <div className="text-xs text-muted-foreground">Duration</div>
              </div>

              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <Dumbbell className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-lg font-bold text-foreground">
                  {completedSets}
                </div>
                <div className="text-xs text-muted-foreground">Sets</div>
              </div>

              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-lg font-bold text-foreground">
                  {totalVolume.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">kg</div>
              </div>
            </div>
          </div>

          {/* Exercises List */}
          <div className="px-4 py-3 border-b border-border">
            <h4 className="font-semibold text-foreground mb-2">
              Übungen ({workout.exercises.length})
            </h4>
          </div>

          <div>
            {workout.exercises.map((exercise) => (
              <ExerciseDetailView key={exercise.id} exercise={exercise} />
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-4 bg-muted/30">
            <Button onClick={onClose} className="w-full">
              Schließen
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
