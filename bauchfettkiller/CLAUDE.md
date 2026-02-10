# Project Context for Claude Code

## Tech Stack
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Package Manager:** npm/pnpm (specify which you prefer)

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
- **NEVER use hard-coded Tailwind colors** (e.g., `bg-blue-500`, `text-red-600`)
- All colors MUST be defined in `app/globals.css` using the `@theme inline` directive
- Use semantic color names that reflect their purpose

**globals.css structure:**
```css
@theme inline {
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-primary: #61ced8;
  --color-secondary: #005072;
  --color-paragraph: #202020;
  --color-muted: #f5f5f5;
  --color-muted-foreground: #6b7280;
  --color-accent: #your-accent-color;
  --color-border: #e5e7eb;
  --color-error: #ef4444;
  --color-success: #10b981;
}
```

**Usage in components:**
```tsx
// ✅ DO: Use semantic color names
<div className="bg-primary text-background">
<button className="bg-secondary hover:opacity-90">
<p className="text-paragraph">

// ❌ DON'T: Use hard-coded Tailwind colors
<div className="bg-blue-500 text-white">
<button className="bg-gray-800">
```

**Available color utilities after defining in @theme inline:**
- `bg-primary`, `text-primary`, `border-primary`
- `bg-secondary`, `text-secondary`, `border-secondary`
- `bg-paragraph`, `text-paragraph`
- etc.

### 2. MCP Server Usage
**CRITICAL: Always check for and use existing MCP servers before implementing functionality**

Before writing code, check if relevant MCP servers are connected:
- **File operations:** Use filesystem MCP if available
- **Database queries:** Use database MCP if available
- **API calls:** Use relevant API MCP servers if available
- **External services:** Check for service-specific MCP servers

**How to check:**
1. List available MCP servers at the start of a session
2. Ask about MCP capabilities before implementing features
3. Prefer MCP server usage over custom implementations

### 3. Component Architecture

#### UI Components (`/components/ui`)
- Create reusable, atomic UI components
- Each component in its own file
- Export as default
- Use TypeScript interfaces for props
- **ALWAYS use these instead of native HTML elements**

**Required UI components:**
- `Button.tsx` - All button variations
- `Input.tsx` - Form inputs
- `Textarea.tsx` - Text areas
- `Select.tsx` - Dropdown selects
- `Checkbox.tsx` - Checkboxes
- `Radio.tsx` - Radio buttons
- `Form.tsx` - Form wrapper with validation
- `Card.tsx` - Content cards
- `Badge.tsx` - Status badges
- `Modal.tsx` - Modal dialogs
- `Alert.tsx` - Alert messages
- `Spinner.tsx` - Loading spinners

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
  const baseStyles = 'rounded-lg font-medium transition-all';
  
  const variants = {
    primary: 'bg-primary text-background hover:opacity-90',
    secondary: 'bg-secondary text-background hover:opacity-90',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-background'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

**Example Input component:**
```tsx
// components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ 
  label, 
  error, 
  className,
  ...props 
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border border-border rounded-lg 
          bg-background text-foreground
          focus:outline-none focus:ring-2 focus:ring-primary
          ${error ? 'border-error' : ''}
          ${className || ''}`}
        {...props}
      />
      {error && (
        <p className="text-error text-sm mt-1">{error}</p>
      )}
    </div>
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

**Example section component:**
```tsx
// components/sections/HeroSection.tsx
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Your Catchy Headline
            </h1>
            <p className="text-xl text-paragraph mb-6">
              Your compelling subheadline goes here.
            </p>
            <div className="flex gap-4">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative h-96">
            <Image
              src="/hero-image.png"
              alt="Hero image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 4. Next.js Components - ALWAYS USE THESE

**Navigation:**
```tsx
import Link from 'next/link';
// ✅ DO: <Link href="/about">About</Link>
// ❌ DON'T: <a href="/about">About</a>
```

**Images:**
```tsx
import Image from 'next/image';
// ✅ DO: <Image src="/favicon.ico" alt="Logo" width={200} height={50} />
// ❌ DON'T: <img src="/favicon.ico" alt="Logo" />
```

**Scripts:**
```tsx
import Script from 'next/script';
// ✅ DO: <Script src="https://example.com/script.js" />
// ❌ DON'T: <script src="https://example.com/script.js"></script>
```

**Other Next.js components to use:**
- `next/font` for font optimization
- `next/headers` for server-side headers/cookies
- `redirect()` and `notFound()` from `next/navigation`

### 5. Code Organization Rules

#### Component Size Limits
- **Maximum 200 lines per component**
- If a component exceeds this, break it into smaller components
- Extract complex logic into custom hooks (`/hooks` folder)
- Extract utility functions into `/lib` folder

#### File Structure
```tsx
// 1. Imports (grouped: React, Next, external, internal)
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { someLibrary } from 'external-package';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  description?: string;
}

