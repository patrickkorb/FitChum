'use client';

import { useState, useEffect } from 'react';
import { getWorkoutHistory } from '@/lib/localStorage';
import WorkoutHistoryCard from './components/WorkoutHistoryCard';
import WorkoutDetailModal from './components/WorkoutDetailModal';
import EmptyHistoryState from './components/EmptyHistoryState';
import MonthSection from './components/MonthSection';
import type { Workout } from '@/types/workout.types';

interface WorkoutsByMonth {
  month: string;
  year: number;
  workouts: Workout[];
}

function groupWorkoutsByMonth(workouts: Workout[]): WorkoutsByMonth[] {
  const monthNames = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];

  const grouped = new Map<string, WorkoutsByMonth>();

  workouts.forEach((workout) => {
    const date = new Date(workout.startTime);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const key = `${year}-${date.getMonth()}`;

    if (!grouped.has(key)) {
      grouped.set(key, { month, year, workouts: [] });
    }

    grouped.get(key)!.workouts.push(workout);
  });

  // Sort by year and month (most recent first)
  return Array.from(grouped.values()).sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year;
    }
    const monthA = monthNames.indexOf(a.month);
    const monthB = monthNames.indexOf(b.month);
    return monthB - monthA;
  });
}

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

  const groupedWorkouts = groupWorkoutsByMonth(workouts);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Workout Verlauf
        </h1>

        {groupedWorkouts.map((group) => (
          <MonthSection
            key={`${group.year}-${group.month}`}
            month={group.month}
            year={group.year}
            workoutCount={group.workouts.length}
          >
            {group.workouts.map((workout) => (
              <WorkoutHistoryCard
                key={workout.id}
                workout={workout}
                onClick={() => setSelectedWorkout(workout)}
              />
            ))}
          </MonthSection>
        ))}
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
