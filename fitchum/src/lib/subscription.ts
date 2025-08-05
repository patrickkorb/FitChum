import { createClient } from '@/lib/supabase/client';

export interface UserPlan {
  subscription_status: string;
  subscription_plan: string;
  stripe_payment_id: string | null;
}

export async function getUserPlan(userId: string): Promise<UserPlan | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_plan, stripe_payment_id')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user plan:', error);
    return null;
  }

  return data;
}

export function hasProAccess(userPlan: UserPlan | null): boolean {
  if (!userPlan) return false;
  
  return userPlan.subscription_plan === 'pro' && 
         userPlan.subscription_status === 'active';
}

export function isPro(userPlan: UserPlan | null): boolean {
  return hasProAccess(userPlan);
}

export function getPlanDisplayName(plan: string): string {
  const planNames: Record<string, string> = {
    free: 'Free',
    pro: 'Pro'
  };
  
  return planNames[plan] || 'Free';
}

export function getPlanFeatures(plan: string): string[] {
  if (plan === 'pro') {
    return [
      'Daily Journals',
      'Gym Plan', 
      'Public Leaderboard',
      'Community Access',
      'Add Friends',
      'Custom Friends Leaderboards',
      'Custom Challenges',
      'Priority Support'
    ];
  }
  
  return [
    'Daily Journals',
    'Gym Plan',
    'Public Leaderboard', 
    'Community Access'
  ];
}