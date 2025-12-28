-- SQL script to add tags column to products table
-- Run this in your Supabase SQL Editor

-- Add tags column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'tags'
    ) THEN
        ALTER TABLE products ADD COLUMN tags TEXT[];
    END IF;
END $$;

-- Add comment
COMMENT ON COLUMN products.tags IS 'Array of tags/keywords for SEO and categorization';


