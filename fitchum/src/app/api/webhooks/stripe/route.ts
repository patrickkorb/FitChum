import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import {createAdminClient} from '@/lib/supabase/server';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('No signature provided');
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if ((session.mode === 'payment' && session.payment_status === 'paid') || 
            (session.mode === 'subscription' && session.payment_status === 'paid')) {
          const userId = session.client_reference_id || session.metadata?.userId;

          if (userId) {
            console.log(`Processing ${session.mode} for user ${userId}`);
            
            // Determine subscription type and prepare update data
            const updateData: {
              subscription_plan: 'pro';
              subscription_status: 'active';
              subscription_type: 'payment' | 'subscription';
              updated_at: string;
              stripe_customer_id?: string;
              stripe_subscription_id?: string;
              stripe_payment_id?: string;
            } = {
              subscription_plan: 'pro',
              subscription_status: 'active',
              subscription_type: session.mode, // 'payment' for lifetime, 'subscription' for monthly
              updated_at: new Date().toISOString(),
            };

            // Add customer ID for all payments
            if (session.customer) {
              updateData.stripe_customer_id = session.customer as string;
            }

            // For subscription mode, store subscription ID
            if (session.mode === 'subscription' && session.subscription) {
              updateData.stripe_subscription_id = session.subscription as string;
            }

            // For payment mode, store payment intent
            if (session.mode === 'payment' && session.payment_intent) {
              updateData.stripe_payment_id = session.payment_intent as string;
            }
            
            // Update user to Pro plan after successful payment
            const { error } = await supabase
              .from('profiles')
              .update(updateData)
              .eq('user_id', userId);

            if (error) {
              console.error('Error updating user profile:', error);
              return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
            }

            console.log(`User ${userId} upgraded to Pro plan (${session.mode})`);
          } else {
            console.error('No user ID found in session');
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata?.userId;

        if (userId) {
          // Ensure the user is marked as Pro
          await supabase
            .from('profiles')
            .update({
              subscription_plan: 'pro',
              subscription_status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          console.log(`Payment confirmed for user ${userId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user by subscription ID and downgrade them
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_plan: 'free',
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error downgrading user after subscription deletion:', error);
        } else {
          console.log(`Subscription ${subscription.id} canceled and user downgraded`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        if (subscription.cancel_at_period_end) {
          // Subscription is scheduled to cancel
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'canceled',
              subscription_cancel_at: new Date(subscription.cancel_at! * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);

          if (error) {
            console.error('Error updating subscription cancellation:', error);
          } else {
            console.log(`Subscription ${subscription.id} scheduled for cancellation`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}