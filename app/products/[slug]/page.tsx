export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import Header from "@/components/Header";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductDetailContent from "@/components/ProductDetailContent";
import ProductDetailBackButton from "@/components/ProductDetailBackButton";

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // First, try to find by main slug column
    let { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    // If found, return it
    if (!error && data) {
      return data;
    }

    // If not found, search in translations JSONB column
    // Fetch all published products and search manually (more reliable than complex JSONB queries)
    const { data: allProducts, error: allError } = await supabase
      .from("products")
      .select("*")
      .eq("is_published", true);

    if (allError || !allProducts) {
      return null;
    }

    // Search manually in translations
    const found = allProducts.find((product) => {
      // Check main slug first
      if (product.slug === slug) return true;
      
      // Check translations JSONB
      if (product.translations && typeof product.translations === 'object') {
        for (const lang in product.translations) {
          const translation = (product.translations as any)[lang];
          if (translation && typeof translation === 'object' && translation.slug === slug) {
            return true;
          }
        }
      }
      return false;
    });

    return found || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const baseUrl = 'https://kilolook.com';
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : null;
  const productImage = mainImage 
    ? (mainImage.startsWith('http') ? mainImage : `${baseUrl}${mainImage.startsWith('/') ? mainImage : `/${mainImage}`}`)
    : undefined;

  // Map tags array to keywords meta tag
  const keywords = product.tags && product.tags.length > 0
    ? product.tags.join(", ")
    : undefined;

  return {
    title: product.title,
    description: product.description || product.title,
    keywords: keywords,
    openGraph: {
      title: product.title,
      description: product.description || product.title,
      url: productUrl,
      images: productImage ? [productImage] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description || product.title,
      images: productImage ? [productImage] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const price = product.price_selling 
    ? (product.price_selling / 1000).toFixed(0) 
    : "0";
  const originalPrice = product.price_original 
    ? (product.price_original / 1000).toFixed(0) 
    : null;
  const discount = product.price_original && product.price_original > product.price_selling
    ? Math.round(((product.price_original - product.price_selling) / product.price_original) * 100)
    : null;

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : null;
  const galleryImages = product.images && product.images.length > 1 
    ? product.images.slice(1) 
    : [];

  // Prepare JSON-LD structured data
  const baseUrl = 'https://kilolook.com';
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const productImage = mainImage 
    ? (mainImage.startsWith('http') ? mainImage : `${baseUrl}${mainImage.startsWith('/') ? mainImage : `/${mainImage}`}`)
    : undefined;
  
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.title,
    offers: {
      '@type': 'Offer',
      price: product.price_selling,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: productUrl,
    },
  };

  // Only add image if it exists
  if (productImage) {
    jsonLd.image = productImage;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white">
        <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <ProductDetailBackButton />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <ProductImageGallery
            mainImage={mainImage}
            galleryImages={galleryImages}
            productTitle={product.title}
            discount={discount}
          />

          {/* Product Info */}
          <ProductDetailContent
            product={product}
            price={price}
            originalPrice={originalPrice}
            discount={discount}
          />
        </div>
      </main>
      </div>
    </>
  );
}

