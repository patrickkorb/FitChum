'use client';

import { Dumbbell, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';

interface WorkoutStartScreenProps {
  onStartEmpty: () => void;
  onSelectTemplate: () => void;
}

export default function WorkoutStartScreen({
  onStartEmpty,
  onSelectTemplate,
}: WorkoutStartScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-start justify-center p-4 pt-16">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Dumbbell size={64} className="mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Neues Workout
          </h1>
          <p className="text-muted-foreground">
            Starte ein leeres Workout oder wähle ein Template
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onStartEmpty}
            variant="primary"
            size="lg"
            className="w-full flex flex-row justify-center items-center gap-2"
          >
            Leeres Workout starten
          </Button>

          <Button
            onClick={onSelectTemplate}
            variant="outline"
            size="lg"
            className="w-full flex flex-row justify-center items-center gap-2"
          >
            Template starten
          </Button>
        </div>
      </div>
    </div>
  );
}