// 3. Component
export default function Component({ title, description }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Functions
  const handleClick = () => {};
  
  // 6. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

#### Naming Conventions
- **Components:** PascalCase (`Button.tsx`, `HeroSection.tsx`)
- **Utilities:** camelCase (`formatDate.ts`, `apiClient.ts`)
- **Constants:** UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Types:** PascalCase with clear names (`UserProfile`, `ApiResponse`)

### 6. Best Practices

#### TypeScript
- Always define prop interfaces
- Avoid `any` type - use `unknown` if type is truly unknown
- Use type inference where obvious
- Define return types for functions

#### Performance
- Use `'use client'` only when necessary (state, effects, event handlers)
- Prefer Server Components by default
- Lazy load heavy components with `next/dynamic`
- Optimize images with Next.js Image component (always use `alt` prop)

#### Accessibility
- Always include `alt` text for images
- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Maintain proper heading hierarchy (h1 → h2 → h3)

#### Styling
- Use Tailwind utility classes
- **ONLY use colors defined in @theme inline**
- For complex/repeated patterns, extract to components
- Use template literals for conditional classes
- Always use Lucide React Icons instead of Emojis

## Code Generation Guidelines for Claude

### Before Starting ANY Task:
1. ✅ **Check for available MCP servers** and use them if relevant
2. ✅ Review existing component structure
3. ✅ Identify which UI components are needed

### When Creating New Components:
1. ✅ Always use TypeScript with proper interfaces
2. ✅ Use UI components from `/components/ui` instead of native HTML elements
3. ✅ Use Next.js components (`Link`, `Image`, `Script`)
4. ✅ Apply color system (ONLY colors from @theme inline)
5. ✅ Keep components under 200 lines - break into smaller pieces if needed
6. ✅ Use semantic, descriptive names
7. ✅ Add proper TypeScript types for all props
8. ✅ Include error handling and loading states where appropriate
9. ✅ Check for MCP servers that could help with the functionality

### When Modifying Existing Code:
1. ✅ Maintain existing patterns and structure
2. ✅ Refactor if component exceeds size limits
3. ✅ Replace hard-coded Tailwind colors with @theme inline colors
4. ✅ Replace native HTML with Next.js components if found
5. ✅ Replace native HTML elements (`<button>`, `<input>`) with UI components
6. ✅ Check if MCP servers can improve the implementation

### Element Replacement Rules:
```tsx
// ❌ DON'T use native elements
<button>Click me</button>
<input type="text" />
<textarea />
<a href="/page">Link</a>
<img src="/image.jpg" />

// ✅ DO use UI/Next.js components
<Button>Click me</Button>
<Input type="text" />
<Textarea />
<Link href="/page">Link</Link>
<Image src="/image.jpg" alt="Description" width={500} height={300} />
```

## Common Patterns

### Form Handling with UI Components
```tsx
'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Handle submission
      await submitForm({ email });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input 
        type="email" 
        label="Email Address"
        placeholder="you@example.com" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        required 
      />
      <Button 
        type="submit" 
        variant="primary"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Sending...' : 'Submit'}
      </Button>
    </form>
  );
}
```

### Data Fetching (Server Component)
```tsx
// app/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';

async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  if (!res.ok) throw new Error('Failed to fetch posts');
  
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">Blog</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <Image
                src={post.image}
                alt={post.title}
                width={400}
                height={250}
                className="rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {post.title}
                </h2>
                <p className="text-paragraph line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### Loading States
```tsx
// app/blog/loading.tsx
import Spinner from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner size="lg" />
    </div>
  );
}
```

### Error Handling
```tsx
// app/blog/error.tsx
'use client';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Something went wrong!
      </h2>
      <p className="text-paragraph mb-6">{error.message}</p>
      <Button onClick={reset} variant="primary">
        Try again
      </Button>
    </div>
  );
}
```

## Questions to Ask Before Starting

If requirements are unclear, ask:
- Are there any MCP servers available that could help?
- Should this be a Server or Client Component?
- What interactions/state management is needed?
- Are there existing UI components to reuse or do new ones need to be created?
- What's the expected data structure?
- Any specific accessibility requirements?
- What colors should be added to @theme inline if they don't exist?

## Checklist for Every Component

- [ ] Uses TypeScript with proper interfaces
- [ ] Uses UI components instead of native HTML elements
- [ ] Uses Next.js components (`Link`, `Image`) instead of HTML equivalents
- [ ] Uses ONLY colors from @theme inline (no hard-coded Tailwind colors)
- [ ] Component is under 200 lines
- [ ] Proper error handling included
- [ ] Loading states included where needed
- [ ] Accessible (alt text, ARIA labels, keyboard navigation)
- [ ] MCP servers used where applicable

---

**Remember:**
1. **MCP servers first** - Always check for and use available MCP servers
2. **Component-based** - Break everything into small, reusable pieces
3. **Color system** - Only @theme inline colors, never hard-coded
4. **UI components** - Always use custom UI components, never native elements
5. **Next.js components** - Use Next.js optimized components for links, images, etc.

If in doubt, break it down into smaller pieces and ask for clarification!