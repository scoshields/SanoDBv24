import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { supabase } from '../../src/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  if (!sig) {
    return { statusCode: 400, body: 'No signature found' };
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig,
      webhookSecret
    );

    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const { error } = await supabase
          .from('stripe_subscriptions')
          .upsert({
            id: subscription.id,
            user_id: subscription.metadata.user_id,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            quantity: subscription.items.data[0].quantity,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            trial_start: subscription.trial_start 
              ? new Date(subscription.trial_start * 1000)
              : null,
            trial_end: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : null,
            cancel_at: subscription.cancel_at
              ? new Date(subscription.cancel_at * 1000)
              : null,
            canceled_at: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000)
              : null
          });

        if (error) throw error;
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const { error } = await supabase
          .from('stripe_subscriptions')
          .update({
            status: subscription.status,
            ended_at: new Date()
          })
          .eq('id', subscription.id);

        if (error) throw error;
        break;
      }

      case 'customer.updated': {
        const customer = stripeEvent.data.object as Stripe.Customer;
        const { error } = await supabase
          .from('stripe_customers')
          .update({
            email: customer.email
          })
          .eq('customer_id', customer.id);

        if (error) throw error;
        break;
      }

      case 'customer.deleted': {
        const customer = stripeEvent.data.object as Stripe.Customer;
        const { error } = await supabase
          .from('stripe_customers')
          .delete()
          .eq('customer_id', customer.id);

        if (error) throw error;
        break;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (err) {
    console.error('Webhook error:', err);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};