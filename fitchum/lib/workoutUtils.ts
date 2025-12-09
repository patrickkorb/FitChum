import type {
  Workout,
  Exercise,
  Set,
  WorkoutTemplate,
} from '@/types/workout.types';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createEmptyWorkout(): Workout {
  return {
    id: generateId(),
    startTime: Date.now(),
    exercises: [],
  };
}

export function createWorkoutFromTemplate(
  template: WorkoutTemplate
): Workout {
  const exercises: Exercise[] = template.exercises.map((templateEx) => ({
    id: generateId(),
    name: templateEx.name,
    sets: Array.from({ length: templateEx.defaultSets }, (_, index) =>
      createEmptySet(index + 1)
    ),
  }));

  return {
    id: generateId(),
    startTime: Date.now(),
    exercises,
    templateId: template.id,
  };
}

export function createEmptyExercise(name: string): Exercise {
  return {
    id: generateId(),
    name,
    sets: [createEmptySet(1)],
  };
}

export function createEmptySet(setNumber: number): Set {
  return {
    id: generateId(),
    setNumber,
    previousReps: null,
    previousWeight: null,
    currentReps: 0,
    currentWeight: 0,
    completed: false,
  };
}

export function addSetToExercise(exercise: Exercise): Exercise {
  const newSetNumber = exercise.sets.length + 1;
  const newSet = createEmptySet(newSetNumber);

  return {
    ...exercise,
    sets: [...exercise.sets, newSet],
  };
}

export function removeSetFromExercise(
  exercise: Exercise,
  setId: string
): Exercise {
  const filteredSets = exercise.sets.filter((set) => set.id !== setId);

  const reNumberedSets = filteredSets.map((set, index) => ({
    ...set,
    setNumber: index + 1,
  }));

  return {
    ...exercise,
    sets: reNumberedSets,
  };
}

export function updateSetInExercise(
  exercise: Exercise,
  setId: string,
  updates: Partial<Set>
): Exercise {
  return {
    ...exercise,
    sets: exercise.sets.map((set) =>
      set.id === setId ? { ...set, ...updates } : set
    ),
  };
}

export function createTemplateFromWorkout(
  workout: Workout,
  name: string
): WorkoutTemplate {
  return {
    id: generateId(),
    name,
    exercises: workout.exercises.map((ex) => ({
      name: ex.name,
      defaultSets: ex.sets.length,
    })),
    createdAt: Date.now(),
  };
}

export function formatElapsedTime(startTime: number): string {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function isWorkoutExpired(startTime: number): boolean {
  const sixHours = 6 * 60 * 60 * 1000;
  return Date.now() - startTime > sixHours;
}

export function formatPreviousData(
  reps: number | null,
  weight: number | null
): string {
  if (reps === null || weight === null) return '-';
  return `${reps} x ${weight}kg`;
}

export function validateNumberInput(value: string): number {
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0) return 0;
  return Math.max(0, parsed);
}
