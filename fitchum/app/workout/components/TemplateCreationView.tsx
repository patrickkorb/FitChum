'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import ExerciseCard from './ExerciseCard';
import AddExerciseDialog from './AddExerciseDialog';
import type { Exercise } from '@/types/workout.types';
import { useNavbar } from '@/app/contexts/NavbarContext';

interface TemplateCreationViewProps {
  exercises: Exercise[];
  templateName: string;
  onAddExercise: (name: string) => void;
  onUpdateExercise: (exerciseId: string, exercise: Exercise) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onSaveTemplate: () => void;
  onCancel: () => void;
  onNameChange: (name: string) => void;
  isEditMode?: boolean;
}

export default function TemplateCreationView({
  exercises,
  templateName,
  onAddExercise,
  onUpdateExercise,
  onDeleteExercise,
  onSaveTemplate,
  onCancel,
  onNameChange,
  isEditMode = false,
}: TemplateCreationViewProps) {
  const [showAddExercise, setShowAddExercise] = useState(false);
  const { setNavbarVisible } = useNavbar();

  useEffect(() => {
    setNavbarVisible(false);

    return () => {
      setNavbarVisible(true);
    };
  }, [setNavbarVisible]);

  const handleExerciseUpdate = (exerciseId: string, exercise: Exercise) => {
    onUpdateExercise(exerciseId, exercise);
  };

  const canSave = exercises.length > 0 && templateName.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 pb-20">
        <div className="mb-6 sticky top-0 bg-background z-10 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {isEditMode ? 'Template bearbeiten' : 'Template erstellen'}
          </h1>
          <input
            type="text"
            value={templateName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Template Name"
            className="w-full px-4 py-3 bg-muted text-foreground rounded-lg border border-muted-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {exercises.length === 0 ? (
          <div className="text-center pb-12">
            <p className="text-muted-foreground mb-4">
              Keine Übungen hinzugefügt
            </p>
            <Button onClick={() => setShowAddExercise(true)} className="flex flex-row justify-center items-center gap-2 w-full">
              <Plus size={18} />
              Erste Übung hinzufügen
            </Button>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onUpdate={(updated) => handleExerciseUpdate(exercise.id, updated)}
                onDelete={() => onDeleteExercise(exercise.id)}
              />
            ))}
          </div>
        )}

        {exercises.length > 0 && (
          <Button
            onClick={() => setShowAddExercise(true)}
            variant="outline"
            className="w-full mb-6"
          >
            Übung hinzufügen
          </Button>
        )}

        {/* Template Controls */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-muted-foreground/20 p-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4">
            <Button
              onClick={onCancel}
              variant="ghost"
              size="sm"
              className="w-full"
            >
              Abbrechen
            </Button>
            <Button
              onClick={onSaveTemplate}
              variant="ghost"
              size="sm"
              className="w-full"
              disabled={!canSave}
            >
              Speichern
            </Button>
          </div>
        </div>
      </div>

      {showAddExercise && (
        <AddExerciseDialog
          onAdd={onAddExercise}
          onClose={() => setShowAddExercise(false)}
        />
      )}
    </div>
  );
}
