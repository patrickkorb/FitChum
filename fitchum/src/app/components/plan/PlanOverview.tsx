"use client"
import { useState } from 'react';
import PlanHeader from './PlanHeader';
import TodaysWorkout from './TodaysWorkout';
import WeeklySchedule from './WeeklySchedule';
import PlanStats from './PlanStats';

// Mock data - in real app this would come from API/state management
const mockPlanData = {
  workoutSplit: 'Push/Pull/Legs',
  frequency: '3x pro Woche',
  schedule: 'Mo, Mi, Fr'
};

const mockTodaysWorkout = {
  name: 'Push Day',
  type: 'Oberkörper Push',
  duration: 60,
  completed: false
};

const mockWeeklySchedule = [
  { day: 'monday', name: 'Push Day', type: 'Push', duration: 60, completed: false, isToday: true, isRestDay: false },
  { day: 'tuesday', name: 'Ruhetag', type: '', duration: 0, completed: false, isToday: false, isRestDay: true },
  { day: 'wednesday', name: 'Pull Day', type: 'Pull', duration: 60, completed: false, isToday: false, isRestDay: false },
  { day: 'thursday', name: 'Ruhetag', type: '', duration: 0, completed: false, isToday: false, isRestDay: true },
  { day: 'friday', name: 'Leg Day', type: 'Legs', duration: 75, completed: false, isToday: false, isRestDay: false },
  { day: 'saturday', name: 'Ruhetag', type: '', duration: 0, completed: false, isToday: false, isRestDay: true },
  { day: 'sunday', name: 'Ruhetag', type: '', duration: 0, completed: false, isToday: false, isRestDay: true }
];

interface MockStats {
  weeklyGoal: number;
  completedThisWeek: number;
  currentStreak: number;
  totalWorkouts: number;
  averageDuration: number;
}

const mockStats: MockStats = {
  weeklyGoal: 3,
  completedThisWeek: 1,
  currentStreak: 5,
  totalWorkouts: 24,
  averageDuration: 62
};

interface PlanOverviewProps {
  onEditPlan: () => void;
}

export default function PlanOverview({ onEditPlan }: PlanOverviewProps) {
  const [todaysWorkout, setTodaysWorkout] = useState(mockTodaysWorkout);
  const [weeklySchedule, setWeeklySchedule] = useState(mockWeeklySchedule);
  const [stats, setStats] = useState(mockStats);

  const handleStartWorkout = (): void => {
    console.log('Starting workout:', todaysWorkout.name);
    // In real app: navigate to workout tracking view
    alert('Workout gestartet! (Noch nicht implementiert)');
  };

  const handleCompleteWorkout = (): void => {
    setTodaysWorkout(prev => ({ ...prev, completed: true }));
    setWeeklySchedule(prev => 
      prev.map(day => 
        day.isToday ? { ...day, completed: true } : day
      )
    );
    setStats(prev => ({ 
      ...prev, 
      completedThisWeek: prev.completedThisWeek + 1,
      currentStreak: prev.currentStreak + 1,
      totalWorkouts: prev.totalWorkouts + 1
    }));
    alert('Workout als abgeschlossen markiert! 💪');
  };

  const handleDayClick = (day: any): void => {
    console.log('Clicked on day:', day);
    // In real app: show workout details for that day
    alert(`${day.name} Details (Noch nicht implementiert)`);
  };

  return (
    <div className="col-span-3 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <PlanHeader 
          planData={mockPlanData}
          onEditPlan={onEditPlan}
        />

        {/* Stats Overview */}
        <PlanStats stats={stats} />

        {/* Today's Workout */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light">
            Heute dran
          </h2>
          <TodaysWorkout
            workout={todaysWorkout}
            onStartWorkout={handleStartWorkout}
            onCompleteWorkout={handleCompleteWorkout}
          />
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light">
            Diese Woche
          </h2>
          <WeeklySchedule
            schedule={weeklySchedule}
            onDayClick={handleDayClick}
          />
        </div>
      </div>
    </div>
  );
}