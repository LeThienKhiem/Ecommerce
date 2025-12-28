-- SQL script to add affiliate_link column to products table
-- Run this in your Supabase SQL Editor

-- Add affiliate_link column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'affiliate_link'
    ) THEN
        ALTER TABLE products ADD COLUMN affiliate_link TEXT;
    END IF;
END $$;

-- Add comment
COMMENT ON COLUMN products.affiliate_link IS 'Affiliate link for external purchase (if provided, product will use affiliate mode instead of dropshipping)';





