import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const baseUrl = 'https://kilolook.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic routes - Fetch products
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('slug, created_at')
      .eq('is_published', true);

    if (error) {
      console.error('Error fetching products for sitemap:', error);
      return staticRoutes;
    }

    // Map products to sitemap entries
    const productRoutes: MetadataRoute.Sitemap = (products || []).map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.created_at ? new Date(product.created_at) : new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // Combine static and dynamic routes
    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return only static routes if there's an error
    return staticRoutes;
  }
}

