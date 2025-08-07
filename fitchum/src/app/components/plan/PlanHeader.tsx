"use client"
import Button from '../ui/Button';
import { Edit3, Target } from 'lucide-react';

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Plan Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <Target className="text-primary" size={24} />
          <h1 className="text-2xl sm:text-4xl font-bold text-neutral-dark dark:text-neutral-light">
            Dein Trainingsplan
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-sm sm:text-base text-neutral-dark/70 dark:text-neutral-light/70">
          <span className="flex items-center gap-2">
            <span className="font-medium text-primary">{planData.workoutSplit}</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>{planData.frequency}</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{planData.schedule}</span>
        </div>
        {/* Mobile schedule on new line */}
        <div className="sm:hidden text-sm text-neutral-dark/70 dark:text-neutral-light/70">
          {planData.schedule}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full sm:w-auto">
        <Button variant="outline" onClick={onEditPlan} className="flex-1 sm:flex-none" size="md">
          <Edit3 size={18} />
          <span className="hidden sm:inline">Plan anpassen</span>
          <span className="sm:hidden">Bearbeiten</span>
        </Button>
      </div>
    </div>
  );
}