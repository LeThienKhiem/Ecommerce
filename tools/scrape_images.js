const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Get URL from command-line argument
const url = process.argv[2];

if (!url) {
  console.error('Error: Please provide a URL as an argument');
  console.error('Usage: node tools/scrape_images.js <URL>');
  process.exit(1);
}

// Validate URL format
try {
  new URL(url);
} catch (error) {
  console.error('Error: Invalid URL format');
  process.exit(1);
}

async function scrapeImages() {
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set a realistic viewport size
    await page.setViewport({ width: 1920, height: 1080 });

    console.log(`Navigating to: ${url}`);
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Auto-scrolling to trigger lazy loading...');
    
    // Auto-scroll function to load lazy-loaded images
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            // Wait a bit more for any remaining images to load
            setTimeout(resolve, 2000);
          }
        }, 100);
      });
    });

    console.log('Extracting images...');
    
    // Extract all image URLs
    const images = await page.evaluate(() => {
      const imageElements = document.querySelectorAll('img');
      const imageUrls = new Set();

      imageElements.forEach((img) => {
        // Get src or data-src (for lazy loading)
        let imageUrl = img.src || 
                      img.getAttribute('data-src') || 
                      img.getAttribute('data-lazy-src') || 
                      img.getAttribute('data-original') ||
                      img.getAttribute('data-url');
        
        if (!imageUrl) return;

        // Skip base64 images
        if (imageUrl.startsWith('data:')) return;

        // Skip SVG images
        if (imageUrl.includes('.svg') || imageUrl.endsWith('.svg')) return;

        // Convert relative URLs to absolute
        try {
          const urlObj = new URL(imageUrl, window.location.origin);
          imageUrl = urlObj.href;
        } catch (e) {
          return; // Skip invalid URLs
        }

        // Get dimensions from the img element
        // naturalWidth/naturalHeight are the actual dimensions after image loads
        // width/height are the displayed dimensions (might be CSS-scaled)
        const width = img.naturalWidth || img.width || 0;
        const height = img.naturalHeight || img.height || 0;

        // Filter out small images (less than 200x200)
        // If dimensions are 0 or very small, skip (likely placeholder or not loaded)
        if (width > 0 && height > 0 && (width < 200 || height < 200)) {
          return;
        }

        // If we can't determine size, include it anyway (might be lazy-loaded)
        // The user can manually filter these later if needed
        imageUrls.add(imageUrl);
      });

      return Array.from(imageUrls);
    });

    // Additional filtering: exclude common icon/logo paths and duplicates
    const finalImages = images.filter((url, index, self) => {
      // Remove duplicates (in case same URL appears with different query params)
      const baseUrl = url.split('?')[0];
      if (self.findIndex(u => u.split('?')[0] === baseUrl) !== index) {
        return false;
      }

      const lowerUrl = url.toLowerCase();
      return !lowerUrl.includes('/icon') && 
             !lowerUrl.includes('/logo') && 
             !lowerUrl.includes('/avatar') &&
             !lowerUrl.includes('favicon') &&
             !lowerUrl.includes('/badge') &&
             !lowerUrl.includes('/button') &&
             !lowerUrl.includes('placeholder');
    });

    console.log(`\nFound ${finalImages.length} unique images`);

    // Ensure tools directory exists
    const toolsDir = path.join(__dirname);
    try {
      await fs.access(toolsDir);
    } catch {
      await fs.mkdir(toolsDir, { recursive: true });
    }

    // Write to file
    const outputPath = path.join(toolsDir, 'image_list.txt');
    const content = finalImages.join('\n');
    await fs.writeFile(outputPath, content, 'utf-8');

    console.log(`\n✓ Saved ${finalImages.length} image URLs to: ${outputPath}`);
    console.log('\nFirst few images:');
    finalImages.slice(0, 5).forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the scraper
scrapeImages();

