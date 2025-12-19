'use client';

import { Dumbbell, Plus, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import TemplateCard from './TemplateCard';
import type { WorkoutTemplate } from '@/types/workout.types';

interface WorkoutStartScreenProps {
  onStartEmpty: () => void;
  templates: WorkoutTemplate[];
  onSelectTemplate: (template: WorkoutTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onCreateTemplate: () => void;
  onRenameTemplate: (templateId: string, newName: string) => void;
  onEditTemplate: (template: WorkoutTemplate) => void;
}

export default function WorkoutStartScreen({
  onStartEmpty,
  templates,
  onSelectTemplate,
  onDeleteTemplate,
  onCreateTemplate,
  onRenameTemplate,
  onEditTemplate,
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

        {/* Templates Section */}
        <div className="mt-12 pt-8 border-t border-muted-foreground/20">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Deine Vorlagen
          </h2>

          {templates.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-6">
                Noch keine Vorlagen erstellt
              </p>
              <Button
                onClick={onCreateTemplate}
                variant="primary"
                className="flex flex-row justify-center items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                Erstelle dein erstes Template
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={() => onSelectTemplate(template)}
                    onDelete={() => onDeleteTemplate(template.id)}
                    onRename={(newName) => onRenameTemplate(template.id, newName)}
                    onEdit={() => onEditTemplate(template)}
                  />
                ))}
              </div>
              <Button
                onClick={onCreateTemplate}
                variant="outline"
                className="w-full flex flex-row justify-center items-center gap-2"
              >
                <Plus size={18} />
                Neues Template erstellen
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
