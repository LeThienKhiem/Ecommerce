# Favicon Setup Instructions

To add your favicon image to the Next.js app:

## Method 1: Using favicon.ico (Recommended)

1. Convert your image to `.ico` format (or use `.png`)
2. Place the file in the `app` directory as one of these names:
   - `favicon.ico` - Traditional favicon
   - `icon.png` or `icon.jpg` - Modern favicon (PNG/JPG)
   - `apple-icon.png` - For Apple devices (180x180px recommended)

Next.js will automatically detect these files and serve them as favicons.

## Method 2: Using a Different Name/Location

If you want to use a different filename or location:

1. Place your image file in the `public` directory (e.g., `public/favicon.ico`)
2. The metadata in `app/layout.tsx` is already configured to use `/favicon.ico`

## File Requirements

- **favicon.ico**: 16x16, 32x32, or 48x48 pixels (multi-resolution ICO file)
- **icon.png**: 32x32 or 64x64 pixels (PNG format)
- **apple-icon.png**: 180x180 pixels (for Apple devices)

## Quick Setup

1. Save your image as `favicon.ico` or `icon.png`
2. Place it in the `app/` directory
3. Restart your dev server (`npm run dev`)
4. The favicon will appear automatically!

## Note

The layout.tsx file has been updated to include icon metadata. Once you add the favicon file to the `app` directory, it will be automatically detected and used.



