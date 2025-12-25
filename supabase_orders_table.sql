-- SQL script to create the 'orders' table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS orders (
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

-- Optional: Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Optional: Create an index on payment_method for filtering
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);

-- Disable Row Level Security for easier setup (enable it later if needed for production)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- If you want to enable RLS later, use this:
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public inserts" ON orders FOR INSERT WITH CHECK (true);

COMMENT ON TABLE orders IS 'Stores customer orders from the e-commerce checkout';
COMMENT ON COLUMN orders.total_price IS 'Total order price in smallest currency unit (e.g., VND, stored as integer)';
COMMENT ON COLUMN orders.payment_method IS 'Payment method: local_transfer or cod';
COMMENT ON COLUMN orders.products IS 'JSON array of ordered products with details';

