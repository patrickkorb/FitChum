'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Workout, Exercise, WorkoutTemplate } from '@/types/workout.types';
import {
  getWorkoutStorage,
  saveActiveWorkout,
  completeWorkout,
  saveTemplate,
  deleteOldWorkouts,
} from '@/lib/localStorage';
import {
  createEmptyWorkout,
  createWorkoutFromTemplate,
  createEmptyExercise,
  createTemplateFromWorkout,
  isWorkoutExpired,
} from '@/lib/workoutUtils';
import { useWorkoutPersistence } from './useWorkoutPersistence';

export function useWorkout() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [wasAutoCompleted, setWasAutoCompleted] = useState(false);

  useWorkoutPersistence(workout);

  useEffect(() => {
    const storage = getWorkoutStorage();

    if (storage.activeWorkout) {
      if (isWorkoutExpired(storage.activeWorkout.startTime)) {
        deleteOldWorkouts();
        setWasAutoCompleted(true);
        setWorkout(null);
        setIsStarted(false);
      } else {
        setWorkout(storage.activeWorkout);
        setIsStarted(true);
      }
    }
  }, []);

  const startWorkout = useCallback((template?: WorkoutTemplate) => {
    const newWorkout = template
      ? createWorkoutFromTemplate(template)
      : createEmptyWorkout();

    setWorkout(newWorkout);
    setIsStarted(true);
    saveActiveWorkout(newWorkout);
  }, []);

  const addExercise = useCallback(
    (name: string) => {
      if (!workout) return;

      const newExercise = createEmptyExercise(name);
      const updatedWorkout: Workout = {
        ...workout,
        exercises: [...workout.exercises, newExercise],
      };

      setWorkout(updatedWorkout);
    },
    [workout]
  );

  const updateExercise = useCallback(
    (exerciseId: string, updatedExercise: Exercise) => {
      if (!workout) return;

      const updatedWorkout: Workout = {
        ...workout,
        exercises: workout.exercises.map((ex) =>
          ex.id === exerciseId ? updatedExercise : ex
        ),
      };

      setWorkout(updatedWorkout);
    },
    [workout]
  );

  const deleteExercise = useCallback(
    (exerciseId: string) => {
      if (!workout) return;

      const updatedWorkout: Workout = {
        ...workout,
        exercises: workout.exercises.filter((ex) => ex.id !== exerciseId),
      };

      setWorkout(updatedWorkout);
    },
    [workout]
  );

  const completeCurrentWorkout = useCallback(() => {
    if (!workout) return;

    completeWorkout(workout);
    setWorkout(null);
    setIsStarted(false);
  }, [workout]);

  const cancelWorkout = useCallback(() => {
    if (!workout) return;

    saveActiveWorkout(null);
    setWorkout(null);
    setIsStarted(false);
  }, [workout]);

  const saveAsWorkoutTemplate = useCallback(
    (name: string) => {
      if (!workout) return;

      const template = createTemplateFromWorkout(workout, name);
      saveTemplate(template);
    },
    [workout]
  );

  const dismissAutoCompleteNotification = useCallback(() => {
    setWasAutoCompleted(false);
  }, []);

  return {
    workout,
    isStarted,
    wasAutoCompleted,
    startWorkout,
    addExercise,
    updateExercise,
    deleteExercise,
    completeWorkout: completeCurrentWorkout,
    cancelWorkout,
    saveAsTemplate: saveAsWorkoutTemplate,
    dismissAutoCompleteNotification,
  };
}
