# Project Context for Claude Code

## App Concept: FitChumm

**FitChum** is a social fitness app inspired by BeReal's authentic, community-driven approach. The core mission is to motivate people to go to the gym through social accountability and friendly competition.

### Core Features:
1. **Daily Workout Feed** - See what your friends are training today in real-time
2. **Workout Check-Ins** - Log when you complete a workout, notify your friends automatically
3. **Social Motivation** - Push/encourage friends to work out
4. **Flexing Achievements** - Share specific accomplishments:
   - New Personal Records (PRs)
   - Workout streaks
   - Exercise milestones
5. **Community Accountability** - BeReal-style authenticity for fitness

### User Flow:
1. User completes workout → Check-in via app
2. Friends receive notification: "X just crushed their workout!"
3. Friends can react, comment, or get motivated to work out themselves
4. Users can selectively share achievements (PRs, milestones) to their feed
5. Daily feed shows friends' activities, creating FOMO and motivation

### Design Principles:
- **Authentic & Raw** - Like BeReal, no filters or fake perfection
- **Community First** - Social features are the core motivator
- **Simple & Fast** - Quick check-ins, minimal friction
- **Motivating** - Energetic colors, positive reinforcement

---

## Tech Stack
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Package Manager:** npm

## Project Structure
```
/app                 # Next.js App Router pages
/components
  /ui               # Reusable UI components (Button, Input, Form, etc.)
  /sections         # Page-specific sections (Hero, Features, etc.)
  /layout           # Layout components (Header, Footer, Sidebar)
/lib                # Utility functions and helpers
/types              # TypeScript type definitions
/public             # Static assets
```

## Coding Standards

### 1. Color System
- **NEVER use hard-coded colors** (e.g., `bg-blue-500`, `text-red-600`)
- All colors must be defined as CSS variables in `app/globals.css`
- Use semantic color names in Tailwind config

**FitChum Color Palette:**
- **Primary** - Energetic Orange/Coral (`--primary`) - for motivation, action buttons, CTAs
- **Accent** - Fresh Teal/Green (`--accent`) - for achievements, success states
- **Success** - Same as accent (`--success`) - for PRs, milestones, completed workouts
- **Warning** - Energetic Yellow (`--warning`) - for streaks, notifications
- **Background/Foreground** - Clean Black/White - BeReal-style minimalism

**globals.css structure:**
```css
@layer base {
  :root {
    --primary: 15 85% 58%;         /* Energetic Orange/Coral */
    --primary-foreground: 0 0% 100%;
    --accent: 160 75% 50%;         /* Fresh Teal/Green */
    --accent-foreground: 0 0% 100%;
    --success: 160 75% 50%;        /* Success/Achievements */
    --warning: 45 95% 60%;         /* Streaks/Notifications */
    --background: 0 0% 100%;
    --foreground: 0 0% 10%;
    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 45%;
  }
}
```

**Usage in components:**
```tsx
<div className="bg-primary text-primary-foreground">      {/* Main actions */}
<button className="bg-accent hover:bg-accent/90">        {/* Success states */}
<div className="bg-success text-success-foreground">     {/* PRs, achievements */}
<span className="bg-warning text-warning-foreground">    {/* Streaks */}
```

### 2. Component Architecture

#### UI Components (`/components/ui`)
- Create reusable, atomic UI components
- Each component in its own file
- Export as default
- Use TypeScript interfaces for props

**Required UI components:**
- `Button.tsx` - All button variations
- `Input.tsx` - Form inputs
- `Form.tsx` - Form wrapper with validation
- `Card.tsx` - Content cards
- `Badge.tsx` - Status badges
- `Modal.tsx` - Modal dialogs
- ... (add as needed)

