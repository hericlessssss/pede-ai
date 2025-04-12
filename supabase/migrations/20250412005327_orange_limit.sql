/*
  # Add delivery tracking functionality

  1. Changes
    - Add delivery status tracking to orders table
    - Add estimated and actual delivery time fields
    - Add delivery notes field for drivers

  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  -- Add delivery_status column with check constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'delivery_status'
  ) THEN
    ALTER TABLE orders
    ADD COLUMN delivery_status text DEFAULT 'waiting';

    ALTER TABLE orders
    ADD CONSTRAINT delivery_status_check 
    CHECK (delivery_status IN ('waiting', 'assigned', 'in_transit', 'delivered'));
  END IF;

  -- Add estimated_delivery_time column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'estimated_delivery_time'
  ) THEN
    ALTER TABLE orders
    ADD COLUMN estimated_delivery_time timestamptz;
  END IF;

  -- Add actual_delivery_time column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'actual_delivery_time'
  ) THEN
    ALTER TABLE orders
    ADD COLUMN actual_delivery_time timestamptz;
  END IF;

  -- Add delivery_notes column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'delivery_notes'
  ) THEN
    ALTER TABLE orders
    ADD COLUMN delivery_notes text;
  END IF;
END $$;