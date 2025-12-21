import { CheckCircle, Users, TrendingUp, Dumbbell, Clock, Flame } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

// Phone Frame Component
function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-[280px]">
      <div className="relative bg-foreground rounded-[2.5rem] p-3 shadow-2xl">
        <div className="bg-background rounded-[2rem] overflow-hidden aspect-[9/16]">
          {/* Status Bar */}
          <div className="h-6 bg-muted/50 flex items-center justify-between px-6 text-xs text-muted-foreground">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-3 border border-current rounded-sm" />
            </div>
          </div>
          {/* Screen Content */}
          <div className="h-[calc(100%-1.5rem)] overflow-hidden">
            {children}
          </div>
        </div>
        {/* Camera Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-foreground rounded-b-2xl" />
      </div>
    </div>
  );
}

// Screen 1: Workout Check-In Success
function CheckInScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-gradient-to-b from-success/5 to-background">
      <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
        <CheckCircle className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">
        Workout Complete!
      </h2>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Leg Day • 45 min
      </p>
      <Badge variant="success" className="mb-6 text-xs">
        +5 Day Streak
      </Badge>
      <div className="w-full space-y-2 mb-4">
        <Button variant="success" size="sm" className="w-full">
          Share Workout
        </Button>
        <Button variant="outline" size="sm" className="w-full text-xs">
          Add Details
        </Button>
      </div>
      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Flame className="w-3 h-3" />
          <span>250 cal</span>
        </div>
        <div className="flex items-center gap-1">
          <Dumbbell className="w-3 h-3" />
          <span>8 exercises</span>
        </div>
      </div>
    </div>
  );
}

// Screen 2: Social Feed
function FeedScreen() {
  return (
    <div className="h-full p-4 overflow-hidden">
      <h3 className="text-lg font-bold text-foreground mb-3">
        Heute am trainieren
      </h3>
      <div className="space-y-2">
        <Card className="p-3 border border-muted">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20" />
            <div className="flex-1">
              <p className="text-xs font-semibold">Max M.</p>
              <p className="text-[10px] text-muted-foreground">vor 5 min</p>
            </div>
            <Badge variant="default" className="text-[10px] px-1.5 py-0.5">
              Push
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Bench Press • 5x5
          </p>
        </Card>

        <Card className="p-3 border border-muted">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent/20" />
            <div className="flex-1">
              <p className="text-xs font-semibold">Sarah K.</p>
              <p className="text-[10px] text-muted-foreground">vor 12 min</p>
            </div>
            <Badge variant="warning" className="text-[10px] px-1.5 py-0.5">
              Cardio
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            5K Run • 28:30
          </p>
        </Card>

        <Card className="p-3 border border-muted">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-success/20" />
            <div className="flex-1">
              <p className="text-xs font-semibold">Tom B.</p>
              <p className="text-[10px] text-muted-foreground">vor 1 Std</p>
            </div>
            <Badge variant="success" className="text-[10px] px-1.5 py-0.5">
              Legs
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Squat Day 💪
          </p>
        </Card>
      </div>
      <div className="mt-4">
        <Button variant="primary" size="sm" className="w-full text-xs">
          Start Workout
        </Button>
      </div>
    </div>
  );
}

// Screen 3: Progress & Achievement
function ProgressScreen() {
  return (
    <div className="flex flex-col h-full p-4 bg-gradient-to-b from-accent/5 to-background">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">
          Deine Stats
        </h3>
        <Badge variant="success" className="text-[10px] px-1.5 py-0.5">
          New PR!
        </Badge>
      </div>

      <Card className="p-4 mb-3 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Deadlift PR</p>
            <p className="text-2xl font-bold text-foreground">120kg</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">
          +10kg from last month
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <Card className="p-3 border border-muted">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-warning" />
            <p className="text-xs font-semibold">Streak</p>
          </div>
          <p className="text-xl font-bold text-foreground">12</p>
          <p className="text-[9px] text-muted-foreground">days</p>
        </Card>

        <Card className="p-3 border border-muted">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold">Total</p>
          </div>
          <p className="text-xl font-bold text-foreground">24h</p>
          <p className="text-[9px] text-muted-foreground">this month</p>
        </Card>
      </div>

      <Button variant="accent" size="sm" className="w-full text-xs mt-auto">
        Share Achievement
      </Button>
    </div>
  );
}

export default function AppPreviewSection() {
  return (
    <section className="w-full py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sneak Peek
          </h2>
          <p className="text-muted-foreground text-lg">
            So wird FitChumm aussehen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <PhoneMockup>
              <CheckInScreen />
            </PhoneMockup>
            <p className="text-sm font-medium text-foreground mt-4">
              Workout Check-In
            </p>
          </div>

          <div className="flex flex-col items-center">
            <PhoneMockup>
              <FeedScreen />
            </PhoneMockup>
            <p className="text-sm font-medium text-foreground mt-4">
              Social Feed
            </p>
          </div>

          <div className="flex flex-col items-center">
            <PhoneMockup>
              <ProgressScreen />
            </PhoneMockup>
            <p className="text-sm font-medium text-foreground mt-4">
              Progress & PRs
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Dies sind frühe Konzepte. Die finale App wird noch cooler!
          </p>
        </div>
      </div>
    </section>
  );
}
