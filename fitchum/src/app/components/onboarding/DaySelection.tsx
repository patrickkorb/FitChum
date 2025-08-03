"use client"
import { useState } from 'react';
import Card from '../ui/Card';

export interface SelectedDays {
  days: string[];
  pattern?: 'specific' | 'interval';
}

interface DaySelectionProps {
  frequency: number;
  onSelect: (selection: SelectedDays) => void;
  selectedDays?: SelectedDays;
}

const weekDays = [
  { id: 'monday', name: 'Montag', short: 'Mo' },
  { id: 'tuesday', name: 'Dienstag', short: 'Di' },
  { id: 'wednesday', name: 'Mittwoch', short: 'Mi' },
  { id: 'thursday', name: 'Donnerstag', short: 'Do' },
  { id: 'friday', name: 'Freitag', short: 'Fr' },
  { id: 'saturday', name: 'Samstag', short: 'Sa' },
  { id: 'sunday', name: 'Sonntag', short: 'So' }
];

export default function DaySelection({ frequency, onSelect, selectedDays }: DaySelectionProps) {
  const [selectedPattern, setSelectedPattern] = useState<'specific' | 'interval'>('specific');
  const [selectedDaysList, setSelectedDaysList] = useState<string[]>(selectedDays?.days || []);

  const handleDayToggle = (dayId: string) => {
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

  const handleIntervalSelect = () => {
    setSelectedPattern('interval');
    onSelect({ days: [], pattern: 'interval' });
  };

  const handleSpecificSelect = () => {
    setSelectedPattern('specific');
    onSelect({ days: selectedDaysList, pattern: 'specific' });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-neutral-dark dark:text-neutral-light">
          Wann möchtest du trainieren?
        </h2>
        <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-lg">
          Wähle deine Trainingstage ({frequency}x pro Woche)
        </p>
      </div>

      {/* Pattern Selection */}
      <div className="flex gap-4 justify-center">
        <Card
          selected={selectedPattern === 'specific'}
          onClick={handleSpecificSelect}
          className="flex-1 max-w-xs text-center"
        >
          <h3 className="font-bold text-lg text-neutral-dark dark:text-neutral-light mb-2">
            Feste Tage
          </h3>
          <p className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
            Wähle spezifische Wochentage
          </p>
        </Card>
        
        <Card
          selected={selectedPattern === 'interval'}
          onClick={handleIntervalSelect}
          className="flex-1 max-w-xs text-center"
        >
          <h3 className="font-bold text-lg text-neutral-dark dark:text-neutral-light mb-2">
            Flexible Intervalle
          </h3>
          <p className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
            Alle {Math.floor(7/frequency)} Tage trainieren
          </p>
        </Card>
      </div>

      {/* Day Selection (only if specific pattern is selected) */}
      {selectedPattern === 'specific' && (
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const isSelected = selectedDaysList.includes(day.id);
              const isDisabled = !isSelected && selectedDaysList.length >= frequency;
              
              return (
                <button
                  key={day.id}
                  onClick={() => handleDayToggle(day.id)}
                  disabled={isDisabled}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary text-white shadow-lg hover:cursor-pointer'
                      : isDisabled
                      ? 'bg-neutral-dark/5 dark:bg-neutral-light/5 text-neutral-dark/30 dark:text-neutral-light/30 cursor-not-allowed'
                      : 'bg-neutral-dark/10 dark:bg-neutral-light/10 text-neutral-dark dark:text-neutral-light hover:bg-neutral-dark/20 dark:hover:bg-neutral-light/20 hover:scale-105 hover:cursor-pointer'
                  }`}
                >
                  <div className="font-bold text-lg">{day.short}</div>
                  <div className="text-xs">{day.name}</div>
                </button>
              );
            })}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
              {selectedDaysList.length} von {frequency} Tagen ausgewählt
            </p>
          </div>
        </div>
      )}

      {/* Interval Info */}
      {selectedPattern === 'interval' && (
        <div className="text-center p-6 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-2xl">
          <h3 className="font-bold text-lg text-neutral-dark dark:text-neutral-light mb-2">
            Flexibles Training
          </h3>
          <p className="text-neutral-dark/70 dark:text-neutral-light/70">
            Du trainierst alle {Math.floor(7/frequency)}-{Math.ceil(7/frequency)} Tage, je nachdem wie es in deinen Zeitplan passt.
            Wir erinnern dich daran, wenn es Zeit für das nächste Training ist.
          </p>
        </div>
      )}
    </div>
  );
}