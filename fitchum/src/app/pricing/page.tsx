'use client';

import { useState } from 'react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { Check } from 'lucide-react';
import {createClient} from "@/lib/supabase/client";

const plans = [
  {
    name: 'Free Chumm',
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
    name: 'Pro Chumm',
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
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlanSelect = async (plan: typeof plans[0]) => {
    const supabase = createClient()
    const {data: userData} = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      // Redirect to sign in
      window.location.href = '/auth/login';
      return;
    }

    // Handle free plan
    if (plan.isFree) {
      // User is already on free plan, redirect to stats
      window.location.href = '/stats';
      return;
    }

    // Handle Pro plan payment
    setLoading(plan.priceId);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
          Choose Your FitChum Plan
        </h1>
        <p className="text-neutral-dark/70 dark:text-neutral-light/70">
          Achieve your fitness goals with the power of social accountability
        </p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative space-y-6 ${
                plan.popular 
                  ? 'border-2 border-primary shadow-lg' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-neutral-dark dark:text-neutral-light">
                    {plan.price === 0 ? 'Free' : `€${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-neutral-dark/70 dark:text-neutral-light/70"> one-time</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-neutral-dark/80 dark:text-neutral-light/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePlanSelect(plan)}
                disabled={loading === plan.priceId}
                variant={plan.popular ? "primary" : plan.isFree ? "outline" : "primary"}
                className="w-full"
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

        <div className="text-center space-y-4 mt-8 pt-8 border-t border-neutral-dark/20 dark:border-neutral-light/20">
          <p className="text-neutral-dark/70 dark:text-neutral-light/70">
            Start free, upgrade when you&apos;re ready. No recurring charges.
          </p>
          <p className="text-sm text-neutral-dark/50 dark:text-neutral-light/50">
            Secure payments powered by Stripe
          </p>
        </div>
    </div>
  );
}