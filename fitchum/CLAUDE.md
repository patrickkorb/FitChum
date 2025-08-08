# FitChum - Social Fitness Accountability Platform

## Project Overview
FitChum is a social accountability platform for fitness enthusiasts who struggle with consistency and motivation. The platform allows users to create personalized workout plans, log their daily workouts with detailed tracking, share progress with a community through social feeds and leaderboards, and stay motivated through streak tracking and social accountability.

**Core Value Proposition:** Achieve your fitness goals with the power of social accountability, personalized workout plans, and community support.

## Tech Stack
- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Supabase Auth (using email/password)
- **Database:** Supabase PostgreSQL
- **Deployment:** Vercel
- **Payment:** Stripe (for subscriptions)
- **Theme:** next-themes for dark/light mode support

## Brand Guidelines
- **Primary Color:** #4CAF50 (Green)
- **Secondary Color:** #FF9800 (Orange)
- **Accent Color:** #2196F3 (Blue)
- **Typography:** Roboto
- **Tone:** Encouraging, friendly, approachable

## Target Audience
- Digital Marketing Specialists
- Small Business Owners
- University Students
- Pain Points: Lack of motivation, need for community support, inconsistent workout habits

## Core Features (Implemented)
1. **User Authentication** - Registration/Login via Supabase Auth
2. **Personalized Workout Plans** - Create custom workout splits (PPL, Upper/Lower, PPL x Arnold, PPL x UL, 7-day options)
3. **Workout Scheduling** - Smart day assignment showing specific workout types per day
4. **Daily Workout Logging** - Modal-based workout logging with optional notes, duration, and difficulty rating
5. **Streak Tracking** - Automatic streak calculation and milestone achievements  
6. **Social Leaderboard** - View top users by workout streak (All users + Friends for Pro)
7. **Activity Feed** - Real-time updates of community workout activity (All users + Friends for Pro)
8. **User Profiles** - Comprehensive profiles with theme settings, subscription status, and workout history
9. **Subscription System** - Free vs Pro tiers with feature gating
10. **Responsive Design** - Mobile-first design with dark/light mode support


## Page Structure
- `/dashboard` - Main user dashboard with today's workout and quick stats
- `/plan` - Workout plan creation and weekly schedule view
- `/journal` - Daily workout logging with modal interface
- `/social` - Community leaderboard and activity feed
- `/profile` - User profile settings, theme toggle, subscription management
- `/pricing` - Subscription plans (Pro features)

## Component Architecture
```
components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── layout/
│   ├── Navigation.tsx (bottom mobile nav)
│   └── ConditionalLayout.tsx (auth wrapper)
├── onboarding/
│   ├── PlanTypeSelection.tsx
│   ├── FrequencySelection.tsx
│   └── DaySelection.tsx (with workout type preview)
├── social/
│   ├── Leaderboard.tsx (with Pro gating)
│   └── ActivityFeed.tsx (with Pro gating and real-time updates)
├── journal/
│   └── WorkoutLogModal.tsx (complete logging interface)
└── plan/
    └── WorkoutPlanView.tsx (weekly schedule display)
```

## Pricing Strategy
- **Basic:** Free - Daily Journals, Gym Plan, Leaderboard
- **Pro:** 10€ - Add Friends, Custom Friends Leaderboards, Custom Challenges

## Development Progress

### Phase 1: MVP Core Features ✅ COMPLETED
- [x] Set up Next.js project with Tailwind CSS
- [x] Implement Supabase authentication (email/password)
- [x] Set up Supabase database with comprehensive schema
- [x] Create responsive dashboard layout with mobile navigation
- [x] Build workout plan onboarding system
- [x] Implement workout scheduling and day assignment
- [x] Create workout logging modal with detailed tracking
- [x] Social leaderboard with streak tracking
- [x] Real-time activity feed with live updates
- [x] User profiles with theme management
- [x] Pro subscription tier with feature gating

### Phase 2: Advanced Features (NEXT PRIORITY)
- [ ] Friend system (add/remove friends)
- [ ] Enhanced workout templates with exercise details
- [ ] Workout history and progress tracking
- [ ] Push notifications for streak reminders
- [ ] Goal setting and achievement system

### Phase 3: Polish & Launch
- [ ] Enhanced error handling and user feedback
- [ ] Performance optimizations
- [ ] SEO optimization
- [ ] Landing page design
- [ ] Marketing site

### Phase 4: Post-Launch Features
- [ ] Stripe payment integration
- [ ] Mobile app (React Native)
- [ ] Workout photo uploads
- [ ] Social challenges and competitions
- [ ] Integration with fitness trackers

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Getting Started
```bash
# Clone and setup
git clone <repo-url>
cd fitchum
npm install

# Environment setup
cp .env.example .env.local
# Fill in your environment variables

# Run development server
npm run dev
```

## Key Design Principles
- **Mobile First:** Design for mobile, enhance for desktop
- **Simple & Clean:** Avoid feature bloat, focus on core value
- **Social First:** Community aspect should be prominent
- **Motivational:** Use encouraging language and positive reinforcement
- **Fast & Responsive:** Quick loading, smooth interactions
- **Dark and White Mode:** Always design for dark and white mode. Respect already designed pages and components.

## Success Metrics
- Daily Active Users (DAU)
- Journal Entries per user per week
- Community engagement (likes, comments)
- User retention (7-day, 30-day)
- Subscription conversion rate
- Monthly Recurring Revenue (MRR)

## Database Schema
The application uses Supabase with the following key tables:

### Core Tables
- **profiles** - User profile data, streak tracking, subscription status
- **workout_plans** - User's selected workout split and schedule preferences  
- **workout_schedule** - Daily workout assignments (Push, Pull, Legs, etc.)
- **journal_entries** - Daily workout logs with notes, duration, difficulty
- **activity_logs** - Social activity feed data (workout logged, streaks, etc.)
- **friendships** - User friend relationships (for Pro features)
- **workout_templates** - Exercise templates for different workout types

### Key Features
- Row Level Security (RLS) policies for data protection
- Real-time subscriptions for live activity updates
- Automatic streak calculation with milestone tracking
- Foreign key relationships ensuring data integrity

## Database Migration Files
- `workout_plans_migration.sql` - Complete schema setup
- `journal_entries_migration.sql` - Workout logging table

## Future Features (Post-Launch)
- Enhanced workout templates with exercise videos
- Progress photo uploads and before/after comparisons
- Achievement badges and milestone rewards
- Group challenges and leaderboards
- Integration with fitness trackers (Apple Health, Google Fit)
- Nutrition tracking integration
- Personal trainer matching system