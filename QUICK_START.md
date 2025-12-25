# Quick Start: Upload to GitHub

## Option 1: Using the Batch Script (Easiest)

1. **Install Git** (if not installed): https://git-scm.com/download/win
2. **Restart your terminal** after installing Git
3. **Double-click** `upload-to-github.bat` or run it from terminal:
   ```bash
   upload-to-github.bat
   ```

## Option 2: Manual Commands

If the batch script doesn't work, run these commands one by one in your terminal:

```bash
# Initialize repository
git init

# Add remote
git remote add origin https://github.com/LeThienKhiem/Ecommerce.git

# Stage files
git add .

# Commit
git commit -m "Initial commit: Complete e-commerce store"

# Push
git branch -M main
git push -u origin main
```

## Authentication

When prompted for credentials:
- **Username**: Your GitHub username (LeThienKhiem)
- **Password**: Use a **Personal Access Token** (not your GitHub password)
  - Create token at: https://github.com/settings/tokens
  - Select `repo` scope
  - Copy the token and use it as your password

## Verify Upload

After pushing, check your repository at:
https://github.com/LeThienKhiem/Ecommerce

All your code should now be visible!


