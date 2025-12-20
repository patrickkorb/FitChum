'use client';

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import FriendListItem from '@/components/feed/FriendListItem';
import WorkoutDetailModal from '@/components/feed/WorkoutDetailModal';
import { WorkoutData } from '@/components/feed/FriendListItem';

// Dummy data for today's friend workouts
const friendsWorkouts: WorkoutData[] = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'Max Mustermann',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    workoutType: 'Push Day',
    exercises: ['Bench Press 4x8', 'Incline DB Press 3x10', 'Shoulder Press 3x12', 'Tricep Dips 3x12'],
    status: 'live',
  },
  {
    id: '2',
    userId: 'user-2',
    userName: 'Sarah Schmidt',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    workoutType: 'Leg Day',
    exercises: ['Squats 5x5', 'Leg Press 4x10', 'Lunges 3x12', 'Leg Curls 3x15'],
    status: 'live',
  },
  {
    id: '3',
    userId: 'user-3',
    userName: 'Tom Weber',
    userAvatar: 'https://i.pravatar.cc/150?img=33',
    workoutType: 'Pull Day',
    exercises: ['Deadlifts', 'Pull-ups', 'Barbell Rows', 'Face Pulls'],
    status: 'pending',
  },
  {
    id: '4',
    userId: 'user-4',
    userName: 'Anna Fischer',
    userAvatar: 'https://i.pravatar.cc/150?img=20',
    workoutType: 'Cardio & Abs',
    exercises: ['Running 5km', 'Planks 3x60s', 'Mountain Climbers', 'Leg Raises'],
    status: 'pending',
  },
  {
    id: '5',
    userId: 'user-5',
    userName: 'Chris Klein',
    userAvatar: 'https://i.pravatar.cc/150?img=68',
    workoutType: 'Upper Body',
    exercises: ['Pull-ups 4x8', 'DB Press 3x10', 'Cable Rows 3x12', 'Face Pulls 3x15'],
    status: 'completed',
    completedTime: '2h ago',
    pr: {
      exercise: 'Pull-ups',
      value: '25 reps',
    },
  },
  {
    id: '6',
    userId: 'user-6',
    userName: 'Lisa Müller',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    workoutType: 'Full Body',
    exercises: ['Squats', 'Bench Press', 'Rows', 'Overhead Press'],
    status: 'completed',
    completedTime: '4h ago',
  },
  {
    id: '7',
    userId: 'user-7',
    userName: 'Kevin Schmidt',
    userAvatar: 'https://i.pravatar.cc/150?img=15',
    workoutType: 'Legs & Core',
    exercises: ['Front Squats 4x6', 'RDL 3x10', 'Leg Extensions 3x12', 'Ab Wheel 3x10'],
    status: 'completed',
    completedTime: '5h ago',
    pr: {
      exercise: 'Front Squat',
      value: '120kg',
    },
  },
];

export default function FeedPage() {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort workouts: live → pending → completed (by time)
  const sortedWorkouts = [...friendsWorkouts].sort((a, b) => {
    const statusOrder = { live: 0, pending: 1, completed: 2 };
    if (a.status !== b.status) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return 0;
  });

  const handleWorkoutClick = (workout: WorkoutData) => {
    setSelectedWorkout(workout);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedWorkout(null), 300); // Delay cleanup for animation
  };

  const handlePush = () => {
    console.log('Push notification sent!');
  };

  const handleReact = (reactionType: string) => {
    console.log('Reaction:', reactionType);
  };

  // Count by status for stats
  const liveCount = friendsWorkouts.filter((w) => w.status === 'live').length;
  const pendingCount = friendsWorkouts.filter((w) => w.status === 'pending').length;
  const completedCount = friendsWorkouts.filter((w) => w.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden max-w-[100vw]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border backdrop-blur-lg bg-card/80 overflow-hidden max-w-full w-full">
        <div className="px-4 py-4 max-w-full overflow-hidden">
          <div className="flex items-center justify-between mb-3 gap-2 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate min-w-0">Today&apos;s Activity</h1>
            <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <span className="text-muted-foreground">
                {liveCount} live
              </span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <div className="w-2 h-2 rounded-full bg-accent-gold flex-shrink-0" />
              <span className="text-muted-foreground">
                {pendingCount} pending
              </span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <div className="w-2 h-2 rounded-full bg-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">
                {completedCount} done
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feed List */}
      <div className="px-1 py-4 space-y-2">
        {sortedWorkouts.map((workout) => (
          <FriendListItem
            key={workout.id}
            workout={workout}
            onClick={() => handleWorkoutClick(workout)}
            onPush={handlePush}
            onReact={handleReact}
          />
        ))}
      </div>

      {/* Empty State */}
      {friendsWorkouts.length === 0 && (
        <div className="text-center py-12 px-4">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2 text-foreground">No friends yet</h3>
          <p className="text-muted-foreground">
            Add friends to see their workouts here
          </p>
        </div>
      )}

      {/* Workout Detail Modal */}
      <WorkoutDetailModal
        workout={selectedWorkout}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onReact={handleReact}
      />
    </div>
  );
}
