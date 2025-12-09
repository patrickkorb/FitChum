'use client';

import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import TemplateCard from './TemplateCard';
import type { WorkoutTemplate } from '@/types/workout.types';

interface TemplateSelectorProps {
  templates: WorkoutTemplate[];
  onSelectTemplate: (template: WorkoutTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onBack: () => void;
}

export default function TemplateSelector({
  templates,
  onSelectTemplate,
  onDeleteTemplate,
  onBack,
}: TemplateSelectorProps) {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Zurück
        </Button>

        <h1 className="text-2xl font-bold text-foreground mb-6">
          Template auswählen
        </h1>

        {templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Keine Templates vorhanden
            </p>
            <p className="text-sm text-muted-foreground">
              Erstelle ein Workout und speichere es als Template
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
