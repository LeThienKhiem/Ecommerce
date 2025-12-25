export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          href="/products" 
          className="inline-flex items-center text-gray-600 hover:text-apple-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
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
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-apple-gray-900">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              <AddToCartButton product={product} />

              {product.source_url && (
                <a
                  href={product.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 text-apple-gray-900 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Source
                </a>
              )}
            </div>

            {/* Product Info Table */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">
                Product Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.category && (
                  <>
                    <div className="text-gray-600">Category</div>
                    <div className="text-apple-gray-900 font-medium">{product.category}</div>
                  </>
                )}
                {product.slug && (
                  <>
                    <div className="text-gray-600">SKU</div>
                    <div className="text-apple-gray-900 font-medium">{product.slug}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

