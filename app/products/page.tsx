export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";

async function getAllProducts(mainCategory?: string): Promise<Product[]> {
  try {
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_published", true);

    if (mainCategory) {
      query = query.eq("main_category", mainCategory);
    }

    const { data, error } = await query.order("sort_order", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { group?: string };
}) {
  const selectedGroup = searchParams.group || "";
  const products = await getAllProducts(selectedGroup || undefined);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-apple-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay Lại Trang Chủ
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold text-apple-gray-900 mb-4">
            Tất Cả Sản Phẩm
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12 flex flex-wrap gap-4 border-b border-gray-200">
          <Link
            href="/products"
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              !selectedGroup
                ? "border-apple-blue text-apple-blue"
                : "border-transparent text-gray-600 hover:text-apple-gray-900"
            }`}
          >
            Tất cả
          </Link>
          <Link
            href="/products?group=Nam"
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              selectedGroup === "Nam"
                ? "border-apple-blue text-apple-blue"
                : "border-transparent text-gray-600 hover:text-apple-gray-900"
            }`}
          >
            Nam
          </Link>
          <Link
            href="/products?group=Nữ"
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              selectedGroup === "Nữ"
                ? "border-apple-blue text-apple-blue"
                : "border-transparent text-gray-600 hover:text-apple-gray-900"
            }`}
          >
            Nữ
          </Link>
          <Link
            href="/products?group=Trẻ em"
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              selectedGroup === "Trẻ em"
                ? "border-apple-blue text-apple-blue"
                : "border-transparent text-gray-600 hover:text-apple-gray-900"
            }`}
          >
            Trẻ em
          </Link>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-lg text-gray-600">
            Tìm thấy {products.length} {products.length === 1 ? "sản phẩm" : "sản phẩm"}
            {selectedGroup && ` trong danh mục "${selectedGroup}"`}
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
              Hiện tại không có sản phẩm nào.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}


