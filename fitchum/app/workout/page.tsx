'use client';

import { useState, useEffect } from 'react';
import { useWorkout } from './hooks/useWorkout';
import { getWorkoutTemplates, deleteTemplate, saveTemplate } from '@/lib/localStorage';
import WorkoutStartScreen from './components/WorkoutStartScreen';
import ActiveWorkoutView from './components/ActiveWorkoutView';
import TemplateCreationView from './components/TemplateCreationView';
import AutoCompleteNotification from './components/AutoCompleteNotification';
import WorkoutSummary from './components/WorkoutSummary';
import type { WorkoutTemplate, Workout, Exercise } from '@/types/workout.types';

type ViewMode = 'start' | 'active' | 'summary' | 'template-creation';

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

  // Template creation state
  const [templateExercises, setTemplateExercises] = useState<Exercise[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

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

  // Template creation handlers
  const handleCreateTemplate = () => {
    setTemplateExercises([]);
    setTemplateName('');
    setViewMode('template-creation');
  };

  const handleAddTemplateExercise = (name: string) => {
    const newExercise: Exercise = {
      id: `exercise-${Date.now()}`,
      name,
      sets: [
        {
          id: `set-${Date.now()}`,
          setNumber: 1,
          previousReps: null,
          previousWeight: null,
          currentReps: 0,
          currentWeight: 0,
          completed: false,
        },
      ],
    };
    setTemplateExercises([...templateExercises, newExercise]);
  };

  const handleUpdateTemplateExercise = (exerciseId: string, exercise: Exercise) => {
    setTemplateExercises(
      templateExercises.map((ex) => (ex.id === exerciseId ? exercise : ex))
    );
  };

  const handleDeleteTemplateExercise = (exerciseId: string) => {
    setTemplateExercises(templateExercises.filter((ex) => ex.id !== exerciseId));
  };

  const handleSaveTemplate = () => {
    if (templateExercises.length === 0 || templateName.trim() === '') return;

    const newTemplate: WorkoutTemplate = {
      id: editingTemplateId || `template-${Date.now()}`,
      name: templateName.trim(),
      exercises: templateExercises.map((ex) => ({
        name: ex.name,
        defaultSets: ex.sets.length,
      })),
      createdAt: editingTemplateId
        ? templates.find((t) => t.id === editingTemplateId)?.createdAt || Date.now()
        : Date.now(),
    };

    saveTemplate(newTemplate);
    setTemplates(getWorkoutTemplates());
    setTemplateExercises([]);
    setTemplateName('');
    setEditingTemplateId(null);
    setViewMode('start');
  };

  const handleCancelTemplateCreation = () => {
    setTemplateExercises([]);
    setTemplateName('');
    setEditingTemplateId(null);
    setViewMode('start');
  };

  const handleRenameTemplate = (templateId: string, newName: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const updatedTemplate: WorkoutTemplate = {
      ...template,
      name: newName,
    };

    saveTemplate(updatedTemplate);
    setTemplates(getWorkoutTemplates());
  };

  const handleEditTemplate = (template: WorkoutTemplate) => {
    // Convert template exercises to full Exercise objects
    const exercises: Exercise[] = template.exercises.map((ex, index) => ({
      id: `exercise-${Date.now()}-${index}`,
      name: ex.name,
      sets: Array.from({ length: ex.defaultSets }, (_, setIndex) => ({
        id: `set-${Date.now()}-${index}-${setIndex}`,
        setNumber: setIndex + 1,
        previousReps: null,
        previousWeight: null,
        currentReps: 0,
        currentWeight: 0,
        completed: false,
      })),
    }));

    setTemplateExercises(exercises);
    setTemplateName(template.name);
    setEditingTemplateId(template.id);
    setViewMode('template-creation');
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

  if (viewMode === 'template-creation') {
    return (
      <TemplateCreationView
        exercises={templateExercises}
        templateName={templateName}
        onAddExercise={handleAddTemplateExercise}
        onUpdateExercise={handleUpdateTemplateExercise}
        onDeleteExercise={handleDeleteTemplateExercise}
        onSaveTemplate={handleSaveTemplate}
        onCancel={handleCancelTemplateCreation}
        onNameChange={setTemplateName}
        isEditMode={editingTemplateId !== null}
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
      onCreateTemplate={handleCreateTemplate}
      onRenameTemplate={handleRenameTemplate}
      onEditTemplate={handleEditTemplate}
    />
  );
}
