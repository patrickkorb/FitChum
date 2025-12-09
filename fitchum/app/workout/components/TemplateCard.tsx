'use client';

import { FileText, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { WorkoutTemplate } from '@/types/workout.types';

interface TemplateCardProps {
  template: WorkoutTemplate;
  onSelect: () => void;
  onDelete: () => void;
}

export default function TemplateCard({
  template,
  onSelect,
  onDelete,
}: TemplateCardProps) {
  return (
    <Card className="cursor-pointer hover:border-primary transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          <h3
            className="font-semibold text-foreground"
            onClick={onSelect}
          >
            {template.name}
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
          aria-label={`Delete ${template.name} template`}
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-1" onClick={onSelect}>
        {template.exercises.map((ex, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{ex.name}</span>
            <Badge variant="muted">{ex.defaultSets} Sets</Badge>
          </div>
        ))}
      </div>

      {template.exercises.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          Keine Übungen
        </p>
      )}
    </Card>
  );
}
