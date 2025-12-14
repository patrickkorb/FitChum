'use client';

import { useState, useEffect } from 'react';
import { getWorkoutHistory } from '@/lib/localStorage';
import WorkoutHistoryCard from './components/WorkoutHistoryCard';
import WorkoutDetailModal from './components/WorkoutDetailModal';
import EmptyHistoryState from './components/EmptyHistoryState';
import type { Workout } from '@/types/workout.types';

export default function VerlaufPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const history = getWorkoutHistory();
    setWorkouts(history);
  }, []);

  if (workouts.length === 0) {
    return <EmptyHistoryState />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Workout Verlauf
        </h1>

        <div className="space-y-3">
          {workouts.map((workout) => (
            <WorkoutHistoryCard
              key={workout.id}
              workout={workout}
              onClick={() => setSelectedWorkout(workout)}
            />
          ))}
        </div>
      </div>

      {selectedWorkout && (
        <WorkoutDetailModal
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
    </div>
  );
}
