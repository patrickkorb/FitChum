"use client"
import { useState, useEffect } from 'react';
import Card from '../ui/Card';

export interface SelectedDays {
  days: string[];
  pattern?: 'specific' | 'interval';
}

interface DaySelectionProps {
  frequency: number;
  splitType: string;
  onSelect: (selection: SelectedDays) => void;
  selectedDays?: SelectedDays;
}

const weekDays: Array<{id: string; name: string; short: string}> = [
  { id: 'monday', name: 'Monday', short: 'Mo' },
  { id: 'tuesday', name: 'Tuesday', short: 'Tu' },
  { id: 'wednesday', name: 'Wednesday', short: 'We' },
  { id: 'thursday', name: 'Thursday', short: 'Th' },
  { id: 'friday', name: 'Friday', short: 'Fr' },
  { id: 'saturday', name: 'Saturday', short: 'Sa' },
  { id: 'sunday', name: 'Sunday', short: 'Su' }
];

const getWorkoutForDay = (splitType: string, dayIndex: number): string => {
  switch (splitType) {
    case 'ppl':
      const pplOrder = ['Push Day', 'Pull Day', 'Leg Day'];
      return pplOrder[dayIndex % 3];
    
    case 'upper_lower':
      const ulOrder = ['Upper Body', 'Lower Body'];
      return ulOrder[dayIndex % 2];
    
    case 'full_body':
      return 'Full Body';
    
    case 'ppl_arnold':
      const arnoldOrder = ['Chest & Back', 'Shoulders & Arms', 'Leg Day'];
      return arnoldOrder[dayIndex % 3];
    
    case 'ppl_ul':
      const pplUlOrder = ['Push Day', 'Pull Day', 'Leg Day', 'Upper Body', 'Lower Body'];
      return pplUlOrder[dayIndex % 5];
    
    default:
      return 'Workout';
  }
};

export default function DaySelection({ frequency, splitType, onSelect, selectedDays }: DaySelectionProps) {
  const [selectedPattern, setSelectedPattern] = useState<'specific' | 'interval'>('specific');
  const [selectedDaysList, setSelectedDaysList] = useState<string[]>(selectedDays?.days || []);

  const handleDayToggle = (dayId: string): void => {
    let newDays: string[];
    
    if (selectedDaysList.includes(dayId)) {
      newDays = selectedDaysList.filter(d => d !== dayId);
    } else {
      if (selectedDaysList.length < frequency) {
        newDays = [...selectedDaysList, dayId];
      } else {
        return; // Max erreicht
      }
    }
    
    setSelectedDaysList(newDays);
    onSelect({ days: newDays, pattern: selectedPattern });
  };

  const handleIntervalSelect = (): void => {
    setSelectedPattern('interval');
    onSelect({ days: [], pattern: 'interval' });
  };

  const handleSpecificSelect = (): void => {
    setSelectedPattern('specific');
    onSelect({ days: selectedDaysList, pattern: 'specific' });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-dark dark:text-neutral-light">
          When do you want to train?
        </h2>
        <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-base sm:text-lg">
          Choose your training days ({frequency}x per week)
        </p>
      </div>

      {/* Pattern Selection */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
        <Card
          selected={selectedPattern === 'specific'}
          onClick={handleSpecificSelect}
          className="flex-1 max-w-xs text-center"
        >
          <h3 className="font-bold text-lg text-neutral-dark dark:text-neutral-light mb-2">
            Specific Days
          </h3>
          <p className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
            Choose specific weekdays
          </p>
        </Card>
        
        <Card
          selected={selectedPattern === 'interval'}
          onClick={handleIntervalSelect}
          className="flex-1 max-w-xs text-center"
        >
          <h3 className="font-bold text-lg text-neutral-dark dark:text-neutral-light mb-2">
            Flexible Schedule
          </h3>
          <p className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
            Train every {Math.floor(7/frequency)}-{Math.ceil(7/frequency)} days
          </p>
        </Card>
      </div>

      {/* Day Selection (only if specific pattern is selected) */}
      {selectedPattern === 'specific' && (
        <div className="space-y-4">
          {/* Mobile Layout - Stacked Cards */}
          <div className="block sm:hidden space-y-2">
            {weekDays.map((day) => {
              const isSelected = selectedDaysList.includes(day.id);
              const isDisabled = !isSelected && selectedDaysList.length >= frequency;
              const dayIndex = selectedDaysList.indexOf(day.id);
              const workoutType = isSelected && dayIndex !== -1 ? getWorkoutForDay(splitType, dayIndex) : '';
              
              return (
                <button
                  key={day.id}
                  onClick={() => handleDayToggle(day.id)}
                  disabled={isDisabled}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-primary text-white shadow-lg'
                      : isDisabled
                      ? 'bg-neutral-dark/5 dark:bg-neutral-light/5 text-neutral-dark/30 dark:text-neutral-light/30 cursor-not-allowed'
                      : 'bg-neutral-dark/10 dark:bg-neutral-light/10 text-neutral-dark dark:text-neutral-light hover:bg-neutral-dark/20 dark:hover:bg-neutral-light/20'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="font-bold text-lg">{day.name}</div>
                    {isSelected && workoutType && (
                      <div className="text-sm font-medium bg-white/20 px-2 py-1 rounded mt-1 inline-block w-fit">
                        {workoutType}
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold opacity-50">{day.short}</div>
                </button>
              );
            })}
          </div>

          {/* Desktop Layout - Grid */}
          <div className="hidden sm:grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const isSelected = selectedDaysList.includes(day.id);
              const isDisabled = !isSelected && selectedDaysList.length >= frequency;
              const dayIndex = selectedDaysList.indexOf(day.id);
              const workoutType = isSelected && dayIndex !== -1 ? getWorkoutForDay(splitType, dayIndex) : '';
              
              return (
                <button
                  key={day.id}
                  onClick={() => handleDayToggle(day.id)}
                  disabled={isDisabled}
                  className={`p-3 rounded-xl text-center transition-all duration-200 min-h-[120px] flex flex-col justify-center ${
                    isSelected
                      ? 'bg-primary text-white shadow-lg hover:cursor-pointer'
                      : isDisabled
                      ? 'bg-neutral-dark/5 dark:bg-neutral-light/5 text-neutral-dark/30 dark:text-neutral-light/30 cursor-not-allowed'
                      : 'bg-neutral-dark/10 dark:bg-neutral-light/10 text-neutral-dark dark:text-neutral-light hover:bg-neutral-dark/20 dark:hover:bg-neutral-light/20 hover:scale-105 hover:cursor-pointer'
                  }`}
                >
                  <div className="font-bold text-lg">{day.short}</div>
                  <div className="text-xs mb-1">{day.name}</div>
                  {isSelected && workoutType && (
                    <div className="text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded mt-1">
                      {workoutType.split(' ')[0]}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
              {selectedDaysList.length} of {frequency} days selected
            </p>
          </div>
        </div>
      )}

      {/* Interval Info */}
      {selectedPattern === 'interval' && (
        <div className="text-center p-6 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-2xl">
          <h3 className="font-bold text-lg text-neutral-dark dark:text-neutral-light mb-2">
            Flexible Training
          </h3>
          <p className="text-neutral-dark/70 dark:text-neutral-light/70">
            You'll train every {Math.floor(7/frequency)}-{Math.ceil(7/frequency)} days based on your schedule.
            We'll remind you when it's time for your next workout.
          </p>
        </div>
      )}
    </div>
  );
}