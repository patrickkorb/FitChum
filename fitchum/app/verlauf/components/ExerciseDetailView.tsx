'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import type { Exercise } from '@/types/workout.types';

interface ExerciseDetailViewProps {
  exercise: Exercise;
}

export default function ExerciseDetailView({
  exercise,
}: ExerciseDetailViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedSets = exercise.sets.filter((s) => s.completed).length;

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex-1 text-left">
          <h4 className="font-semibold text-foreground">{exercise.name}</h4>
          <p className="text-sm text-muted-foreground">
            {completedSets} / {exercise.sets.length} Sets
          </p>
        </div>

        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-2 py-3 space-y-2">
          {exercise.sets.map((set) => (
            <div
              key={set.id}
              className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                set.completed
                  ? 'bg-success/20 border border-success/50'
                  : 'bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground min-w-[3rem]">
                  Set {set.setNumber}
                </span>
                <span className="text-sm text-foreground font-medium">
                  {set.currentReps} × {set.currentWeight} kg
                </span>
              </div>

              {set.completed && (
                <Check className="w-5 h-5 text-success" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
