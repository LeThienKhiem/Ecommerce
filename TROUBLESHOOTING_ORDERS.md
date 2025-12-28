# Troubleshooting Order Submission Failures

If you're seeing "Failed to place order" errors, check the following:

## 1. Check Browser Console

Open your browser's developer tools (F12) and check the Console tab when submitting an order. Look for error messages that will tell you exactly what's wrong.

## 2. Verify Orders Table Exists

Make sure you've created the `orders` table in Supabase:

1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL script from `supabase_orders_table.sql`
3. Verify the table exists: Go to Table Editor → Check for `orders` table

## 3. Check Table Schema

The orders table should have these columns:
- `customer_name` (TEXT)
- `phone` (TEXT)
- `address` (TEXT)
- `total_price` (BIGINT)
- `payment_method` (TEXT, must be 'local_transfer' or 'cod')
- `products` (JSONB)

## 4. Check Row Level Security (RLS)

If RLS is enabled, you need to allow inserts:

1. Go to Supabase Dashboard → Authentication → Policies
2. Select the `orders` table
3. Make sure there's a policy that allows INSERT operations

Quick fix - Allow all inserts (for testing):
```sql
-- Run this in SQL Editor if RLS is blocking inserts
CREATE POLICY "Allow public inserts" 
ON orders 
FOR INSERT 
WITH CHECK (true);
```

Or disable RLS temporarily for testing:
```sql
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
```

## 5. Check Environment Variables

Make sure your `.env.local` file has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 6. Common Error Messages

**"relation 'orders' does not exist"**
- Solution: Create the orders table using the SQL script

**"permission denied for table orders"**
- Solution: Disable RLS or create an insert policy (see #4 above)

**"new row violates check constraint"**
- Solution: Check that payment_method is either 'local_transfer' or 'cod'

**"column 'xxx' does not exist"**
- Solution: Make sure your table schema matches what the code expects

## 7. Test Directly in Supabase

Try inserting a test order directly in Supabase SQL Editor:

```sql
INSERT INTO orders (customer_name, phone, address, total_price, payment_method, products)
VALUES (
  'Test Customer',
  '0123456789',
  'Test Address',
  100000,
  'local_transfer',
  '[{"title": "Test Product", "quantity": 1}]'::jsonb
);
```

If this works, the issue is with the code connection. If it fails, the issue is with the table setup.






