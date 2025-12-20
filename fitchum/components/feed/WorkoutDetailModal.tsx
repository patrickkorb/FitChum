'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { X, Clock, Dumbbell } from 'lucide-react';
import { WorkoutData } from './FriendListItem';
import PRBadge from './PRBadge';
import QuickReactions from './QuickReactions';

interface WorkoutDetailModalProps {
  workout: WorkoutData | null;
  isOpen: boolean;
  onClose: () => void;
  onReact?: (reactionType: string) => void;
}

export default function WorkoutDetailModal({
  workout,
  isOpen,
  onClose,
  onReact,
}: WorkoutDetailModalProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Reset translate when opening
      setTranslateY(0);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle touch events for swipe down
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.targetTouches[0].clientY;
    const diff = currentTouch - touchStart;

    // Only allow downward swipe
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // If swiped down more than 100px, close the modal
    if (translateY > 100) {
      onClose();
    }

    // Reset translate
    setTranslateY(0);
  };

  if (!isOpen || !workout) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed inset-x-0 bottom-0 z-50 animate-slide-up"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-card rounded-t-3xl shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Image
                src={workout.userAvatar}
                alt={`${workout.userName}'s avatar`}
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-foreground">{workout.userName}</h2>
                <p className="text-sm text-muted-foreground">
                  {workout.status === 'live' && 'Training now'}
                  {workout.status === 'pending' && 'Planned for today'}
                  {workout.status === 'completed' && workout.completedTime}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Workout Type */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Dumbbell className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {workout.workoutType}
                </h3>
              </div>

              {/* PR Badge */}
              {workout.pr && (
                <PRBadge exercise={workout.pr.exercise} value={workout.pr.value} />
              )}
            </div>

            {/* Exercises */}
            {workout.exercises.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Exercises
                </h4>
                <div className="space-y-2">
                  {workout.exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-foreground">{exercise}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reactions (only for completed workouts) */}
            {workout.status === 'completed' && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Send some love
                </p>
                <QuickReactions workoutId={workout.id} onReact={onReact} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
