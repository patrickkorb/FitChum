'use client';

import { useState } from 'react';

interface WorkoutCardProps {
  workout: {
    id: string;
    userName: string;
    userAvatar: string;
    workoutType: string;
    exercises: string[];
    time: string;
    isCompleted: boolean;
    isRestDay?: boolean;
    achievement?: string;
    streak?: number;
  };
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const [fireCount, setFireCount] = useState(5);
  const [hasFired, setHasFired] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  const handleSendNotification = () => {
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 2000);
  };

  const handleFireReaction = () => {
    if (!hasFired) {
      setFireCount(prev => prev + 1);
      setHasFired(true);
    }
  };

  // Rest Day Card
  if (workout.isRestDay) {
    return (
      <div className="flex flex-col rounded-xl bg-card shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <img
            alt={`Profile picture of ${workout.userName}`}
            className="h-12 w-12 rounded-full object-cover"
            src={workout.userAvatar}
          />
          <div className="flex-1">
            <p className="font-bold text-foreground">{workout.userName}</p>
            <p className="text-sm text-muted-foreground">Recovery Day • {workout.time}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-accent-gold/10 dark:bg-accent-gold/20 px-3 py-1.5">
            <span className="text-xl">🧘</span>
            <p className="font-bold text-accent-gold">Zen Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-lg bg-gray-50 dark:bg-white/5 p-4 mx-4 mb-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-gold/10">
            <span className="text-4xl">🧘</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg text-foreground">Active Recovery</p>
            <p className="text-sm text-muted-foreground">Rest is part of the process.</p>
          </div>
        </div>
      </div>
    );
  }

  // Not Completed Card
  if (!workout.isCompleted) {
    return (
      <div className="flex flex-col rounded-xl bg-secondary/10 dark:bg-secondary/20 border border-secondary/20 dark:border-secondary/30 p-4 gap-4">
        <div className="flex items-center gap-3">
          <img
            alt={`Profile picture of ${workout.userName}`}
            className="h-12 w-12 rounded-full object-cover"
            src={workout.userAvatar}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-bold text-foreground">{workout.userName}</p>
              {workout.streak && workout.streak > 0 && (
                <span className="inline-flex items-center gap-0.5 text-accent-gold text-xs font-bold">
                  🔥{workout.streak}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Hasn't worked out yet</p>
          </div>
        </div>

        {/* Planned Workout Info */}
        <div className="flex items-center gap-4 rounded-lg bg-gray-50 dark:bg-white/5 p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary/10">
            <span className="text-4xl">💪</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg text-foreground">{workout.workoutType}</p>
            <p className="text-sm text-muted-foreground">
              {workout.exercises.slice(0, 2).join(' • ')}
              {workout.exercises.length > 2 && ` • +${workout.exercises.length - 2} more`}
            </p>
          </div>
        </div>

        <button
          onClick={handleSendNotification}
          className="w-full rounded-lg bg-secondary py-3 text-base font-bold text-white shadow-lg shadow-secondary/30 active:scale-95 transition-transform duration-150 flex items-center justify-center gap-2"
        >
          <span className="text-xl">🔔</span>
          {notificationSent ? 'Notification Sent!' : `Send a Nudge`}
        </button>
      </div>
    );
  }

  // Completed Card
  return (
    <div className="flex flex-col rounded-xl bg-card shadow-sm">
      {/* User Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          alt={`Profile picture of ${workout.userName}`}
          className="h-12 w-12 rounded-full object-cover"
          src={workout.userAvatar}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-foreground">{workout.userName}</p>
            {workout.streak && workout.streak > 0 && (
              <span className="inline-flex items-center gap-0.5 text-accent-gold text-xs font-bold">
                🔥{workout.streak}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{workout.achievement ? 'Mission Complete!' : 'Workout Complete'} • {workout.time}</p>
        </div>
        {workout.streak && workout.streak > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-primary/10 dark:bg-primary/20 px-3 py-1.5">
            <span className="text-xl">🏅</span>
            <p className="font-bold text-primary">Streak +1</p>
          </div>
        )}
      </div>

      {/* Workout Content */}
      <div className="px-4 pb-4">
        <p className="font-semibold text-foreground">{workout.achievement || `Crushed "${workout.workoutType}"`}</p>
        <p className="text-sm text-muted-foreground">
          {workout.exercises.slice(0, 3).join(' • ')}
          {workout.exercises.length > 3 && ` • +${workout.exercises.length - 3} more`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-start gap-2 border-t border-border px-4 py-3">
        <button
          onClick={handleFireReaction}
          disabled={hasFired}
          className="flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1.5 active:scale-95 transition-transform duration-150"
        >
          <span className={`text-lg ${hasFired ? 'text-accent-red' : ''}`}>🔥</span>
          <span className="text-sm font-semibold text-foreground">{fireCount}</span>
        </button>
        <button className="flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1.5 active:scale-95 transition-transform duration-150">
          <span className="text-lg text-secondary">💬</span>
          <span className="text-sm font-semibold text-foreground">3</span>
        </button>
        <button className="flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1.5 active:scale-95 transition-transform duration-150">
          <span className="text-lg">📸</span>
        </button>
      </div>
    </div>
  );
}
