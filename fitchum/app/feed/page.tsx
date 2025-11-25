'use client';

import Image from 'next/image';
import { Flame, Plus } from 'lucide-react';
import WorkoutCard from '../components/feed/WorkoutCard';

// Dummy data for friends' workouts
const friendsWorkouts = [
  {
    id: '1',
    userName: 'Max Mustermann',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    workoutType: 'Push Day',
    exercises: ['Bench Press', 'Shoulder Press', 'Tricep Dips'],
    time: '2h ago',
    isCompleted: true,
  },
  {
    id: '2',
    userName: 'Sarah Schmidt',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    workoutType: 'Leg Day',
    exercises: ['Squats', 'Leg Press', 'Lunges'],
    time: '3h ago',
    isCompleted: true,
  },
  {
    id: '3',
    userName: 'Tom Weber',
    userAvatar: 'https://i.pravatar.cc/150?img=33',
    workoutType: 'Pull Day',
    exercises: ['Deadlifts', 'Pull-ups', 'Barbell Rows'],
    time: 'Today',
    isCompleted: false,
  },
  {
    id: '4',
    userName: 'Lisa Müller',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    workoutType: 'Rest Day',
    exercises: [],
    time: 'Today',
    isCompleted: false,
    isRestDay: true,
  },
  {
    id: '5',
    userName: 'Anna Fischer',
    userAvatar: 'https://i.pravatar.cc/150?img=20',
    workoutType: 'Cardio & Abs',
    exercises: ['Running 5km', 'Planks', 'Mountain Climbers'],
    time: 'Today',
    isCompleted: false,
  },
  {
    id: '6',
    userName: 'Chris Klein',
    userAvatar: 'https://i.pravatar.cc/150?img=68',
    workoutType: 'Upper Body',
    exercises: ['Pull-ups', 'Dumbbell Press', 'Cable Rows'],
    time: 'Yesterday',
    isCompleted: true,
  },
];

// Leaderboard data
const leaderboard = [
  {
    rank: 2,
    name: 'Sarah S.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    workouts: 5,
    color: 'accent-silver',
  },
  {
    rank: 1,
    name: 'Chris K.',
    avatar: 'https://i.pravatar.cc/150?img=68',
    workouts: 7,
    color: 'accent-gold',
  },
  {
    rank: 3,
    name: 'Max M.',
    avatar: 'https://i.pravatar.cc/150?img=12',
    workouts: 4,
    color: 'accent-bronze',
  },
];

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header with Streak */}
      <div className="sticky top-0 z-20 flex flex-col bg-background/80 dark:bg-background/80 backdrop-blur-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Flame className="h-8 w-8 text-accent-gold" />
            <span className="text-2xl font-bold text-accent-gold">125</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Activity Feed</h1>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white shadow-lg shadow-secondary/30 active:scale-95 transition-transform duration-150">
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3 text-foreground px-1">Weekly Leaderboard</h2>
        <div className="grid grid-cols-3 gap-3">
          {/* 2nd Place - Left */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <Image
                alt={`Profile picture of ${leaderboard[0].name}`}
                className={`rounded-full object-cover border-4 border-${leaderboard[0].color}`}
                src={leaderboard[0].avatar}
                width={64}
                height={64}
              />
              <div className="absolute -bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent-silver border-2 border-card text-sm font-bold text-white">
                2
              </div>
            </div>
            <p className="font-semibold text-sm truncate">{leaderboard[0].name}</p>
            <p className="text-xs font-medium text-muted-foreground">{leaderboard[0].workouts} workouts</p>
          </div>

          {/* 1st Place - Center (Elevated) */}
          <div className="flex flex-col items-center -mt-4">
            <div className="relative mb-2">
              <Image
                alt={`Profile picture of ${leaderboard[1].name}`}
                className={`rounded-full object-cover border-4 border-${leaderboard[1].color}`}
                src={leaderboard[1].avatar}
                width={80}
                height={80}
              />
              <div className="absolute -bottom-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-accent-gold border-2 border-card text-base font-bold text-white">
                1
              </div>
            </div>
            <p className="font-bold text-base truncate">{leaderboard[1].name}</p>
            <p className="text-sm font-medium text-muted-foreground">{leaderboard[1].workouts} workouts</p>
          </div>

          {/* 3rd Place - Right */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <Image
                alt={`Profile picture of ${leaderboard[2].name}`}
                className={`rounded-full object-cover border-4 border-${leaderboard[2].color}`}
                src={leaderboard[2].avatar}
                width={64}
                height={64}
              />
              <div className="absolute -bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent-bronze border-2 border-card text-sm font-bold text-white">
                3
              </div>
            </div>
            <p className="font-semibold text-sm truncate">{leaderboard[2].name}</p>
            <p className="text-xs font-medium text-muted-foreground">{leaderboard[2].workouts} workouts</p>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex flex-col gap-4 p-4 pt-2">
        {friendsWorkouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>

      {/* Empty State */}
      {friendsWorkouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">💪</p>
          <h3 className="text-lg font-semibold mb-2">No workouts yet</h3>
          <p className="text-muted-foreground">
            Add friends to see their workouts here
          </p>
        </div>
      )}
    </div>
  );
}
