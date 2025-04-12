/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `street` (text)
      - `neighborhood` (text)
      - `city` (text)
      - `zip_code` (text)
      - `complement` (text)
      - `notes` (text)
      - `payment_method` (text)
      - `change_for` (numeric)
      - `total` (numeric)
      - `items` (jsonb)
      - `created_at` (timestamptz)
      - `status` (text)

  2. Security
    - Enable RLS on `orders` table
    - Add policy for authenticated users to read their own orders
    - Add policy for authenticated users to create orders
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

CREATE POLICY "Users can read their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);