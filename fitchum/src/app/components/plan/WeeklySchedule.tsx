"use client"
import Card from '../ui/Card';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

interface WorkoutDay {
  day: string;
  name: string;
  type: string;
  duration: number;
  completed: boolean;
  isToday: boolean;
  isRestDay: boolean;
}

interface WeeklyScheduleProps {
  schedule: WorkoutDay[];
  onDayClick: (day: WorkoutDay) => void;
}

const weekDays: string[] = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export default function WeeklySchedule({ schedule, onDayClick }: WeeklyScheduleProps) {
  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Calendar className="text-primary" size={24} />
          <h3 className="text-xl font-bold text-neutral-dark dark:text-neutral-light">
            Wochenplan
          </h3>
        </div>

        {/* Weekly Grid - Mobile: 3.5 columns, Desktop: 7 columns */}
        <div className="block">
          {/* Mobile Layout */}
          <div className="sm:hidden space-y-3">
            {schedule.map((day, index) => (
              <div
                key={day.day}
                onClick={() => !day.isRestDay && onDayClick(day)}
                className={`relative p-4 rounded-xl transition-all duration-200 flex items-center gap-4 ${
                  day.isRestDay
                    ? 'bg-neutral-dark/5 dark:bg-neutral-light/5 cursor-default'
                    : day.isToday
                    ? 'bg-primary text-white shadow-lg cursor-pointer hover:scale-105'
                    : day.completed
                    ? 'bg-primary/20 border-2 border-primary cursor-pointer hover:scale-105'
                    : 'bg-neutral-dark/10 dark:bg-neutral-light/10 cursor-pointer hover:bg-neutral-dark/20 dark:hover:bg-neutral-light/20 hover:scale-105'
                }`}
              >
                {/* Day indicator */}
                <div className="text-center min-w-[60px]">
                  <div className={`text-sm font-medium mb-1 ${
                    day.isToday 
                      ? 'text-white' 
                      : day.isRestDay
                      ? 'text-neutral-dark/40 dark:text-neutral-light/40'
                      : 'text-neutral-dark/70 dark:text-neutral-light/70'
                  }`}>
                    {weekDays[index]}
                  </div>
                  <div className={`text-xl font-bold ${
                    day.isToday 
                      ? 'text-white' 
                      : day.isRestDay
                      ? 'text-neutral-dark/40 dark:text-neutral-light/40'
                      : 'text-neutral-dark dark:text-neutral-light'
                  }`}>
                    {new Date(2024, 0, 1 + index).getDate()}
                  </div>
                </div>

                {/* Workout info or rest day */}
                {day.isRestDay ? (
                  <div className="flex-1">
                    <div className={`text-lg font-medium ${
                      day.isToday ? 'text-white/90' : 'text-neutral-dark/60 dark:text-neutral-light/60'
                    }`}>
                      Ruhetag
                    </div>
                    <div className={`text-sm ${
                      day.isToday ? 'text-white/70' : 'text-neutral-dark/50 dark:text-neutral-light/50'
                    }`}>
                      Erhol dich gut!
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className={`text-lg font-medium mb-1 ${
                      day.isToday ? 'text-white/90' : 'text-neutral-dark/80 dark:text-neutral-light/80'
                    }`}>
                      {day.name}
                    </div>
                    <div className={`text-sm flex items-center gap-2 ${
                      day.isToday ? 'text-white/70' : 'text-neutral-dark/60 dark:text-neutral-light/60'
                    }`}>
                      <Clock size={14} />
                      {day.duration} Minuten
                    </div>
                  </div>
                )}

                {/* Status indicators */}
                {!day.isRestDay && (
                  <>
                    {day.completed && (
                      <div className="flex-shrink-0">
                        <div className="bg-primary text-white rounded-full p-2">
                          <CheckCircle size={20} />
                        </div>
                      </div>
                    )}
                    
                    {day.isToday && !day.completed && (
                      <div className="flex-shrink-0">
                        <div className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:grid sm:grid-cols-7 gap-2">
            {schedule.map((day, index) => (
              <div
                key={day.day}
                onClick={() => !day.isRestDay && onDayClick(day)}
                className={`relative p-4 rounded-xl transition-all duration-200 min-h-[120px] ${
                  day.isRestDay
                    ? 'bg-neutral-dark/5 dark:bg-neutral-light/5 cursor-default'
                    : day.isToday
                    ? 'bg-primary text-white shadow-lg cursor-pointer hover:scale-105'
                    : day.completed
                    ? 'bg-primary/20 border-2 border-primary cursor-pointer hover:scale-105'
                    : 'bg-neutral-dark/10 dark:bg-neutral-light/10 cursor-pointer hover:bg-neutral-dark/20 dark:hover:bg-neutral-light/20 hover:scale-105'
                }`}
              >
                {/* Day indicator */}
                <div className="text-center mb-3">
                  <div className={`text-xs font-medium mb-1 ${
                    day.isToday 
                      ? 'text-white' 
                      : day.isRestDay
                      ? 'text-neutral-dark/40 dark:text-neutral-light/40'
                      : 'text-neutral-dark/70 dark:text-neutral-light/70'
                  }`}>
                    {weekDays[index]}
                  </div>
                  <div className={`text-lg font-bold ${
                    day.isToday 
                      ? 'text-white' 
                      : day.isRestDay
                      ? 'text-neutral-dark/40 dark:text-neutral-light/40'
                      : 'text-neutral-dark dark:text-neutral-light'
                  }`}>
                    {new Date(2024, 0, 1 + index).getDate()}
                  </div>
                </div>

                {/* Workout info or rest day */}
                {day.isRestDay ? (
                  <div className="text-center">
                    <div className="text-xs text-neutral-dark/40 dark:text-neutral-light/40">
                      Ruhetag
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center space-y-2">
                      <div className={`text-xs font-medium ${
                        day.isToday ? 'text-white/90' : 'text-neutral-dark/80 dark:text-neutral-light/80'
                      }`}>
                        {day.name}
                      </div>
                      <div className={`text-xs flex items-center justify-center gap-1 ${
                        day.isToday ? 'text-white/70' : 'text-neutral-dark/60 dark:text-neutral-light/60'
                      }`}>
                        <Clock size={10} />
                        {day.duration}min
                      </div>
                    </div>

                    {/* Status indicators */}
                    {day.completed && (
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-primary text-white rounded-full p-1">
                          <CheckCircle size={12} />
                        </div>
                      </div>
                    )}
                    
                    {day.isToday && !day.completed && (
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-secondary text-white rounded-full w-3 h-3 animate-pulse"></div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-neutral-dark/70 dark:text-neutral-light/70">Heute</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/20 border-2 border-primary rounded-full"></div>
            <span className="text-neutral-dark/70 dark:text-neutral-light/70">Abgeschlossen</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-full"></div>
            <span className="text-neutral-dark/70 dark:text-neutral-light/70">Geplant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-full"></div>
            <span className="text-neutral-dark/70 dark:text-neutral-light/70">Ruhetag</span>
          </div>
        </div>
      </div>
    </Card>
  );
}