-- COMPLETE FIX: Drop and recreate the orders table with correct structure
-- WARNING: This will delete all existing orders! Only use if you don't have important data.

-- Drop the table if it exists (THIS WILL DELETE ALL DATA!)
DROP TABLE IF EXISTS orders CASCADE;

-- Create the orders table with the correct structure
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  total_price BIGINT NOT NULL, -- Price in smallest currency unit (e.g., VND)
  payment_method TEXT NOT NULL CHECK (payment_method IN ('local_transfer', 'cod')),
  products JSONB NOT NULL, -- Array of product objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_payment_method ON orders(payment_method);

-- Disable Row Level Security for easier setup
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Add comments
COMMENT ON TABLE orders IS 'Stores customer orders from the e-commerce checkout';
COMMENT ON COLUMN orders.total_price IS 'Total order price in smallest currency unit (e.g., VND, stored as integer)';
COMMENT ON COLUMN orders.payment_method IS 'Payment method: local_transfer or cod';
COMMENT ON COLUMN orders.products IS 'JSON array of ordered products with details';









