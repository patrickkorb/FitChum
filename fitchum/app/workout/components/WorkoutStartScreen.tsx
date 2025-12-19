'use client';

import { Dumbbell } from 'lucide-react';
import Button from '@/components/ui/Button';
import TemplateCard from './TemplateCard';
import type { WorkoutTemplate } from '@/types/workout.types';

interface WorkoutStartScreenProps {
  onStartEmpty: () => void;
  templates: WorkoutTemplate[];
  onSelectTemplate: (template: WorkoutTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export default function WorkoutStartScreen({
  onStartEmpty,
  templates,
  onSelectTemplate,
  onDeleteTemplate,
}: WorkoutStartScreenProps) {
  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <Dumbbell size={64} className="mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Neues Workout
          </h1>
          <p className="text-muted-foreground">
            Starte ein leeres Workout oder wähle eine Vorlage
          </p>
        </div>

        <div className="mb-8">
          <Button
            onClick={onStartEmpty}
            variant="primary"
            size="lg"
            className="w-full flex flex-row justify-center items-center gap-2"
          >
            Leeres Workout starten
          </Button>
        </div>

        {templates.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Deine Vorlagen
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => onSelectTemplate(template)}
                  onDelete={() => onDeleteTemplate(template.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
