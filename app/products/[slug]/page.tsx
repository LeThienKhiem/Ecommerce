export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImageGallery from "@/components/ProductImageGallery";

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
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
        <Link 
          href="/products" 
          className="inline-flex items-center text-gray-600 hover:text-apple-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay Lại Sản Phẩm
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <ProductImageGallery
            mainImage={mainImage}
            galleryImages={galleryImages}
            productTitle={product.title}
            discount={discount}
          />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                {product.category}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-semibold text-apple-gray-900">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 py-4 border-t border-b border-gray-200">
              <div className="flex items-baseline gap-3">
                {originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {originalPrice}k
                  </span>
                )}
                <span className="text-4xl font-semibold text-apple-gray-900">
                  {price}k
                </span>
                <span className="text-lg text-gray-600">VND</span>
              </div>
              {discount && (
                <span className="text-sm text-red-500 font-medium">
                  Tiết kiệm {discount}%
                </span>
              )}
            </div>

            {/* Shipping Info */}
            <div className="text-green-600 font-bold">
              🚚 Thời gian giao hàng dự kiến: 7 - 10 ngày
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-apple-gray-900">
                  Mô Tả
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              {product.affiliate_link ? (
                <a
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-apple-blue text-white py-3 rounded-full hover:bg-blue-600 transition-colors font-medium text-center block"
                >
                  Mua ngay giá rẻ
                </a>
              ) : (
                <>
                  <AddToCartButton product={product} />
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 text-apple-gray-900 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    Thanh Toán
                  </Link>
                </>
              )}
            </div>

            {/* Product Info Table */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">
                Thông Tin Sản Phẩm
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.category && (
                  <>
                    <div className="text-gray-600">Danh Mục</div>
                    <div className="text-apple-gray-900 font-medium">{product.category}</div>
                  </>
                )}
                {product.slug && (
                  <>
                    <div className="text-gray-600">Mã Sản Phẩm</div>
                    <div className="text-apple-gray-900 font-medium">{product.slug}</div>
                  </>
                )}
              </div>
            </div>

            {/* Tags - Minimal Footer Style */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-4">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      </div>
    </>
  );
}

