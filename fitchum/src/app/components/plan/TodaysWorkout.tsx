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
        <div className="py-6 sm:py-8">
          <CheckCircle className="mx-auto text-neutral-dark/30 dark:text-neutral-light/30 mb-3 sm:mb-4" size={40} />
          <h3 className="text-lg sm:text-xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
            Kein Training heute
          </h3>
          <p className="text-sm sm:text-base text-neutral-dark/60 dark:text-neutral-light/60">
            Genieße deinen wohlverdienten Ruhetag!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {workout.completed && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <div className="bg-primary text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
            <CheckCircle size={14} />
            <span className="hidden sm:inline">Abgeschlossen</span>
            <span className="sm:hidden">✓</span>
          </div>
        </div>
      )}
      
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Dumbbell className="text-primary" size={20} />
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-dark dark:text-neutral-light">
              {workout.name}
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-neutral-dark/70 dark:text-neutral-light/70 text-sm sm:text-base">
            <span className="flex items-center gap-2">
              <span className="font-medium">{workout.type}</span>
            </span>
            <span className="flex items-center gap-1 sm:gap-2">
              <Clock size={14} />
              {workout.duration} Min
            </span>
          </div>
        </div>

        {/* Workout Description */}
        <div className="bg-neutral-dark/5 dark:bg-neutral-light/5 p-3 sm:p-4 rounded-lg sm:rounded-xl">
          <p className="text-sm sm:text-base text-neutral-dark/80 dark:text-neutral-light/80">
            Bereit für dein {workout.type} Training? Los geht es! 💪
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!workout.completed ? (
            <>
              <Button onClick={onStartWorkout} className="flex-1" size="md">
                <PlayCircle size={18} />
                <span className="hidden sm:inline">Training starten</span>
                <span className="sm:hidden">Starten</span>
              </Button>
              <Button variant="outline" onClick={onCompleteWorkout} className="sm:flex-none" size="md">
                <CheckCircle size={18} />
                <span className="hidden sm:inline">Als erledigt markieren</span>
                <span className="sm:hidden">Erledigt</span>
              </Button>
            </>
          ) : (
            <Button variant="outline" className="flex-1" disabled size="md">
              <CheckCircle size={18} />
              <span className="hidden sm:inline">Training abgeschlossen</span>
              <span className="sm:hidden">Abgeschlossen</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}