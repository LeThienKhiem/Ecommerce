# Kilolook Store - Modern E-Commerce Platform

A full-featured, modern e-commerce website built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features include product management, order processing, wholesale contacts, multi-language support, and advanced SEO optimization.

## 🚀 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a Service (Database & Auth)
- **Lucide React** - Beautiful icon library

## ✨ Features

### 🛍️ E-Commerce Features
- **Product Management** - Full CRUD operations with Admin Dashboard
- **Shopping Cart** - Persistent cart with context management
- **Checkout System** - Order processing with payment methods (COD, Bank Transfer)
- **Product Categories** - 2-level hierarchy (Main Category + Sub-Category)
- **Product Tags** - SEO-friendly tag system with dynamic tag pages
- **Affiliate Products** - Support for external affiliate links
- **Featured Products** - Smart featured product system for homepage
- **Smart Sort** - Customizable product ordering with randomization

### 🔍 Search & Discovery
- **Fuzzy Search** - Advanced search with partial matching across title, description, category, and tags
- **Category Filtering** - Filter products by main category (Men, Women, Kids, Unisex)
- **Tag Pages** - Dynamic SEO pages for each product tag
- **Search Bar** - Real-time search functionality

### 🌐 Multi-Language Support
- **Bilingual UI** - Vietnamese (default) and English
- **Language Toggle** - Easy language switching in navbar
- **Persistent Preference** - Language choice saved in localStorage
- **Static Text Translation** - All UI labels, buttons, and navigation translated

### 📱 Advanced UX Features
- **Image Cycling** - Desktop hover and mobile auto-scroll for product images
- **Smooth Transitions** - Fade effects between image changes
- **Responsive Design** - Mobile-first, fully responsive layout
- **Performance Optimized** - IntersectionObserver for efficient mobile image cycling

### 🏢 Business Features
- **Wholesale System** - Wholesale contact form and management
- **Admin Dashboard** - Comprehensive admin panel for products, orders, and wholesale contacts
- **Bulk Import** - JSON and CSV import for products
- **Order Management** - Track and update order status

### 🔎 SEO & Technical
- **Dynamic Sitemap** - Auto-generated sitemap with all products
- **Robots.txt** - Search engine optimization
- **JSON-LD Schema** - Structured data for product pages
- **Meta Tags** - SEO-optimized metadata

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Environment variables configured

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

Run the following SQL scripts in your Supabase SQL Editor **in this order**:

1. **Orders Table** (if not exists):
   - Run `supabase_orders_table.sql` or `recreate_orders_table.sql`

2. **Products Table Enhancements**:
   - Run `add_affiliate_link_to_products.sql`
   - Run `add_tags_to_products.sql`
   - Run `add_is_featured_to_products.sql`
   - Run `add_main_category_to_products.sql`
   - Run `add_sort_order_to_products.sql`

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your store.

## 📁 Project Structure

```
├── app/
│   ├── actions.ts              # Server actions (wholesale contact)
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page (featured products)
│   ├── robots.ts               # Robots.txt configuration
│   ├── sitemap.ts              # Dynamic sitemap generation
│   ├── admin/
│   │   ├── page.tsx            # Admin login
│   │   └── dashboard/
│   │       └── page.tsx        # Admin dashboard
│   ├── products/
│   │   ├── page.tsx            # All products page
│   │   └── [slug]/
│   │       └── page.tsx        # Product detail page
│   ├── tags/
│   │   └── [tag]/
│   │       └── page.tsx        # Tag page (SEO)
│   ├── wholesale/
│   │   └── page.tsx            # Wholesale contact form
│   ├── cart/
│   ├── checkout/
│   └── ...
├── components/
│   ├── Header.tsx              # Navigation with language toggle
│   ├── ProductCard.tsx         # Product card with image cycling
│   ├── AddToCartButton.tsx     # Add to cart functionality
│   ├── SearchBar.tsx           # Search component
│   ├── Toast.tsx               # Toast notifications
│   └── ...
├── contexts/
│   ├── CartContext.tsx         # Shopping cart state
│   ├── LanguageContext.tsx      # Multi-language support
│   └── SearchContext.tsx       # Search state
├── constants/
│   └── dictionary.ts           # Translation dictionary
├── types/
│   ├── product.ts              # Product type definition
│   ├── order.ts                # Order type definition
│   └── wholesale.ts            # Wholesale contact type
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── utils.ts                # Utility functions
└── ...
```

## 🎯 Key Features Documentation

### Product Management

#### Adding Products
1. Go to Admin Dashboard → Products tab
2. Click "Thêm sản phẩm" (Add Product)
3. Fill in product details:
   - **Main Category**: Select from Nam, Nữ, Trẻ em, or Unisex
   - **Sub-Category**: Type or select from suggestions (creatable)
   - **Tags**: Comma-separated tags for SEO
   - **Affiliate Link**: Optional external link
   - **Featured**: Toggle to show on homepage
