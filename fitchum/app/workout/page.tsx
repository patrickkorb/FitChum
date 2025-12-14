'use client';

import { useState } from 'react';
import { useWorkout } from './hooks/useWorkout';
import { getWorkoutTemplates, deleteTemplate } from '@/lib/localStorage';
import WorkoutStartScreen from './components/WorkoutStartScreen';
import ActiveWorkoutView from './components/ActiveWorkoutView';
import TemplateSelector from './components/TemplateSelector';
import AutoCompleteNotification from './components/AutoCompleteNotification';
import WorkoutSummary from './components/WorkoutSummary';
import type { WorkoutTemplate, Workout } from '@/types/workout.types';

type ViewMode = 'start' | 'template-select' | 'active' | 'summary';

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
    saveAsTemplate,
    dismissAutoCompleteNotification,
  } = useWorkout();

  const [viewMode, setViewMode] = useState<ViewMode>('start');
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [completedWorkout, setCompletedWorkout] = useState<Workout | null>(null);

  const handleStartEmpty = () => {
    startWorkout();
    setViewMode('active');
  };

  const handleSelectTemplate = () => {
    setTemplates(getWorkoutTemplates());
    setViewMode('template-select');
  };

  const handleTemplateSelected = (template: WorkoutTemplate) => {
    startWorkout(template);
    setViewMode('active');
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
    setTemplates(getWorkoutTemplates());
  };

  const handleBackToStart = () => {
    setViewMode('start');
  };

  const handleCompleteWorkout = () => {
    if (workout) {
      setCompletedWorkout(workout);
      completeWorkout();
      setViewMode('summary');
    }
  };

  const handleCloseSummary = () => {
    setCompletedWorkout(null);
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
        onSaveTemplate={saveAsTemplate}
        onCompleteWorkout={handleCompleteWorkout}
      />
    );
  }

  if (viewMode === 'template-select') {
    return (
      <TemplateSelector
        templates={templates}
        onSelectTemplate={handleTemplateSelected}
        onDeleteTemplate={handleDeleteTemplate}
        onBack={handleBackToStart}
      />
    );
  }

  return (
    <WorkoutStartScreen
      onStartEmpty={handleStartEmpty}
      onSelectTemplate={handleSelectTemplate}
    />
  );
}
