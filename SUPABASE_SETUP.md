# Supabase Orders Table Setup

## Quick Fix for Missing Columns Error

If you're getting an error like "Could not find the 'payment_method' column", use one of these:

### Option 1: Add Missing Columns (Recommended - Keeps existing data)
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the SQL from `fix_orders_table.sql`
3. Click **Run**

### Option 2: Recreate Table (WARNING: Deletes all orders)
If you don't have important data, you can recreate the table:
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the SQL from `recreate_orders_table.sql`
3. Click **Run**

## Step 1: Create the Orders Table (If table doesn't exist)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the SQL from `supabase_orders_table.sql`
4. Click **Run** to execute the SQL

This will create the `orders` table with the following structure:
- `id` - Auto-incrementing primary key
- `customer_name` - Customer's full name
- `phone` - Customer's phone number
- `address` - Shipping address
- `total_price` - Total order price (stored as integer, e.g., VND)
- `payment_method` - Either 'local_transfer' or 'cod'
- `products` - JSONB field containing array of product details
- `created_at` - Timestamp when order was created
- `updated_at` - Timestamp when order was last updated

## Step 2: Configure Row Level Security (Optional)

If you want to restrict access to the orders table:

1. In Supabase Dashboard, go to **Authentication** > **Policies**
2. Select the `orders` table
3. Create policies as needed for your use case

For now, the table allows public inserts (orders can be created by anyone visiting your site).

## Step 3: Verify the Setup

After creating the table, you can test the checkout flow:
1. Add items to cart
2. Go to checkout
3. Fill in customer details
4. Select payment method
5. Submit order

Check your Supabase Dashboard > **Table Editor** > `orders` to see if the order was saved successfully.

## Troubleshooting

**Error: "relation 'orders' does not exist"**
- Make sure you ran the SQL script in the Supabase SQL Editor
- Check that you're connected to the correct project

**Error: "permission denied for table orders"**
- Check your Row Level Security policies
- Make sure inserts are allowed for the table

**Orders not appearing**
- Check the browser console for errors
- Check Supabase logs in Dashboard > Logs
- Verify your Supabase environment variables are set correctly in `.env.local`

