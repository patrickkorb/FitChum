'use client';

import { useState, useCallback } from 'react';
import { saveRestTimer, getRestTimer } from '@/lib/localStorage';
import type { RestTimerState } from '@/types/workout.types';

const DEFAULT_DURATION = 150;

export function useRestTimer() {
  const [restTimer, setRestTimer] = useState<RestTimerState>(() => {
    const saved = getRestTimer();
    return saved;
  });

  const startRestTimer = useCallback(
    (exerciseId?: string, setNumber?: number) => {
      const newTimer: RestTimerState = {
        active: true,
        startTime: Date.now(),
        duration: DEFAULT_DURATION,
        exerciseId,
        setNumber,
      };
      setRestTimer(newTimer);
      saveRestTimer(newTimer);
    },
    []
  );

  const stopRestTimer = useCallback(() => {
    const newTimer: RestTimerState = {
      active: false,
      startTime: 0,
      duration: DEFAULT_DURATION,
    };
    setRestTimer(newTimer);
    saveRestTimer(newTimer);
  }, []);

  const skipRestTimer = useCallback(() => {
    stopRestTimer();
  }, [stopRestTimer]);

  return {
    restTimer,
    startRestTimer,
    stopRestTimer,
    skipRestTimer,
    isRestTimerActive: restTimer.active,
  };
}
