'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface AddExerciseDialogProps {
  onAdd: (name: string) => void;
  onClose: () => void;
}

export default function AddExerciseDialog({
  onAdd,
  onClose,
}: AddExerciseDialogProps) {
  const [exerciseName, setExerciseName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exerciseName.trim()) {
      onAdd(exerciseName.trim());
      setExerciseName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Übung hinzufügen
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="z.B. Bench Press"
            autoFocus
            label="Übungsname"
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={!exerciseName.trim()}
              className="flex-1 flex flex-row justify-center items-center"
            >
              <Plus size={18} className="mr-1" />
              Hinzufügen
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
