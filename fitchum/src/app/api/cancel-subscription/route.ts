import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription info from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Only allow cancellation if user has a subscription ID (recurring subscription)
    if (!profile.stripe_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found to cancel' }, { status: 400 });
    }

    // Cancel the subscription in Stripe (at period end to allow access until paid period expires)
    const subscription = await stripe.subscriptions.update(profile.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Update the database to reflect cancellation
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'canceled',
        subscription_cancel_at: new Date(subscription.cancel_at! * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating profile after cancellation:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription canceled successfully. You will retain access until the end of your current billing period.',
      cancel_at: new Date(subscription.cancel_at! * 1000).toISOString()
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}