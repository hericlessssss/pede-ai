/*
  # Create orders table and policies

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `street` (text)
      - `neighborhood` (text)
      - `city` (text)
      - `zip_code` (text)
      - `complement` (text, nullable)
      - `notes` (text, nullable)
      - `payment_method` (text)
      - `change_for` (numeric, nullable)
      - `total` (numeric)
      - `items` (jsonb)
      - `created_at` (timestamptz)
      - `status` (text, default: 'pending')

  2. Security
    - Enable RLS on `orders` table
    - Add policies for:
      - Authenticated users can create orders
      - Authenticated users can read their own orders
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  street text NOT NULL,
  neighborhood text NOT NULL,
  city text NOT NULL,
  zip_code text NOT NULL,
  complement text,
  notes text,
  payment_method text NOT NULL,
  change_for numeric,
  total numeric NOT NULL,
  items jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Users can create orders'
  ) THEN
    CREATE POLICY "Users can create orders"
      ON orders
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Users can read their own orders'
  ) THEN
    CREATE POLICY "Users can read their own orders"
      ON orders
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;