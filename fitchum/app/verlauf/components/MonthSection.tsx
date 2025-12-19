'use client';

interface MonthSectionProps {
  month: string;
  year: number;
  workoutCount: number;
  children: React.ReactNode;
}

export default function MonthSection({
  month,
  year,
  workoutCount,
  children,
}: MonthSectionProps) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground">
          {month} {year}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {workoutCount} {workoutCount === 1 ? 'Workout' : 'Workouts'}
        </p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
