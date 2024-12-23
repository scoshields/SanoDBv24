/*
  # Add Stripe Integration

  1. New Tables
    - `stripe_customers`
      - Links Supabase users to Stripe customers
      - Stores Stripe customer ID and subscription status
    - `stripe_products`
      - Stores available subscription products/prices
    - `stripe_subscriptions`
      - Tracks active subscriptions and their status

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
    - Add helper functions for subscription management

  3. Changes
    - Add Stripe-related tables and functions
    - Set up RLS policies
    - Add subscription status tracking
*/

-- Create stripe_customers table
CREATE TABLE IF NOT EXISTS stripe_customers (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  customer_id text UNIQUE,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stripe_products table
CREATE TABLE IF NOT EXISTS stripe_products (
  id text PRIMARY KEY,
  active boolean,
  name text,
  description text,
  image text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stripe_prices table
CREATE TABLE IF NOT EXISTS stripe_prices (
  id text PRIMARY KEY,
  product_id text REFERENCES stripe_products(id),
  active boolean,
  description text,
  unit_amount bigint,
  currency text,
  type text,
  interval text,
  interval_count integer,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stripe_subscriptions table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  status text,
  price_id text REFERENCES stripe_prices(id),
  quantity integer,
  cancel_at_period_end boolean,
  created_at timestamptz DEFAULT now(),
  current_period_start timestamptz,
  current_period_end timestamptz,
  ended_at timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for stripe_customers
CREATE POLICY "Users can view own customer record" ON stripe_customers
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Policies for stripe_products
CREATE POLICY "Anyone can view active products" ON stripe_products
  FOR SELECT
  USING (active = true);

-- Policies for stripe_prices
CREATE POLICY "Anyone can view active prices" ON stripe_prices
  FOR SELECT
  USING (active = true);

-- Policies for stripe_subscriptions
CREATE POLICY "Users can view own subscriptions" ON stripe_subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Function to check if a user has an active subscription
CREATE OR REPLACE FUNCTION is_subscription_active(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM stripe_subscriptions
    WHERE user_id = user_uuid
    AND status IN ('active', 'trialing')
    AND (
      current_period_end > now()
      OR trial_end > now()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;