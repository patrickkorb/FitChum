'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, MessageSquare, Star } from 'lucide-react';
import Button from '../ui/Button';
import { getTodaysWorkout } from '@/lib/workoutPlan';
import { logWorkout } from '@/lib/workoutLogger';
import type { WorkoutSchedule } from '@/lib/supabase';

interface WorkoutLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export default function WorkoutLogModal({ isOpen, onClose, onSuccess, userId }: WorkoutLogModalProps) {
  const [isLogging, setIsLogging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState<number>(0);
  const [todaysWorkout, setTodaysWorkout] = useState<WorkoutSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadTodaysWorkout();
      // Reset form when modal opens
      setIsCompleted(false);
      setNotes('');
      setDuration('');
      setDifficulty(0);
    }
  }, [isOpen, userId]);

  const loadTodaysWorkout = async () => {
    setLoading(true);
    try {
      const workout = await getTodaysWorkout(userId);
      setTodaysWorkout(workout);
    } catch (error) {
      console.error('Error loading today\'s workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLog = async () => {
    setIsLogging(true);
    try {
      await logWorkoutEntry();
      setIsCompleted(true);
      
      // Auto-close after 2 seconds if no additional details
      setTimeout(() => {
        if (!notes.trim() && !duration && difficulty === 0) {
          handleClose();
        }
      }, 2000);
    } catch (error) {
      console.error('Error logging workout:', error);
      // TODO: Show error message to user
    } finally {
      setIsLogging(false);
    }
  };

  const handleSaveWithDetails = async () => {
    setIsLogging(true);
    try {
      await logWorkoutEntry();
      handleClose();
    } catch (error) {
      console.error('Error saving workout details:', error);
      // TODO: Show error message to user
    } finally {
      setIsLogging(false);
    }
  };

  const logWorkoutEntry = async () => {
    await logWorkout({
      userId,
      workoutType: todaysWorkout?.workout_type || 'workout',
      workoutName: todaysWorkout?.workout_name || 'Workout',
      notes: notes.trim() || undefined,
      duration: duration ? parseInt(duration) : undefined,
      difficulty: difficulty || undefined
    });

    onSuccess();
  };

  const handleClose = () => {
    setIsCompleted(false);
    onClose();
  };

  const getDifficultyLabel = (rating: number) => {
    switch (rating) {
      case 1: return 'Very Easy';
      case 2: return 'Easy';
      case 3: return 'Moderate';
      case 4: return 'Hard';
      case 5: return 'Very Hard';
      default: return 'Rate difficulty';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-dark w-full max-w-md mx-auto rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-dark/10 dark:border-neutral-light/10">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-dark dark:text-neutral-light">
            Log Your Workout
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-neutral-dark/5 dark:hover:bg-neutral-light/5 transition-colors"
          >
            <X size={20} className="text-neutral-dark/70 dark:text-neutral-light/70" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-neutral-dark/70 dark:text-neutral-light/70 mt-4">Loading workout...</p>
            </div>
          ) : (
            <>
              {/* Today's Workout Info */}
              {todaysWorkout && (
                <div className={`rounded-xl p-4 text-center ${todaysWorkout.workout_type.toLowerCase().includes('rest') ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700' : 'bg-primary/10'}`}>
                  <h3 className={`font-semibold text-lg mb-1 ${todaysWorkout.workout_type.toLowerCase().includes('rest') ? 'text-blue-600 dark:text-blue-400' : 'text-primary'}`}>
                    {todaysWorkout.workout_type.toLowerCase().includes('rest') ? 'Rest Day' : "Today's Workout"}
                  </h3>
                  <p className="text-neutral-dark dark:text-neutral-light font-medium">
                    {todaysWorkout.workout_name}
                  </p>
                  {todaysWorkout.workout_type.toLowerCase().includes('rest') && (
                    <div className="mt-3 space-y-2">
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                        🌙 Time to recover and recharge!
                      </p>
                      <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-sm">
                        Rest days are crucial for muscle recovery and growth. Your streak continues automatically - no logging needed!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Log Button or Rest Day Message */}
              {todaysWorkout?.workout_type.toLowerCase().includes('rest') ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">😴</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">Enjoy Your Rest Day!</h3>
                  <p className="text-neutral-dark/70 dark:text-neutral-light/70 max-w-sm mx-auto">
                    No workout logging needed today. Your streak continues automatically on rest days.
                  </p>
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                      ✨ Streak Safe - Rest days don't break your streak!
                    </p>
                  </div>
                </div>
              ) : !isCompleted ? (
                <div className="text-center">
                  <Button
                    onClick={handleQuickLog}
                    disabled={isLogging}
                    className="w-full py-4 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    {isLogging ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Logging Workout...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={24} />
                        Mark as Complete
                      </>
                    )}
                  </Button>
                  <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-sm mt-2">
                    Quick log - add details below (optional)
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle2 size={48} className="text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-primary mb-2">Workout Logged!</h3>
                  <p className="text-neutral-dark/70 dark:text-neutral-light/70">
                    Great job! Add details below or close to finish.
                  </p>
                </div>
              )}

              {/* Optional Details - Hidden on rest days */}
              {!todaysWorkout?.workout_type.toLowerCase().includes('rest') && (
              <div className="space-y-4 border-t border-neutral-dark/10 dark:border-neutral-light/10 pt-6">
                <h4 className="font-semibold text-neutral-dark dark:text-neutral-light flex items-center gap-2">
                  <MessageSquare size={18} />
                  Optional Details
                </h4>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">
                    How did it go? Any notes?
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Felt great today! Hit a new PR on bench press..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-dark/20 dark:border-neutral-light/20 bg-transparent text-neutral-dark dark:text-neutral-light placeholder-neutral-dark/50 dark:placeholder-neutral-light/50 focus:border-primary focus:outline-none transition-colors resize-none"
                    rows={3}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="60"
                    min="1"
                    max="300"
                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-dark/20 dark:border-neutral-light/20 bg-transparent text-neutral-dark dark:text-neutral-light placeholder-neutral-dark/50 dark:placeholder-neutral-light/50 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2 flex items-center gap-2">
                    <Star size={16} />
                    How challenging was it?
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setDifficulty(rating)}
                        className={`p-2 rounded-lg transition-colors ${
                          difficulty >= rating
                            ? 'text-secondary'
                            : 'text-neutral-dark/30 dark:text-neutral-light/30'
                        } hover:text-secondary`}
                      >
                        <Star size={20} fill={difficulty >= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-neutral-dark/70 dark:text-neutral-light/70">
                      {getDifficultyLabel(difficulty)}
                    </span>
                  </div>
                </div>

                {/* Save Button */}
                {isCompleted && (notes.trim() || duration || difficulty > 0) && (
                  <Button
                    onClick={handleSaveWithDetails}
                    disabled={isLogging}
                    className="w-full"
                    variant="outline"
                  >
                    {isLogging ? 'Saving...' : 'Save Details'}
                  </Button>
                )}
              </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}