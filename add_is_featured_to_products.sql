-- SQL script to add is_featured column to products table
-- Run this in your Supabase SQL Editor

-- Add is_featured column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'is_featured'
    ) THEN
        ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Update existing rows to have is_featured = true if NULL
UPDATE products SET is_featured = true WHERE is_featured IS NULL;

-- Add comment
COMMENT ON COLUMN products.is_featured IS 'Whether the product should be shown on the home page';



