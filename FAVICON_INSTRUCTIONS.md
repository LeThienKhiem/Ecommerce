# How to Add Favicon in Next.js 13+ App Router

The favicon isn't appearing because there's no favicon file in the `app` directory.

## Solution: Add Favicon File to `app/` Directory

In Next.js 13+ App Router, you can add a favicon by placing icon files directly in the `app` directory. Next.js will automatically detect and serve them.

### Step 1: Prepare Your Image

1. Get your favicon image (the colorful mosaic icon you showed)
2. Convert it to one of these formats:
   - **favicon.ico** (traditional, 16x16, 32x32, or 48x48 pixels)
   - **icon.png** (32x32 or 64x64 pixels recommended)
   - **apple-icon.png** (180x180 pixels for Apple devices)

### Step 2: Place File in `app/` Directory

Place the file directly in the `app/` folder:

```
app/
  ├── favicon.ico  ← Add your favicon here
  ├── layout.tsx
  ├── page.tsx
  └── ...
```

OR use multiple files:

```
app/
  ├── icon.png          ← Standard favicon
  ├── apple-icon.png    ← For Apple devices
  ├── layout.tsx
  └── ...
```

### Step 3: Restart Dev Server

After adding the file, restart your Next.js dev server:
```bash
npm run dev
```

### Step 4: Clear Browser Cache

Browsers cache favicons aggressively. To see the new favicon:
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or clear browser cache
- Or open in incognito/private mode

## Alternative: Use Metadata API (Optional)

If you want to explicitly configure the icon in code, you can update `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Kilolook Store",
  description: "Modern minimalist e-commerce store",
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};
```

But this is optional - Next.js will auto-detect files in the `app/` directory.

## Recommended File Names

Next.js automatically recognizes these file names:
- `favicon.ico`
- `icon.png` or `icon.jpg`
- `apple-icon.png`
- `icon.svg`

## Note

Since I don't have access to your actual image file, you'll need to:
1. Save the colorful mosaic icon you showed as a favicon file
2. Place it in the `app/` directory
3. Restart the dev server

Once you add the file, the favicon will appear automatically!

