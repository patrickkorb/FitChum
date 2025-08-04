"use client"
import Button from '../ui/Button';
import { Settings, Edit3, Target } from 'lucide-react';

interface PlanHeaderProps {
  planData: {
    workoutSplit: string;
    frequency: string;
    schedule: string;
  };
  onEditPlan: () => void;
}

export default function PlanHeader({ planData, onEditPlan }: PlanHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      {/* Plan Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Target className="text-primary" size={32} />
          <h1 className="text-4xl font-bold text-neutral-dark dark:text-neutral-light">
            Dein Trainingsplan
          </h1>
        </div>
        <div className="flex flex-wrap gap-4 text-neutral-dark/70 dark:text-neutral-light/70">
          <span className="flex items-center gap-2">
            <span className="font-medium text-primary">{planData.workoutSplit}</span>
          </span>
          <span>•</span>
          <span>{planData.frequency}</span>
          <span>•</span>
          <span>{planData.schedule}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onEditPlan}>
          <Edit3 size={20} />
          Plan anpassen
        </Button>
      </div>
    </div>
  );
}