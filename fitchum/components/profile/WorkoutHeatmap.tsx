'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeatmapData {
  date: string;
  count: number;
}

interface WorkoutHeatmapProps {
  data: HeatmapData[];
}

export default function WorkoutHeatmap({ data }: WorkoutHeatmapProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Organisiere Daten nach Datum
  const dataMap = new Map(data.map(d => [d.date, d.count]));

  // Navigation
  const goToPreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedMonth(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedMonth(newDate);
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(new Date());
  };

  // Generiere Kalender für ausgewählten Monat
  const generateMonthCalendar = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    // Erster Tag des Monats
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Wochentag des ersten Tages (0 = Sonntag, 1 = Montag, ...)
    let startDayOfWeek = firstDay.getDay();
    // Konvertiere zu Montag = 0
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const days: (HeatmapData | null)[] = [];

    // Füge leere Tage am Anfang hinzu
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Füge alle Tage des Monats hinzu
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const count = dataMap.get(dateString) || 0;

      days.push({
        date: dateString,
        count,
      });
    }

    return days;
  };

  const calendarDays = generateMonthCalendar();

  // Farben: Grün wenn Workout, sonst grau
  const getColor = (count: number) => {
    return count > 0 ? 'bg-primary' : 'bg-muted';
  };

  // Berechne Stats für aktuellen Monat
  const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
  const monthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

  const monthData = data.filter(d => {
    const date = new Date(d.date);
    return date >= monthStart && date <= monthEnd;
  });

  const monthWorkouts = monthData.reduce((sum, d) => sum + d.count, 0);
  const monthActiveDays = monthData.filter(d => d.count > 0).length;

  // Berechne Current Streak (global)
  const currentStreak = calculateCurrentStreak(data);

  const isCurrentMonth =
    selectedMonth.getMonth() === new Date().getMonth() &&
    selectedMonth.getFullYear() === new Date().getFullYear();

  return (
    <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{monthWorkouts}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Workouts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{monthActiveDays}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Active Days</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">{currentStreak}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Streak</p>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            {selectedMonth.toLocaleDateString('de-DE', {
              month: 'long',
              year: 'numeric',
            })}
          </h3>
          {!isCurrentMonth && (
            <button
              onClick={goToCurrentMonth}
              className="text-xs text-primary hover:underline mt-1"
            >
              Zurück zu heute
            </button>
          )}
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div>
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const date = new Date(day.date);
            const isToday =
              date.toDateString() === new Date().toDateString();

            return (
              <div
                key={day.date}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:ring-2 hover:ring-primary ${getColor(
                  day.count
                )} ${isToday ? 'ring-2 ring-primary' : ''}`}
                title={`${date.getDate()}. ${date.toLocaleDateString('de-DE', {
                  month: 'short',
                })}: ${day.count} workout${day.count !== 1 ? 's' : ''}`}
              >
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    day.count > 0 ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {date.getDate()}
                </span>
                {day.count > 0 && (
                  <span className="text-[10px] text-accent-foreground font-bold">
                    {day.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// Helper: Berechne Current Streak
function calculateCurrentStreak(data: HeatmapData[]): number {
  const sortedData = [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const day of sortedData) {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === streak && day.count > 0) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
}
