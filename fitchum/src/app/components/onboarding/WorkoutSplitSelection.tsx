"use client"
import { useState } from 'react';
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
    id: 'push-pull-legs',
    name: 'Push/Pull/Legs',
    description: 'Split nach Bewegungsmustern',
    example: 'Push: Brust, Schultern, Trizeps | Pull: Rücken, Bizeps | Legs: Beine, Po',
    icon: 'Dumbbell'
  },
  {
    id: 'upper-lower',
    name: 'Upper/Lower',
    description: 'Oberkörper und Unterkörper getrennt',
    example: 'Upper: Brust, Rücken, Schultern, Arme | Lower: Beine, Po, Waden',
    icon: 'Target'
  },
  {
    id: 'fullbody',
    name: 'Fullbody',
    description: 'Ganzkörpertraining in jeder Einheit',
    example: 'Alle Muskelgruppen in jedem Training',
    icon: 'Zap'
  },
  {
    id: 'bro-split',
    name: 'Bro Split',
    description: 'Eine Muskelgruppe pro Tag',
    example: 'Montag: Brust | Dienstag: Rücken | Mittwoch: Beine | etc.',
    icon: 'Dumbbell'
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
          Welchen Workout Split bevorzugst du?
        </h2>
        <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-lg">
          Wähle den Split, der am besten zu deinem Trainingsplan passt
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workoutSplits.map((split) => {
          const Icon = iconMap[split.icon as keyof typeof iconMap];
          const isSelected = selectedSplit?.id === split.id;
          
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