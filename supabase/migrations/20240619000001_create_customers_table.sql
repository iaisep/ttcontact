
-- Create customers table to store Stripe customer IDs
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- Add RLS policies
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own customer records
CREATE POLICY "Users can view their own customer records" 
  ON public.customers
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
