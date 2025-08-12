'use client';

import { useState } from 'react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { Check, Zap, Users, Trophy, Target, Heart } from 'lucide-react';
import {createClient} from "@/lib/supabase/client";

const pricingOptions = {
  monthly: {
    name: 'Pro Monthly',
    price: 5,
    mode: "subscription",
    period: '/month',
    priceId: 'price_1RuyKyHjVDpsMb5NvyqzNfMx', // You'll need to create this in Stripe
    billing: 'Billed monthly',
    savings: null
  },
  lifetime: {
    name: 'Pro Lifetime',
    price: 29,
    mode: "payment",
    period: 'once',
    priceId: 'price_1RuyNBHjVDpsMb5NSXvNd37p', // You'll need to create this in Stripe
    billing: 'One-time payment',
    savings: 'Save €31 per year'
  }
};

const features = [
  {
    icon: Users,
    title: 'Add & Connect with Friends',
    description: 'Build your fitness community and stay motivated together'
  },
  {
    icon: Trophy,
    title: 'Friends-Only Leaderboards',
    description: 'Compete with your circle and track progress together'
  },
  {
    icon: Target,
    title: 'Custom Challenges',
    description: 'Create personalized fitness challenges with friends'
  },
  {
    icon: Zap,
    title: 'Priority Support',
    description: 'Get help faster with dedicated customer support'
  },
  {
    icon: Heart,
    title: 'Advanced Analytics',
    description: 'Deep insights into your progress and performance'
  }
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [isLifetime, setIsLifetime] = useState(false);

  const currentPlan = isLifetime ? pricingOptions.lifetime : pricingOptions.monthly;

  const handlePlanSelect = async () => {
    const supabase = createClient()
    const {data: userData} = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      // Redirect to sign in
      window.location.href = '/auth/login';
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: currentPlan.priceId,
          mode: currentPlan.mode,
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
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-dark dark:text-neutral-light mb-4">
          Unlock FitChum Pro
        </h1>
        <p className="text-xl text-neutral-dark/70 dark:text-neutral-light/70 mb-8">
          Connect with friends and supercharge your fitness journey
        </p>
        
        {/* Pricing Toggle */}
        <div className="inline-flex items-center bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-xl p-1">
          <button
            onClick={() => setIsLifetime(false)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              !isLifetime 
                ? 'bg-white dark:bg-neutral-dark shadow-md text-neutral-dark dark:text-neutral-light'
                : 'text-neutral-dark/70 dark:text-neutral-light/70 hover:text-neutral-dark dark:hover:text-neutral-light'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsLifetime(true)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 relative ${
              isLifetime 
                ? 'bg-white dark:bg-neutral-dark shadow-md text-neutral-dark dark:text-neutral-light'
                : 'text-neutral-dark/70 dark:text-neutral-light/70 hover:text-neutral-dark dark:hover:text-neutral-light'
            }`}
          >
            Lifetime
            <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs px-2 py-1 rounded-full">
              Save 83%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Card */}
      <Card className="relative overflow-hidden border-2 border-primary/20 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
        
        <div className="p-6">
          {/* Price Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-neutral-dark dark:text-neutral-light mb-3">
              {currentPlan.name}
            </h3>
            <div className="mb-2">
              <span className="text-4xl font-bold text-neutral-dark dark:text-neutral-light">
                €{currentPlan.price}
              </span>
              <span className="text-lg text-neutral-dark/70 dark:text-neutral-light/70 ml-1">
                {currentPlan.period}
              </span>
            </div>
            <p className="text-neutral-dark/60 dark:text-neutral-light/60 text-sm mb-2">
              {currentPlan.billing}
            </p>
            {currentPlan.savings && (
              <div className="inline-flex items-center bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                🎉 {currentPlan.savings}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-4 mb-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5">
                    <IconComponent size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-dark dark:text-neutral-light text-sm mb-0.5">
                      {feature.title}
                    </h4>
                    <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handlePlanSelect}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              `Get FitChum Pro ${isLifetime ? 'Forever' : 'Now'}`
            )}
          </Button>
        </div>
      </Card>

      {/* Bottom Info */}
      <div className="text-center space-y-4 pt-8 border-t border-neutral-dark/10 dark:border-neutral-light/10">
        <div className="flex items-center justify-center gap-6 text-sm text-neutral-dark/60 dark:text-neutral-light/60">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Secure payments by Stripe</span>
          </div>
        </div>
        
        <p className="text-xs text-neutral-dark/50 dark:text-neutral-light/50 max-w-2xl mx-auto">
          Join thousands of fitness enthusiasts who have transformed their workout routine with FitChum Pro.
          Start your journey today and experience the power of social accountability.
        </p>
      </div>
    </div>
  );
}