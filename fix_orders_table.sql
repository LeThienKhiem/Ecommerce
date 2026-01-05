-- Fix the orders table - Add missing columns if they don't exist
-- Run this in your Supabase SQL Editor

-- First, add payment_method column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_method TEXT;
        -- Update existing rows to have a default value
        UPDATE orders SET payment_method = 'local_transfer' WHERE payment_method IS NULL;
        -- Now make it NOT NULL with the constraint
        ALTER TABLE orders ALTER COLUMN payment_method SET NOT NULL;
        ALTER TABLE orders ADD CONSTRAINT check_payment_method 
            CHECK (payment_method IN ('local_transfer', 'cod'));
    END IF;
END $$;

-- Add other columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'customer_name'
    ) THEN
        ALTER TABLE orders ADD COLUMN customer_name TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'phone'
    ) THEN
        ALTER TABLE orders ADD COLUMN phone TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'address'
    ) THEN
        ALTER TABLE orders ADD COLUMN address TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'total_price'
    ) THEN
        ALTER TABLE orders ADD COLUMN total_price BIGINT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'products'
    ) THEN
        ALTER TABLE orders ADD COLUMN products JSONB;
    END IF;
END $$;

-- Disable Row Level Security if it's causing issues
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);











