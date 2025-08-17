'use client';

import { CirclePlus, Zap, CheckCircle2, Calendar, Trash2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import WorkoutLogModal from '@/app/components/journal/WorkoutLogModal';
import AuthModal from '@/app/components/ui/AuthModal';
import { hasLoggedWorkoutToday, getTodaysJournalEntry } from '@/lib/workoutLogger';
import type { JournalEntry } from '@/lib/supabase';
import Button from '@/app/components/ui/Button';

const MOTIVATIONAL_MESSAGES = [
    'Ready to crush todays workout?',
    'How did your workout go today?',
    'Time to turn up the heat!',
    'Your future self will thank you!',
    'Every rep counts towards your goal!',
    "Let's make today legendary!"
];

const COMPLETED_MESSAGES = [
    'Amazing work today! 💪',
    'You crushed it! 🔥',
    'Consistency is key! ⭐',
    'Another day, another victory! 🏆',
    'Keep the momentum going! 🚀',
    'You\'re unstoppable! ⚡'
];

export default function Journal() {
    const [currentMessage, setCurrentMessage] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [hasLoggedToday, setHasLoggedToday] = useState(false);
    const [todaysEntry, setTodaysEntry] = useState<JournalEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        checkAuthAndWorkoutStatus();
    }, []);

    useEffect(() => {
        const messages = hasLoggedToday ? COMPLETED_MESSAGES : MOTIVATIONAL_MESSAGES;
        
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentMessage((prev) => (prev + 1) % messages.length);
                setIsVisible(true);
            }, 300);
        }, 4000);

        return () => clearInterval(interval);
    }, [hasLoggedToday]);

    const checkAuthAndWorkoutStatus = async () => {
        setLoading(true);
        try {
            const { data: userData, error } = await supabase.auth.getUser();
            
            if (error || !userData.user) {
                console.error('No authenticated user found');
                return;
            }

            setUser({ id: userData.user.id });
            
            // Check if workout is already logged today
            const logged = await hasLoggedWorkoutToday(userData.user.id);
            setHasLoggedToday(logged);

            if (logged) {
                const entry = await getTodaysJournalEntry(userData.user.id);
                setTodaysEntry(entry);
            }
        } catch (error) {
            console.error('Error checking workout status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        if (!user) {
            // Show auth modal for unauthorized users
            setShowAuthModal(true);
            return;
        }
        
        if (!hasLoggedToday) {
            setShowModal(true);
        }
    };

    const handleWorkoutLogged = () => {
        setShowModal(false);
        checkAuthAndWorkoutStatus(); // Refresh the status
    };

    const deleteWorkoutEntry = async () => {
        if (!user || !todaysEntry) return;

        setDeleting(true);
        try {
            const today = new Date().toISOString().split('T')[0];

            // Delete the journal entry
            const { error: journalError } = await supabase
                .from('journal_entries')
                .delete()
                .eq('user_id', user.id)
                .eq('date', today);

            if (journalError) {
                console.error('Error deleting journal entry:', journalError);
                return;
            }

            // Remove today's activity log entry if it exists
            await supabase
                .from('activity_logs')
                .delete()
                .eq('user_id', user.id)
                .eq('date', today)
                .eq('action_type', 'workout_logged');

            // Recalculate streak - get all remaining journal entries to recalculate streak
            const { data: allEntries } = await supabase
                .from('journal_entries')
                .select('date')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            let currentStreak = 0;
            let maxStreak = 0;

            if (allEntries && allEntries.length > 0) {
                const dates = allEntries.map(entry => entry.date).sort().reverse();
                
                // Calculate current streak from today backwards
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() - 1); // Start from yesterday since today is deleted
                
                for (let i = 0; i < dates.length; i++) {
                    const expectedDate = currentDate.toISOString().split('T')[0];
                    
                    if (dates.includes(expectedDate)) {
                        if (currentDate.toISOString().split('T')[0] === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
                            // This is yesterday, continue current streak
                            currentStreak++;
                        }
                        currentDate.setDate(currentDate.getDate() - 1);
                    } else {
                        break;
                    }
                }

                // Calculate max streak
                let consecutiveDays = 0;
                for (let i = 0; i < dates.length - 1; i++) {
                    const currentDateObj = new Date(dates[i]);
                    const nextDateObj = new Date(dates[i + 1]);
                    const dayDifference = (currentDateObj.getTime() - nextDateObj.getTime()) / (1000 * 60 * 60 * 24);
                    
                    if (dayDifference === 1) {
                        consecutiveDays++;
                    } else {
                        if (consecutiveDays + 1 > maxStreak) {
                            maxStreak = consecutiveDays + 1;
                        }
                        consecutiveDays = 0;
                    }
                }
                
                // Check the last sequence
                if (consecutiveDays + 1 > maxStreak) {
                    maxStreak = consecutiveDays + 1;
                }

                // If there's only one entry or isolated entries, max streak is 1
                if (maxStreak === 0 && dates.length > 0) {
                    maxStreak = 1;
                }
            }

            // Find the most recent workout date for last_workout_date
            const lastWorkoutDate = allEntries && allEntries.length > 0 
                ? allEntries[0].date + 'T00:00:00.000Z' 
                : null;

            // Update user's streak and total workout count
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ 
                    current_streak: currentStreak,
                    longest_streak: maxStreak,
                    total_workouts: allEntries ? allEntries.length : 0,
                    last_workout_date: lastWorkoutDate,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id);

            if (profileError) {
                console.error('Error updating profile:', profileError);
                return;
            }

            // Reset UI state
            setHasLoggedToday(false);
            setTodaysEntry(null);
            setShowDeleteConfirm(false);
            
        } catch (error) {
            console.error('Error deleting workout:', error);
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const currentMessages = hasLoggedToday ? COMPLETED_MESSAGES : MOTIVATIONAL_MESSAGES;

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-8 py-8">
                <div className="flex flex-col gap-8 sm:gap-12 items-center max-w-2xl mx-auto text-center w-full">
                    
                    {/* Title Section */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 sm:gap-3 bg-neutral-dark/5 dark:bg-neutral-light/10 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-neutral-dark/10 dark:border-neutral-light/20">
                            {hasLoggedToday ? (
                                <>
                                    <CheckCircle2 className="w-3 h-3 text-primary" />
                                    <span className="text-neutral-dark dark:text-neutral-light font-semibold text-base sm:text-lg">Today&apos;s Entry</span>
                                    <span className="text-primary font-medium text-sm sm:text-base hidden sm:inline">• Completed!</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
                                    <span className="text-neutral-dark dark:text-neutral-light font-semibold text-base sm:text-lg">Today&apos;s Entry</span>
                                    <span className="text-neutral-dark/70 dark:text-neutral-light/70 font-medium text-sm sm:text-base hidden sm:inline">• Not logged yet</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Rotating Motivational Message */}
                    <div className="h-20 sm:h-24 flex items-center justify-center px-4">
                        <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-bold text-neutral-dark dark:text-neutral-light transition-all duration-300 text-center leading-tight ${
                            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
                        }`}>
                            {currentMessages[currentMessage]}
                        </h1>
                    </div>
                    
                    {/* CTA Section or Completed View */}
                    {hasLoggedToday && todaysEntry ? (
                        <div className="w-full space-y-6">
                            {/* Completed Workout Card */}
                            <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <CheckCircle2 className="text-primary" size={32} />
                                    <h2 className="text-xl sm:text-2xl font-bold text-primary">
                                        Workout Completed!
                                    </h2>
                                </div>
                                
                                <div className="space-y-3 text-left bg-white/50 dark:bg-neutral-dark/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} className="text-neutral-dark/70 dark:text-neutral-light/70" />
                                        <span className="text-neutral-dark dark:text-neutral-light font-medium">
                                            {formatDate(todaysEntry.date)}
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <span className="text-neutral-dark/70 dark:text-neutral-light/70 text-sm">Workout:</span>
                                        <p className="text-neutral-dark dark:text-neutral-light font-semibold">
                                            {todaysEntry.workout_name}
                                        </p>
                                    </div>
                                    
                                    {todaysEntry.duration && (
                                        <div>
                                            <span className="text-neutral-dark/70 dark:text-neutral-light/70 text-sm">Duration:</span>
                                            <p className="text-neutral-dark dark:text-neutral-light font-medium">
                                                {todaysEntry.duration} minutes
                                            </p>
                                        </div>
                                    )}
                                    
                                    {todaysEntry.difficulty && (
                                        <div>
                                            <span className="text-neutral-dark/70 dark:text-neutral-light/70 text-sm">Difficulty:</span>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`text-lg ${i < todaysEntry.difficulty! ? 'text-secondary' : 'text-neutral-dark/20 dark:text-neutral-light/20'}`}>
                                                        ⭐
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {todaysEntry.notes && (
                                        <div>
                                            <span className="text-neutral-dark/70 dark:text-neutral-light/70 text-sm">Notes:</span>
                                            <p className="text-neutral-dark dark:text-neutral-light italic">
                                                &quot;{todaysEntry.notes}&quot;
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Delete/Undo Button */}
                                <div className="mt-6 pt-4 border-t border-neutral-dark/10 dark:border-neutral-light/10">
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            variant="outline"
                                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950 dark:hover:border-red-700"
                                        >
                                            <Trash2 size={16} className="mr-2" />
                                            Undo Entry
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
                            <button 
                                className="bg-primary hover:cursor-pointer hover:bg-primary/90 text-white font-bold py-4 sm:py-6 px-8 sm:px-12 rounded-2xl text-lg sm:text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 sm:gap-4 group w-full sm:w-auto max-w-sm"
                                onClick={handleOpenModal}
                            >
                                <CirclePlus size={24} className="sm:size-8 group-hover:rotate-90 transition-transform duration-300" />
                                <span className="truncate">Log Today&apos;s Workout</span>
                            </button>
                            
                            <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-lg text-neutral-dark/80 dark:text-neutral-light/80">
                                <span>Track your progress</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Stay accountable</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Inspire others</span>
                            </div>
                        </div>
                    )}

                    {/* Streak Motivation */}
                    {!hasLoggedToday && (
                        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-2xl border-2 border-neutral-dark/10 dark:border-neutral-light/10 w-full">
                            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                                <Zap className="text-neutral-dark dark:text-neutral-light" size={20} />
                                <span className="text-neutral-dark dark:text-neutral-light font-bold text-lg sm:text-xl text-center">Keep Your Streak Alive!</span>
                                <Zap className="text-neutral-dark dark:text-neutral-light" size={20} />
                            </div>
                            <p className="text-neutral-dark/80 dark:text-neutral-light/80 text-base sm:text-lg text-center">
                                Don&apos;t let today be the day you break your momentum. Every workout counts!
                            </p>
                        </div>
                    )}
                </div>
            </div>


            {/* Workout Log Modal */}
            {user && (
                <WorkoutLogModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleWorkoutLogged}
                    userId={user.id}
                />
            )}

            {/* Auth Modal for unauthorized users */}
            <AuthModal 
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                title="Ready to Track Your Progress?"
                message="Join thousands of fitness enthusiasts who use FitChum to stay motivated and accountable! Start logging your workouts today."
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-dark w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900">
                                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
                                    Undo Workout Entry
                                </h3>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-neutral-dark/70 dark:text-neutral-light/70 mb-3">
                                    Are you sure you want to delete today&apos;s workout entry? This will:
                                </p>
                                <ul className="text-sm text-neutral-dark/60 dark:text-neutral-light/60 space-y-1 ml-4">
                                    <li>• Remove the workout from your journal</li>
                                    <li>• Update your current streak</li>
                                    <li>• Remove it from your activity feed</li>
                                    <li>• This action cannot be undone</li>
                                </ul>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    variant="outline"
                                    className="flex-1"
                                    disabled={deleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={deleteWorkoutEntry}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                    disabled={deleting}
                                >
                                    {deleting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} className="mr-2" />
                                            Delete Entry
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}