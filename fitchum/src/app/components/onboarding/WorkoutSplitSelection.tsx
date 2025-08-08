"use client"
import Card from '../ui/Card';
import { Dumbbell, Target, Zap } from 'lucide-react';

export interface WorkoutSplit {
  id: string;
  name: string;
  description: string;
  example: string;
  icon: string;
}

interface WorkoutSplitSelectionProps {
  onSelect: (split: WorkoutSplit) => void;
  selectedSplit?: WorkoutSplit;
}

const workoutSplits: WorkoutSplit[] = [
  {
    id: 'ppl',
    name: 'Push/Pull/Legs',
    description: 'Classic split by movement patterns',
    example: 'Push: Chest, Shoulders, Triceps | Pull: Back, Biceps | Legs: Quads, Glutes, Hams',
    icon: 'Dumbbell'
  },
  {
    id: 'upper_lower',
    name: 'Upper/Lower',
    description: 'Upper and lower body separated',
    example: 'Upper: Chest, Back, Shoulders, Arms | Lower: Legs, Glutes, Calves',
    icon: 'Target'
  },
  {
    id: 'full_body',
    name: 'Full Body',
    description: 'Complete body workout each session',
    example: 'All muscle groups trained every workout',
    icon: 'Zap'
  },
  {
    id: 'ppl_arnold',
    name: 'PPL x Arnold',
    description: 'Arnold-style chest/back combo with PPL',
    example: 'Chest&Back | Shoulders&Arms | Legs | Repeat',
    icon: 'Dumbbell'
  },
  {
    id: 'ppl_ul',
    name: 'PPL x Upper/Lower',
    description: 'Hybrid of PPL and Upper/Lower splits',
    example: 'Push | Pull | Legs | Upper | Lower',
    icon: 'Target'
  }
];

const iconMap = {
  Dumbbell,
  Target,
  Zap
};

export default function WorkoutSplitSelection({ onSelect, selectedSplit }: WorkoutSplitSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-neutral-dark dark:text-neutral-light">
          Choose Your Workout Split
        </h2>
        <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-lg">
          Select the training split that best fits your goals and schedule
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workoutSplits.map((split: WorkoutSplit) => {
          const Icon: React.ComponentType<{ size?: number }> = iconMap[split.icon as keyof typeof iconMap];
          const isSelected: boolean = selectedSplit?.id === split.id;
          
          return (
            <Card
              key={split.id}
              selected={isSelected}
              onClick={() => onSelect(split)}
              className="text-left"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${isSelected ? 'bg-primary text-white' : 'bg-neutral-dark/10 dark:bg-neutral-light/10'}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-neutral-dark dark:text-neutral-light mb-2">
                    {split.name}
                  </h3>
                  <p className="text-neutral-dark/70 dark:text-neutral-light/70 mb-3">
                    {split.description}
                  </p>
                  <p className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
                    {split.example}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}