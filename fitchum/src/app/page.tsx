'use client';

import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import ActivityFeed from '@/app/components/social/ActivityFeed';
import { 
  Trophy, 
  Calendar, 
  Users, 
  TrendingUp, 
  Target, 
  Zap,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Heart,
  PlayCircle
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  const handleSeeHowItWorks = () => {
    // Scroll to the features section
    document.getElementById('features-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="w-full py-4 px-6 lg:px-8 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">FitChum</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/auth/login')} className="hidden sm:flex">
              Sign In
            </Button>
            <Button onClick={handleGetStarted} className="bg-green-500 hover:bg-green-600 text-white">
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full min-h-[90vh] bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight mb-6">
                Finally Achieve your
                <span className="block bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  Dream Body
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed max-w-xl">
                Track your gym sessions, build unbreakable streaks, and compete with friends. 
                The only fitness app that actually keeps you consistent.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Start Building Streaks
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleSeeHowItWorks}
                  className="px-10 py-5 text-xl rounded-xl border-2"
                >
                  <PlayCircle className="mr-3 w-6 h-6" />
                  See How It Works
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-500">2.5K+</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-500">150K+</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Workouts Logged</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500">87%</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Hit Their Goals</div>
                </div>
              </div>
            </div>

            {/* Right Column - Live App Preview */}
            <div className="relative">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    Live Community Feed
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    See what other users are doing right now
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-lg flex items-center gap-2 mb-6">
                    <Heart className="w-5 h-5 text-red-500" />
                    Recent Activity
                  </h4>
                  <div className="h-96 overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-800 p-4">
                    <ActivityFeed currentUserId={null} hideFriendsTab={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="w-full py-24 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Built for Real Gym-Goers
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              No BS features. Just what you need to track workouts, stay consistent, and compete with friends.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Smart Workout Plans",
                description: "PPL, Upper/Lower, or Full Body splits. Choose your days, we handle the rest.",
                color: "bg-blue-500"
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Intelligent Streaks",
                description: "Counts your workout days, ignores rest days. Finally, streaks that make sense.",
                color: "bg-yellow-500"
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Quick Logging",
                description: "Log workouts in 10 seconds. Add notes, duration, and difficulty if you want.",
                color: "bg-green-500"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Friend Competition",
                description: "Add friends, compete on leaderboards. Make workouts competitive and fun.",
                color: "bg-purple-500"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Progress Tracking",
                description: "See your consistency over time. Heatmaps, workout stats, and trends.",
                color: "bg-orange-500"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Stay Motivated",
                description: "Real-time activity feed. See when friends hit the gym and celebrate wins.",
                color: "bg-red-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800 hover:bg-white dark:hover:bg-neutral-700 transition-all duration-300 hover:shadow-xl border border-transparent hover:border-neutral-200 dark:hover:border-neutral-600">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="w-full py-24 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Stop Making Excuses.<br />Start Building Habits. <br/>Become the person you want to be.
          </h2>
          <div className="flex justify-center mt-12">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-12 py-6 text-xl font-bold rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all"
            >
              <Zap className="mr-3 w-6 h-6" />
              Get Started - It&apos;s Free
            </Button>
          </div>
          <p className="text-sm text-neutral-400 mt-4">
            No credit card required • Start tracking in 30 seconds
          </p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="w-full py-8 bg-neutral-950 text-neutral-400 text-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-bold text-white">FitChum</span>
          </div>
          <p className="text-sm">
            &copy; 2025h FitChum. The fitness app that actually works.
          </p>
        </div>
      </footer>
    </div>
  );
}