**Example Button component:**
```tsx
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  children,
  className,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        size === 'md' && 'px-4 py-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### Section Components (`/components/sections`)
- Break down pages into logical sections
- Each section is a separate component
- Maximum ~150-200 lines per component
- Name components descriptively (e.g., `HeroSection.tsx`, `FeaturesGrid.tsx`)

**Example structure for landing page:**
```tsx
// app/page.tsx
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import PricingSection from '@/components/sections/PricingSection';
import CTASection from '@/components/sections/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
    </>
  );
}
```

### 3. Next.js Components - ALWAYS USE THESE

**Navigation:**
```tsx
import Link from 'next/link';
// ✅ DO: <Link href="/about">About</Link>
// ❌ DON'T: <a href="/about">About</a>
```

**Images:**
```tsx
import Image from 'next/image';
// ✅ DO: <Image src="/logo.png" alt="Logo" width={200} height={50} />
// ❌ DON'T: <img src="/logo.png" alt="Logo" />
```

**Other Next.js components to use:**
- `next/font` for font optimization
- `next/script` for third-party scripts
- `next/headers` for server-side headers/cookies

### 4. Code Organization Rules

#### Component Size Limits
- **Maximum 200 lines per component**
- If a component exceeds this, break it into smaller components
- Extract complex logic into custom hooks (`/hooks` folder)

#### File Structure
```tsx
// 1. Imports (grouped: React, Next, external, internal)
import { useState } from 'react';
import Link from 'next/link';
import { someLibrary } from 'external-package';
import Button from '@/components/ui/Button';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
}

// 3. Component
export default function Component({ title }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Functions
  const handleClick = () => {};
  
  // 6. Render
  return <div>...</div>;
}
```

#### Naming Conventions
- **Components:** PascalCase (`Button.tsx`, `HeroSection.tsx`)
- **Utilities:** camelCase (`formatDate.ts`, `apiClient.ts`)
- **Constants:** UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Types:** PascalCase with clear names (`UserProfile`, `ApiResponse`)

### 5. Best Practices

#### TypeScript
- Always define prop interfaces
- Avoid `any` type - use `unknown` if type is truly unknown
- Use type inference where obvious
- Define return types for functions

#### Performance
- Use `'use client'` only when necessary
- Prefer Server Components by default
- Lazy load heavy components with `next/dynamic`
- Optimize images with Next.js Image component

#### Accessibility
- Always include `alt` text for images
- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works

#### Styling
- Use Tailwind utility classes
- For complex/repeated patterns, extract to components
- Use `cn()` utility for conditional classes (from `clsx` + `tailwind-merge`)

## Code Generation Guidelines for Claude

When creating new components:
1. ✅ Always use TypeScript with proper interfaces
2. ✅ Use UI components from `/components/ui` instead of native HTML
3. ✅ Use Next.js components (`Link`, `Image`, etc.)
4. ✅ Apply color system (CSS variables, not hard-coded colors)
5. ✅ Keep components under 200 lines - break into smaller pieces if needed
6. ✅ Use semantic, descriptive names
7. ✅ Add proper TypeScript types for all props
8. ✅ Include error handling and loading states where appropriate

When modifying existing code:
1. ✅ Maintain existing patterns and structure
2. ✅ Refactor if component exceeds size limits
3. ✅ Replace hard-coded colors with CSS variables
4. ✅ Replace native HTML with Next.js components if found
5. ✅ Replace native HTML elements with UI components if found

## Common Patterns

### Form Handling
```tsx
'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle submission
    setIsSubmitting(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="email" placeholder="Email" required />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Submit'}
      </Button>
    </form>
  );
}
```

### Data Fetching (Server Component)
```tsx
// app/blog/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();
  
  return (
    <div className="container mx-auto">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## Questions to Ask Before Starting

If requirements are unclear, ask:
- Should this be a Server or Client Component?
- What interactions/state management is needed?
- Are there any existing similar components to reuse?
- What's the expected data structure?
- Any specific accessibility requirements?

---

**Remember:** Clean, maintainable, component-based architecture is the priority. If in doubt, break it down into smaller pieces!
- Always use Lucid Icons instead of Emojis