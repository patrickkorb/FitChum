'use client';

import React from 'react';
import Image from 'next/image';
import StatusBadge from './StatusBadge';
import PushButton from './PushButton';
import QuickReactions from './QuickReactions';
import PRBadge from './PRBadge';

export interface WorkoutData {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  workoutType: string;
  exercises: string[];
  status: 'live' | 'pending' | 'completed';
  completedTime?: string; // e.g., "2h ago"
  pr?: {
    exercise: string;
    value: string;
  };
}

interface FriendListItemProps {
  workout: WorkoutData;
  onClick: () => void;
  onPush?: () => void;
  onReact?: (reactionType: string) => void;
}

export default function FriendListItem({
  workout,
  onClick,
  onPush,
  onReact,
}: FriendListItemProps) {
  const { userName, userAvatar, workoutType, exercises, status, completedTime, pr } = workout;

  // Create exercise preview (first 2-3 exercises)
  const exercisePreview = exercises.slice(0, 2).join(', ');
  const hasMoreExercises = exercises.length > 2;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 bg-card rounded-lg  hover:bg-muted/30 transition-all cursor-pointer active:scale-[0.98] w-full max-w-full overflow-hidden"
    >
      {/* Avatar with Status Indicator */}
      <div className="relative flex-shrink-0">
        <Image
          src={userAvatar}
          alt={`${userName}'s avatar`}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        {/* Status dot on avatar */}
        {status === 'live' && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary border-2 border-card" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name and Status */}
        <div className="flex items-center gap-2 mb-0.5 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate flex-shrink">{userName}</h3>
          <div className="flex-shrink-0">
            <StatusBadge status={status} completedTime={completedTime} />
          </div>
        </div>

        {/* Workout Type */}
        <p className="text-sm font-medium text-foreground/80 mb-1 truncate">{workoutType}</p>

        {/* Exercise Preview */}
        {exercises.length > 0 && (
          <p className="text-xs text-muted-foreground truncate">
            {exercisePreview}
            {hasMoreExercises && ` +${exercises.length - 2} more`}
          </p>
        )}

        {/* PR Badge */}
        {pr && (
          <div className="mt-1.5 overflow-hidden">
            <PRBadge exercise={pr.exercise} value={pr.value} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        {status === 'pending' ? (
          <PushButton userId={workout.userId} userName={userName} onPush={onPush} />
        ) : status === 'completed' ? (
          <QuickReactions workoutId={workout.id} onReact={onReact} />
        ) : null}
      </div>
    </div>
  );
}
