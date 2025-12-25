@echo off
echo Initializing Git repository...
git init

echo.
echo Adding remote repository...
git remote add origin https://github.com/LeThienKhiem/Ecommerce.git

echo.
echo Staging all files...
git add .

echo.
echo Creating commit...
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

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
echo (You may be prompted for your GitHub credentials)
git push -u origin main

echo.
echo Done! Your code has been uploaded to GitHub.
pause


