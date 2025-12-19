'use client';

import { useState, useEffect } from 'react';
import { useWorkout } from './hooks/useWorkout';
import { getWorkoutTemplates, deleteTemplate } from '@/lib/localStorage';
import WorkoutStartScreen from './components/WorkoutStartScreen';
import ActiveWorkoutView from './components/ActiveWorkoutView';
import AutoCompleteNotification from './components/AutoCompleteNotification';
import WorkoutSummary from './components/WorkoutSummary';
import type { WorkoutTemplate, Workout } from '@/types/workout.types';

type ViewMode = 'start' | 'active' | 'summary';

export default function WorkoutPage() {
  const {
    workout,
    isStarted,
    wasAutoCompleted,
    startWorkout,
    addExercise,
    updateExercise,
    deleteExercise,
    completeWorkout,
    cancelWorkout,
    saveAsTemplate,
    dismissAutoCompleteNotification,
  } = useWorkout();

  const [viewMode, setViewMode] = useState<ViewMode>('start');
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [completedWorkout, setCompletedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    setTemplates(getWorkoutTemplates());
  }, []);

  const handleStartEmpty = () => {
    startWorkout();
    setViewMode('active');
  };

  const handleTemplateSelected = (template: WorkoutTemplate) => {
    startWorkout(template);
    setViewMode('active');
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
    setTemplates(getWorkoutTemplates());
  };

  const handleCompleteWorkout = () => {
    if (workout) {
      setCompletedWorkout(workout);
      completeWorkout();
      setViewMode('summary');
    }
  };

  const handleCancelWorkout = () => {
    cancelWorkout();
    setTemplates(getWorkoutTemplates());
    setViewMode('start');
  };

  const handleCloseSummary = () => {
    setCompletedWorkout(null);
    setTemplates(getWorkoutTemplates());
    setViewMode('start');
  };

  if (wasAutoCompleted) {
    return (
      <AutoCompleteNotification onDismiss={dismissAutoCompleteNotification} />
    );
  }

  if (viewMode === 'summary' && completedWorkout) {
    return (
      <WorkoutSummary
        workout={completedWorkout}
        onClose={handleCloseSummary}
      />
    );
  }

  if (isStarted && workout) {
    return (
      <ActiveWorkoutView
        workout={workout}
        onAddExercise={addExercise}
        onUpdateExercise={updateExercise}
        onDeleteExercise={deleteExercise}
        onCompleteWorkout={handleCompleteWorkout}
        onCancelWorkout={handleCancelWorkout}
      />
    );
  }

  return (
    <WorkoutStartScreen
      onStartEmpty={handleStartEmpty}
      templates={templates}
      onSelectTemplate={handleTemplateSelected}
      onDeleteTemplate={handleDeleteTemplate}
    />
  );
}
