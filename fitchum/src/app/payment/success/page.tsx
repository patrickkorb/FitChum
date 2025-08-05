'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { CheckCircle, Crown } from 'lucide-react';

export default function PaymentSuccessPage() {
  const { user } from useAuth();
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <Crown className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to FitChum Pro! 🎉
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your payment was successful! You now have lifetime access to all Pro features.
        </p>
        
        <div className="space-y-3 mb-8 text-left">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Add and connect with friends
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Custom friends leaderboards
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Create custom challenges
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Priority support
          </div>
        </div>
        
        <Button 
          onClick={() => router.push('/dashboard')}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          Start Using Pro Features
        </Button>
        
        <p className="text-xs text-gray-500 mt-4">
          No recurring charges. You own Pro for life!
        </p>
      </Card>
    </div>
  );
}