-- SQL script to add sort_order column to products table
-- Run this in your Supabase SQL Editor

-- Add sort_order column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'sort_order'
    ) THEN
        ALTER TABLE products ADD COLUMN sort_order BIGINT;
    END IF;
END $$;

-- Backfill existing rows with their created_at timestamp (in milliseconds)
-- Convert timestamp to epoch milliseconds
UPDATE products 
SET sort_order = EXTRACT(EPOCH FROM created_at) * 1000
WHERE sort_order IS NULL;

-- Set default value for future inserts (using current timestamp in milliseconds)
ALTER TABLE products ALTER COLUMN sort_order SET DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000;

-- Add comment
COMMENT ON COLUMN products.sort_order IS 'Sort order for products (higher = appears first). New items get current timestamp, randomized items get random value < current timestamp';



