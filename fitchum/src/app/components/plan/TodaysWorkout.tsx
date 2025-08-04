"use client"
import Card from '../ui/Card';
import Button from '../ui/Button';
import { PlayCircle, Clock, Dumbbell, CheckCircle } from 'lucide-react';

interface TodaysWorkoutProps {
  workout: {
    name: string;
    type: string;
    duration: number;
    completed: boolean;
  } | null;
  onStartWorkout: () => void;
  onCompleteWorkout: () => void;
}

export default function TodaysWorkout({ workout, onStartWorkout, onCompleteWorkout }: TodaysWorkoutProps) {
  if (!workout) {
    return (
      <Card className="text-center">
        <div className="py-8">
          <CheckCircle className="mx-auto text-neutral-dark/30 dark:text-neutral-light/30 mb-4" size={48} />
          <h3 className="text-xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
            Kein Training heute
          </h3>
          <p className="text-neutral-dark/60 dark:text-neutral-light/60">
            Genieße deinen wohlverdienten Ruhetag!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {workout.completed && (
        <div className="absolute top-4 right-4">
          <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <CheckCircle size={16} />
            Abgeschlossen
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Dumbbell className="text-primary" size={24} />
            <h3 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light">
              {workout.name}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-neutral-dark/70 dark:text-neutral-light/70">
            <span className="flex items-center gap-2">
              <span className="font-medium">{workout.type}</span>
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              {workout.duration} Min
            </span>
          </div>
        </div>

        {/* Workout Description */}
        <div className="bg-neutral-dark/5 dark:bg-neutral-light/5 p-4 rounded-xl">
          <p className="text-neutral-dark/80 dark:text-neutral-light/80">
            Bereit für dein {workout.type} Training? Los geht's! 💪
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!workout.completed ? (
            <>
              <Button onClick={onStartWorkout} className="flex-1">
                <PlayCircle size={20} />
                Training starten
              </Button>
              <Button variant="outline" onClick={onCompleteWorkout}>
                <CheckCircle size={20} />
                Als erledigt markieren
              </Button>
            </>
          ) : (
            <Button variant="outline" className="flex-1" disabled>
              <CheckCircle size={20} />
              Training abgeschlossen
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}