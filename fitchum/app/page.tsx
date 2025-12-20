'use client';

import { useState, FormEvent } from 'react';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call (replace with actual API endpoint later)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo or App Name */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            FitChumm
          </h1>
          <p className="text-xl text-muted-foreground">
            Coming Soon
          </p>
        </div>

        {!isSubmitted ? (
          <div className="space-y-6">
            <p className="text-foreground/80">
              Join the waitlist to be notified when we launch
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                disabled={isSubmitting}
              />

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-4 py-8">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              You&apos;re on the list!
            </h2>
            <p className="text-muted-foreground">
              We&apos;ll notify you when FitChumm launches
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              className="mt-4"
            >
              Add another email
            </Button>
          </div>
        )}

        <p className="text-sm text-muted-foreground pt-8">
          Your fitness journey starts here
        </p>
      </div>
    </div>
  );
}
