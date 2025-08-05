'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Daily Journals',
      'Gym Plan',
      'Public Leaderboard',
      'Community Access'
    ],
    popular: false,
    isFree: true
  },
  {
    name: 'Pro',
    price: 10,
    priceId: 'price_1RsrusHjVDpsMb5NV1b3CiYA',
    features: [
      'Everything in Free',
      'Add Friends',
      'Custom Friends Leaderboards', 
      'Custom Challenges',
      'Priority Support'
    ],
    popular: true,
    isFree: false
  }
];

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlanSelect = async (plan: any) => {
    if (!user) {
      // Redirect to sign in
      window.location.href = '/auth/login';
      return;
    }

    // Handle free plan
    if (plan.isFree) {
      // User is already on free plan, redirect to dashboard
      window.location.href = '/dashboard';
      return;
    }

    // Handle Pro plan payment
    setLoading(plan.priceId);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: user.id,
        }),
      });

      const { sessionId } = await response.json();
      
      const stripe = await import('@stripe/stripe-js').then(m => 
        m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      );
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen col-span-4 bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your FitChum Plan
          </h1>
          <p className="text-xl text-gray-600">
            Achieve your fitness goals with the power of social accountability
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative p-8 ${
                plan.popular 
                  ? 'border-2 border-green-500 shadow-xl' 
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price === 0 ? 'Free' : `€${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600"> one-time</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePlanSelect(plan)}
                disabled={loading === plan.priceId}
                className={`w-full ${
                  plan.popular
                    ? 'bg-green-500 hover:bg-green-600'
                    : plan.isFree 
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-900 hover:bg-gray-800'
                } text-white`}
              >
                {loading === plan.priceId 
                  ? 'Loading...' 
                  : plan.isFree 
                    ? 'Get Started Free' 
                    : `Upgrade to ${plan.name}`
                }
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Start free, upgrade when you're ready. No recurring charges.
          </p>
          <p className="text-sm text-gray-500">
            Secure payments powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}