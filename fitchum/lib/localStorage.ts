import type {
  Workout,
  WorkoutStorage,
  WorkoutTemplate,
  RestTimerState,
  PreviousSetData,
} from '@/types/workout.types';

const STORAGE_KEY = 'fitchum_workout_storage';

const defaultStorage: WorkoutStorage = {
  activeWorkout: null,
  workoutHistory: [],
  workoutTemplates: [],
  restTimer: {
    active: false,
    startTime: 0,
    duration: 150,
  },
};

export function getWorkoutStorage(): WorkoutStorage {
  try {
    if (typeof window === 'undefined') return defaultStorage;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultStorage;

    const parsed = JSON.parse(stored);
    return { ...defaultStorage, ...parsed };
  } catch (error) {
    console.error('Error reading workout storage:', error);
    return defaultStorage;
  }
}

export function saveWorkoutStorage(storage: WorkoutStorage): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Error saving workout storage:', error);
  }
}

export function saveActiveWorkout(workout: Workout | null): void {
  try {
    const storage = getWorkoutStorage();
    storage.activeWorkout = workout;
    saveWorkoutStorage(storage);
  } catch (error) {
    console.error('Error saving active workout:', error);
  }
}

export function completeWorkout(workout: Workout): void {
  try {
    const storage = getWorkoutStorage();

    const completedWorkout: Workout = {
      ...workout,
      completedAt: Date.now(),
    };

    storage.workoutHistory.unshift(completedWorkout);
    storage.activeWorkout = null;

    saveWorkoutStorage(storage);
  } catch (error) {
    console.error('Error completing workout:', error);
  }
}

export function saveTemplate(template: WorkoutTemplate): void {
  try {
    const storage = getWorkoutStorage();

    const existingIndex = storage.workoutTemplates.findIndex(
      (t) => t.id === template.id
    );

    if (existingIndex >= 0) {
      storage.workoutTemplates[existingIndex] = template;
    } else {
      storage.workoutTemplates.push(template);
    }

    saveWorkoutStorage(storage);
  } catch (error) {
    console.error('Error saving template:', error);
  }
}

export function deleteTemplate(templateId: string): void {
  try {
    const storage = getWorkoutStorage();
    storage.workoutTemplates = storage.workoutTemplates.filter(
      (t) => t.id !== templateId
    );
    saveWorkoutStorage(storage);
  } catch (error) {
    console.error('Error deleting template:', error);
  }
}

export function getWorkoutHistory(): Workout[] {
  try {
    const storage = getWorkoutStorage();
    return storage.workoutHistory;
  } catch (error) {
    console.error('Error getting workout history:', error);
    return [];
  }
}

export function getWorkoutTemplates(): WorkoutTemplate[] {
  try {
    const storage = getWorkoutStorage();
    return storage.workoutTemplates;
  } catch (error) {
    console.error('Error getting templates:', error);
    return [];
  }
}

export function saveRestTimer(restTimer: RestTimerState): void {
  try {
    const storage = getWorkoutStorage();
    storage.restTimer = restTimer;
    saveWorkoutStorage(storage);
  } catch (error) {
    console.error('Error saving rest timer:', error);
  }
}

export function getRestTimer(): RestTimerState {
  try {
    const storage = getWorkoutStorage();
    return storage.restTimer;
  } catch (error) {
    console.error('Error getting rest timer:', error);
    return {
      active: false,
      startTime: 0,
      duration: 150,
    };
  }
}

export function deleteOldWorkouts(): void {
  try {
    const storage = getWorkoutStorage();
    const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000;

    if (storage.activeWorkout && storage.activeWorkout.startTime < sixHoursAgo) {
      completeWorkout({
        ...storage.activeWorkout,
        completedAt: storage.activeWorkout.startTime + 6 * 60 * 60 * 1000,
      });
    }
  } catch (error) {
    console.error('Error deleting old workouts:', error);
  }
}

export function getPreviousExerciseData(
  exerciseName: string,
  setNumber: number
): PreviousSetData | null {
  try {
    const history = getWorkoutHistory();

    for (const workout of history) {
      const exercise = workout.exercises.find(
        (ex) => ex.name === exerciseName
      );

      if (exercise) {
        const set = exercise.sets.find((s) => s.setNumber === setNumber);
        if (set && set.currentReps > 0) {
          return {
            reps: set.currentReps,
            weight: set.currentWeight,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting previous exercise data:', error);
    return null;
  }
}

export function clearAllWorkoutData(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing workout data:', error);
  }
}
