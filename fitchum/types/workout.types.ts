// Core workout tracking types

export interface Set {
  id: string;
  setNumber: number;
  previousReps: number | null;
  previousWeight: number | null;
  currentReps: number;
  currentWeight: number;
  completed: boolean;
  completedAt?: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  startTime: number;
  exercises: Exercise[];
  templateId?: string;
  completedAt?: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: {
    name: string;
    defaultSets: number;
  }[];
  createdAt: number;
}

export interface RestTimerState {
  active: boolean;
  startTime: number;
  duration: number;
  exerciseId?: string;
  setNumber?: number;
}

export interface WorkoutStorage {
  activeWorkout: Workout | null;
  workoutHistory: Workout[];
  workoutTemplates: WorkoutTemplate[];
  restTimer: RestTimerState;
}

export interface PreviousSetData {
  reps: number;
  weight: number;
}
