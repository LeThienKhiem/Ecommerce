-- SQL script to add main_category column to products table
-- Run this in your Supabase SQL Editor

-- Add main_category column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'main_category'
    ) THEN
        ALTER TABLE products ADD COLUMN main_category TEXT;
    END IF;
END $$;

-- Add comment
COMMENT ON COLUMN products.main_category IS 'Main category (Audience): Nam, Nữ, Trẻ em, or Unisex';