4. Click "Thêm sản phẩm" to save

#### Editing Products
- Click the "Sửa" (Edit) button next to any product
- Form auto-populates with product data
- Update fields and click "Cập nhật sản phẩm"

#### Randomizing Product Order
- Click "🔀 Sắp xếp ngẫu nhiên" in Products tab
- Randomizes order while keeping new items at top

### Category System

**Main Categories** (Fixed):
- Nam (Men)
- Nữ (Women)
- Trẻ em (Kids)
- Unisex

**Sub-Categories** (Creatable):
- Type new sub-categories or select from existing
- Suggestions filtered by main category when selected

### Tag System

- Add comma-separated tags when creating/editing products
- Tags create dynamic SEO pages at `/tags/[tag-name]`
- Tags displayed on product pages as clickable links

### Wholesale System

**Public Form** (`/wholesale`):
- Customers can submit wholesale inquiries
- Form collects: Name, Phone, Address, Message
- Success message: "Gửi thông tin thành công! Chúng tôi sẽ liên hệ trong 24h"

**Admin Management**:
- View all wholesale contacts in Admin Dashboard
- Mark as "Done" to close inquiries
- Delete spam entries

### Multi-Language Support

**Languages**: Vietnamese (default) and English

**Toggle**: Click "VN" or "EN" button in navbar

**Translated Elements**:
- Navigation links
- Buttons (Add to Cart, Buy Now, etc.)
- Form labels
- Static page content
- Footer links

**Note**: Product titles, descriptions, and database content are NOT translated (as per requirement)

### Search Features

**Fuzzy Matching**:
- Searches across: title, description, main_category, and tags
- Partial matching (keyword can appear anywhere)
- Case-insensitive

**Usage**: Type in search bar or use `/?search=keyword` URL

### SEO Features

**Sitemap** (`/sitemap.xml`):
- Auto-generated with all products
- Static pages (priority 1.0)
- Product pages (priority 0.8)

**Robots.txt** (`/robots.txt`):
- Allows all bots
- Disallows `/admin` and `/checkout`

**Structured Data**:
- JSON-LD Product Schema on product pages
- Includes: name, description, image, price, currency (VND)

### Image Cycling UX

**Desktop**:
- Hover over product card to cycle images
- 1-second interval between images
- Smooth fade transition

**Mobile**:
- Auto-cycles when card is 80% visible
- Stops when scrolled out of view
- Performance optimized with IntersectionObserver

## 🔐 Admin Access

1. Navigate to `/admin`
2. Default credentials (update in `app/admin/page.tsx`):
   - Username: `admin`
   - Password: `admin123`

**Admin Features**:
- Product CRUD operations
- Order management
- Wholesale contact management
- Bulk product import (JSON/CSV)
- Product order randomization

## 📊 Database Schema

### Products Table
- `id` - Primary key
- `title` - Product name
- `slug` - URL-friendly identifier
- `price_original` - Original price (VND)
- `price_selling` - Selling price (VND)
- `description` - Product description
- `images` - Array of image URLs
- `category` - Sub-category
- `main_category` - Main category (Nam, Nữ, Trẻ em, Unisex)
- `source_url` - Source URL
- `affiliate_link` - Affiliate link (optional)
- `tags` - Array of tags
- `is_published` - Published status
- `is_featured` - Featured on homepage
- `sort_order` - Custom sort order
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

### Orders Table
- `id` - Primary key
- `customer_name` - Customer name
- `phone` - Phone number
- `address` - Shipping address
- `total_price` - Total price (VND)
- `payment_method` - Payment method (local_transfer, cod)
- `products` - JSONB array of products
- `status` - Order status (pending, done)
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

### Wholesale Contacts Table
- `id` - Primary key
- `name` - Contact name
- `phone` - Phone number
- `address` - Address
- `message` - Message (optional)
- `status` - Status (open, closed)
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure these are set in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration Files

- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.env.local` - Environment variables (create this)

## 📚 Additional Documentation

- `ADMIN_SETUP.md` - Admin dashboard setup guide
- `SUPABASE_SETUP.md` - Supabase database setup
- `QUICK_START.md` - Quick start guide

## 🎨 Design System

**Colors**:
- Primary: Apple Blue (`#007AFF`)
- Gray Scale: Apple Gray palette
- Accent: Green (success), Red (error), Yellow (warning)

**Typography**:
- Font: System fonts (San Francisco on macOS, Segoe UI on Windows)
- Headings: Semibold weights
- Body: Regular weights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Troubleshooting

### Database Issues
- Check `SUPABASE_SETUP.md` for database setup
- Verify all SQL scripts have been run
- Check Supabase connection in `.env.local`

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run lint`
- Verify environment variables are set

### Admin Access Issues
- Check admin credentials in `app/admin/page.tsx`
- Verify session storage is enabled in browser

---

**Built with ❤️ using Next.js and Supabase**
