'use client';

import { useEffect, useRef } from 'react';
import type { Workout } from '@/types/workout.types';
import { saveActiveWorkout } from '@/lib/localStorage';

export function useWorkoutPersistence(workout: Workout | null) {
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const periodicSaveRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!workout) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveActiveWorkout(workout);
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [workout]);

  useEffect(() => {
    if (!workout) return;

    periodicSaveRef.current = setInterval(() => {
      saveActiveWorkout(workout);
    }, 30000);

    return () => {
      if (periodicSaveRef.current) {
        clearInterval(periodicSaveRef.current);
      }
    };
  }, [workout]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (workout) {
        saveActiveWorkout(workout);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [workout]);
}
