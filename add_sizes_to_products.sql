-- Add sizes column to products table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'sizes'
    ) THEN
        ALTER TABLE products ADD COLUMN sizes TEXT[];
    END IF;
END $$;

COMMENT ON COLUMN products.sizes IS 'Array of available sizes for the product (e.g., S, M, L, XL or 38, 39, 40)';

