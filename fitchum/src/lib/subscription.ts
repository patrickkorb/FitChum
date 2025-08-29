import { createClient } from '@/lib/supabase/client';

export interface UserPlan {
  subscription_status: string;
  subscription_plan: string;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  has_used_trial: boolean;
}

export async function getUserPlan(userId: string): Promise<UserPlan | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_plan, trial_started_at, trial_ends_at, has_used_trial')
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
  
  // Check if user is in active trial
  if (userPlan.subscription_status === 'trial' && userPlan.trial_ends_at) {
    const trialEndDate = new Date(userPlan.trial_ends_at);
    const now = new Date();
    return now < trialEndDate;
  }
  
  // Check if user has active paid subscription
  return userPlan.subscription_plan === 'pro' && 
         userPlan.subscription_status === 'active';
}

export function isPro(userPlan: UserPlan | null): boolean {
  return hasProAccess(userPlan);
}

export function isTrialActive(userPlan: UserPlan | null): boolean {
  if (!userPlan || userPlan.subscription_status !== 'trial' || !userPlan.trial_ends_at) {
    return false;
  }
  
  const trialEndDate = new Date(userPlan.trial_ends_at);
  const now = new Date();
  return now < trialEndDate;
}

export function getTrialDaysRemaining(userPlan: UserPlan | null): number {
  if (!userPlan || !isTrialActive(userPlan) || !userPlan.trial_ends_at) {
    return 0;
  }
  
  const trialEndDate = new Date(userPlan.trial_ends_at);
  const now = new Date();
  const diffTime = trialEndDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function hasTrialExpired(userPlan: UserPlan | null): boolean {
  if (!userPlan || !userPlan.trial_ends_at) {
    return false;
  }
  
  if (userPlan.subscription_status === 'expired') {
    return true;
  }
  
  const trialEndDate = new Date(userPlan.trial_ends_at);
  const now = new Date();
  return now >= trialEndDate;
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