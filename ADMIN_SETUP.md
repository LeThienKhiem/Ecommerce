# Admin Panel Setup Guide

## Overview
The admin panel is available at `/admin` and provides:
- **Authentication**: Login with username/password
- **Product Management**: Add and remove products
- **Order Management**: View orders and mark them as DONE

## Step 1: Add Status Column to Orders Table

Before using the admin panel, you need to add a `status` column to your `orders` table in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the SQL from `add_status_to_orders.sql`
4. Click **Run** to execute the SQL

This will add:
- A `status` column with values: `'pending'` or `'done'`
- Default value: `'pending'` for all existing orders
- An index on the `status` column for faster queries

## Step 2: Configure Admin Credentials

Set up your admin username and password in `.env.local`:

```env
NEXT_PUBLIC_ADMIN_USERNAME=your_username
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

**Default credentials** (if not set):
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change these defaults in production!

## Step 3: Access the Admin Panel

1. Navigate to `http://localhost:3000/admin` (or `https://kilolook.com/admin` in production)
2. Enter your username and password
3. You'll be redirected to `/admin/dashboard`

## Features

### Orders Management
- View all orders with customer information
- See order details: customer name, phone, address, payment method, total price
- View products in each order
- Mark orders as "DONE" to disable them from the active list
- Orders marked as DONE are highlighted in green

### Product Management
- View all products in a table
- Add new products with:
  - Title, Slug, Prices (original & selling)
  - Description, Category
  - Images (comma-separated URLs)
  - Source URL
  - Published status
- Delete products (with confirmation)

## Authentication

The admin panel uses session-based authentication:
- Login state is stored in `sessionStorage`
- You'll be automatically logged out when you close the browser tab
- To manually logout, click the "Đăng xuất" button

## Security Notes

1. **Environment Variables**: The admin credentials are stored in `NEXT_PUBLIC_*` variables, which are exposed to the browser. For production, consider:
   - Using Supabase Auth for better security
   - Implementing server-side authentication
   - Using environment variables only on the server side

2. **API Access**: The admin panel uses the same Supabase client as the public site. Ensure your Supabase RLS (Row Level Security) policies are configured correctly if you enable RLS.

## Troubleshooting

**Can't login?**
- Check your `.env.local` file has the correct credentials
- Make sure you've restarted your dev server after changing `.env.local`
- Try clearing browser cache and cookies

**Orders not showing?**
- Make sure you've run the SQL script to add the `status` column
- Check your Supabase connection in the browser console

**Can't add/delete products?**
- Verify your Supabase client has write permissions
- Check the browser console for error messages
- Ensure the `products` table exists and has the correct schema








