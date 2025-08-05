# FitChum - Social Fitness Accountability Platform

## Project Overview
FitChum is a social accountability platform for fitness enthusiasts who struggle with consistency and motivation. The platform allows users to log their workouts, share progress with a community, and stay motivated through social support.

**Core Value Proposition:** Achieve your fitness goals with the power of social accountability.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Authentication:** Clerk
- **Database:** Supabase
- **Deployment:** Vercel
- **Payment:** Stripe (for subscriptions)

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

## Core Features (MVP)
1. **User Authentication** - Registration/Login via Clerk
2. **Daily Journal Entries** - Log workouts with notes
3. **Community Feed** - View other users' entries
4. **Social Interactions** - Like and comment on entries
5. **Basic Goal Setting** - Set and track fitness goals
6. **User Profiles** - Basic profile with workout history


## Page Structure
- `/` - Landing page (later)
- `/dashboard` - Main user dashboard
- `/profile` - User profile page
- `/journal/new` - Create new journal entry
- `/journal/[id]` - View specific entry
- `/social` - Community feed
- `/profile` - User settings
- `/pricing` - Subscription plans

## Component Architecture
```
components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── ...
├── layout/
│   ├── Header.tsx
│   ├── Navigation.tsx
│   └── Footer.tsx
├── journal/
│   ├── EntryCard.tsx
│   ├── EntryForm.tsx
│   └── EntryFeed.tsx
└── user/
    ├── UserProfile.tsx
    └── UserStats.tsx
    .
    .
    .
```

## Pricing Strategy
- **Basic:** Free - Daily Journals, Gym Plan, Leaderboard
- **Pro:** 10€ - Add Friends, Custom Friends Leaderboards, Custom Challenges

## Development Phases

### Phase 1: MVP Dashboard (Week 1)
- [ ] Set up Next.js project with Tailwind
- [ ] Implement supabase authentication
- [ ] Set up Supabase database
- [ ] Create basic dashboard layout
- [ ] Build journal entry form
- [ ] Display user's own entries
- [ ] Integrate Payment with Stripe
- [ ] Leaderboard and add Friends + Friends Leaderboard

### Phase 2: Social Features (Week 2)
- [ ] Community feed
- [ ] Like/comment system
- [ ] User profiles
- [ ] Basic goal setting

### Phase 3: Polish & Launch (Week 3)
- [ ] Responsive design improvements
- [ ] Error handling
- [ ] Loading states
- [ ] Basic analytics
- [ ] Deployment setup

### Phase 4: Monetization (Week 4)
- [ ] Stripe integration
- [ ] Subscription plans
- [ ] Landing page
- [ ] Marketing site

## Environment Variables
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
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

## Future Features (Post-Launch)
- Mobile app
- Workout templates
- Progress photos
- Achievement system
- Group challenges
- Integration with fitness trackers