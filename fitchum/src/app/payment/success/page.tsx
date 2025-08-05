'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { CheckCircle, Crown } from 'lucide-react';

export default function PaymentSuccessPage() {

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="col-span-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-neutral-dark/70 dark:text-neutral-light/70">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-4 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <CheckCircle className="w-16 h-16 text-primary" />
            <Crown className="w-8 h-8 text-secondary absolute -top-2 -right-2" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light">
          Welcome to FitChum Pro! 🎉
        </h1>
        
        <p className="text-neutral-dark/70 dark:text-neutral-light/70">
          Your payment was successful! You now have lifetime access to all Pro features.
        </p>
        
        <div className="space-y-3 text-left">
          <div className="flex items-center text-sm text-neutral-dark/80 dark:text-neutral-light/80">
            <CheckCircle className="w-4 h-4 text-primary mr-2" />
            Add and connect with friends
          </div>
          <div className="flex items-center text-sm text-neutral-dark/80 dark:text-neutral-light/80">
            <CheckCircle className="w-4 h-4 text-primary mr-2" />
            Custom friends leaderboards
          </div>
          <div className="flex items-center text-sm text-neutral-dark/80 dark:text-neutral-light/80">
            <CheckCircle className="w-4 h-4 text-primary mr-2" />
            Create custom challenges
          </div>
          <div className="flex items-center text-sm text-neutral-dark/80 dark:text-neutral-light/80">
            <CheckCircle className="w-4 h-4 text-primary mr-2" />
            Priority support
          </div>
        </div>
        
        <Button 
          onClick={() => router.push('/dashboard')}
          variant="primary"
          className="w-full"
        >
          Start Using Pro Features
        </Button>
        
        <p className="text-xs text-neutral-dark/50 dark:text-neutral-light/50">
          No recurring charges. You own Pro for life!
        </p>
      </Card>
    </div>
  );
}