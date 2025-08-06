import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  alert(("HI"))
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('No signature provided');
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
  };

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'payment' && session.payment_status === 'paid') {
          const userId = session.client_reference_id || session.metadata?.userId;

          if (userId) {
            console.log(`Processing payment for user ${userId}`);
            
            // Update user to Pro plan after successful payment
            const { error } = await supabase
              .from('profiles')
              .update({
                subscription_plan: 'pro',
                stripe_payment_id: session.payment_intent as string,
                subscription_status: 'active',
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', userId);

            if (error) {
              console.error('Error updating user profile:', error);
              return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
            }

            console.log(`User ${userId} upgraded to Pro plan`);
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