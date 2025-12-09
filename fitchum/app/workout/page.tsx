'use client';

import { useState } from 'react';
import { useWorkout } from './hooks/useWorkout';
import { getWorkoutTemplates, deleteTemplate } from '@/lib/localStorage';
import WorkoutStartScreen from './components/WorkoutStartScreen';
import ActiveWorkoutView from './components/ActiveWorkoutView';
import TemplateSelector from './components/TemplateSelector';
import AutoCompleteNotification from './components/AutoCompleteNotification';
import type { WorkoutTemplate } from '@/types/workout.types';

type ViewMode = 'start' | 'template-select' | 'active';

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

  if (wasAutoCompleted) {
    return (
      <AutoCompleteNotification onDismiss={dismissAutoCompleteNotification} />
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
        onCompleteWorkout={completeWorkout}
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
