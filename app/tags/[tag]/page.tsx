export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

async function getProductsByTag(tag: string): Promise<Product[]> {
  try {
    // Fetch all published products and filter by tag in JavaScript
    // Supabase doesn't have a direct array contains filter for text arrays
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products by tag:", error);
      return [];
    }

    // Filter products where tags array contains the specified tag
    const filteredProducts = (data || []).filter((product: Product) => {
      return product.tags && product.tags.length > 0 && product.tags.includes(tag);
    });

    return filteredProducts;
  } catch (error) {
    console.error("Error fetching products by tag:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Promise<Metadata> {
  const decodedTag = decodeURIComponent(params.tag);
  return {
    title: `Top sản phẩm ${decodedTag} mới nhất - Kilolook`,
    description: `Khám phá bộ sưu tập sản phẩm ${decodedTag} mới nhất tại Kilolook. Chất lượng tốt, giá cả hợp lý.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: { tag: string };
}) {
  const decodedTag = decodeURIComponent(params.tag);
  const products = await getProductsByTag(decodedTag);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-apple-gray-900 mb-4">
            Top sản phẩm {decodedTag} mới nhất
          </h1>
          <p className="text-lg text-gray-600">
            Tìm thấy {products.length} {products.length === 1 ? "sản phẩm" : "sản phẩm"} với tag &quot;{decodedTag}&quot;
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id || product.slug} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">
              Không tìm thấy sản phẩm nào với tag &quot;{decodedTag}&quot;
            </p>
          </div>
        )}
      </main>
    </div>
  );
}


