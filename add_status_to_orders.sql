-- Add status column to orders table
-- Run this in your Supabase SQL Editor

-- Add status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'status'
    ) THEN
        ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'pending';
        -- Update existing rows to have 'pending' status
        UPDATE orders SET status = 'pending' WHERE status IS NULL;
        -- Add constraint to only allow 'pending' or 'done'
        ALTER TABLE orders ADD CONSTRAINT check_order_status 
            CHECK (status IN ('pending', 'done'));
    END IF;
END $$;

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

COMMENT ON COLUMN orders.status IS 'Order status: pending or done';







