# Git Setup Instructions

Since Git is not currently available in your terminal, follow these steps to upload your code to GitHub:

## Step 1: Install Git (if not already installed)

Download and install Git for Windows from: https://git-scm.com/download/win

After installation, restart your terminal/command prompt.

## Step 2: Open Terminal in Your Project Directory

Navigate to your project folder:
```bash
cd D:\MyDropshipStore
```

## Step 3: Initialize Git Repository

```bash
git init
```

## Step 4: Add Remote Repository

```bash
git remote add origin https://github.com/LeThienKhiem/Ecommerce.git
```

## Step 5: Stage All Files

```bash
git add .
```

## Step 6: Create Initial Commit

```bash
git commit -m "Initial commit: Complete e-commerce store with Apple-like minimalist design

- Next.js 14 with App Router, TypeScript, Tailwind CSS
- Supabase integration for product data
- Product listing and detail pages
- Shopping cart with localStorage persistence
- Checkout page with local bank transfer
- Cart context for global state management
- Minimalist UI design
- Toast notifications
- Interactive product image gallery
- Responsive design
- Kilolook Store branding"
```

## Step 7: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

You may be prompted for your GitHub username and password (or personal access token).

## Alternative: Using GitHub Desktop

If you prefer a GUI:
1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. File → Add Local Repository → Select `D:\MyDropshipStore`
4. Publish repository to GitHub

## Note on Authentication

If you encounter authentication issues:
- Use a Personal Access Token instead of password
- Create one at: https://github.com/settings/tokens
- Use the token as your password when prompted


