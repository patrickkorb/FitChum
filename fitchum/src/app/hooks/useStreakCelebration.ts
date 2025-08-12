'use client';

import { useEffect, useRef } from 'react';
import { useConfetti } from '../components/ui/Confetti';

interface UseStreakCelebrationProps {
  currentStreak: number;
  isLoading?: boolean;
}

export function useStreakCelebration({ currentStreak, isLoading = false }: UseStreakCelebrationProps) {
  const previousStreak = useRef<number>(-1);
  const { celebrate } = useConfetti();

  useEffect(() => {
    // Skip if still loading or this is the initial load
    if (isLoading || previousStreak.current === -1) {
      previousStreak.current = currentStreak;
      return;
    }

    // Check if streak increased and hit a milestone
    if (currentStreak > previousStreak.current) {
      const isSignificantMilestone = 
        currentStreak >= 100 ||  // Century milestone
        currentStreak === 50 ||  // Half century  
        currentStreak === 30 ||  // Monthly master
        currentStreak === 21 ||  // 3 weeks
        currentStreak === 14 ||  // 2 weeks
        currentStreak === 7 ||   // Week warrior
        (currentStreak % 25 === 0 && currentStreak >= 25); // Every 25 days after 25

      const isMediumMilestone = 
        !isSignificantMilestone && 
        currentStreak % 10 === 0 && 
        currentStreak >= 10; // Every 10 days

      const isSmallMilestone = 
        !isSignificantMilestone && 
        !isMediumMilestone &&
        currentStreak % 5 === 0 && 
        currentStreak >= 5; // Every 5 days

      if (isSignificantMilestone) {
        celebrate('milestone'); // Purple confetti for major milestones
      } else if (isMediumMilestone) {
        celebrate('streak'); // Orange confetti for medium milestones  
      } else if (isSmallMilestone) {
        celebrate('achievement'); // Gold confetti for small milestones
      }
    }

    previousStreak.current = currentStreak;
  }, [currentStreak, isLoading, celebrate]);

  return { celebrate };
}