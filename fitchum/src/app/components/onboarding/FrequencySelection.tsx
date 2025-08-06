"use client"
import Card from '../ui/Card';
import { Calendar, Clock, Flame } from 'lucide-react';

export interface WorkoutFrequency {
  id: string;
  days: number;
  title: string;
  description: string;
  recommendation: string;
  icon: string;
}

interface FrequencySelectionProps {
  onSelect: (frequency: WorkoutFrequency) => void;
  selectedFrequency?: WorkoutFrequency;
}

const frequencies: WorkoutFrequency[] = [
  {
    id: '2-days',
    days: 2,
    title: '2x pro Woche',
    description: 'Entspannt starten',
    recommendation: 'Perfekt für Anfänger oder bei wenig Zeit',
    icon: 'Calendar'
  },
  {
    id: '3-days',
    days: 3,
    title: '3x pro Woche',
    description: 'Ausgewogenes Training',
    recommendation: 'Ideal für die meisten Trainingsziele',
    icon: 'Clock'
  },
  {
    id: '4-days',
    days: 4,
    title: '4x pro Woche',
    description: 'Intensives Training',
    recommendation: 'Für ambitionierte Sportler',
    icon: 'Flame'
  },
  {
    id: '5-days',
    days: 5,
    title: '5x pro Woche',
    description: 'Hochfrequentes Training',
    recommendation: 'Für sehr erfahrene Athleten',
    icon: 'Flame'
  },
  {
    id: '6-days',
    days: 6,
    title: '6x pro Woche',
    description: 'Professionelles Training',
    recommendation: 'Nur für sehr erfahrene Sportler',
    icon: 'Flame'
  }
];

const iconMap = {
  Calendar,
  Clock,
  Flame
};

export default function FrequencySelection({ onSelect, selectedFrequency }: FrequencySelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-neutral-dark dark:text-neutral-light">
          Wie oft möchtest du trainieren?
        </h2>
        <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-lg">
          Wähle eine realistische Trainingsfrequenz für dich
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {frequencies.map((frequency: WorkoutFrequency) => {
          const Icon: React.ComponentType<{ size?: number }> = iconMap[frequency.icon as keyof typeof iconMap];
          const isSelected: boolean = selectedFrequency?.id === frequency.id;
          
          return (
            <Card
              key={frequency.id}
              selected={isSelected}
              onClick={() => onSelect(frequency)}
              className="text-center"
            >
              <div className="space-y-4">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-primary text-white' : 'bg-neutral-dark/10 dark:bg-neutral-light/10'
                }`}>
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-neutral-dark dark:text-neutral-light mb-1">
                    {frequency.title}
                  </h3>
                  <p className="text-neutral-dark/70 dark:text-neutral-light/70 mb-3">
                    {frequency.description}
                  </p>
                  <p className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
                    {frequency.recommendation}
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