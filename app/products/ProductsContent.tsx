"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductsContentProps {
  products: Product[];
  selectedGroup: string;
}

export default function ProductsContent({ products, selectedGroup }: ProductsContentProps) {
  const { t } = useLanguage();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-flex items-center text-gray-600 hover:text-apple-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t.back_to_home}
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-semibold text-apple-gray-900 mb-4">
          {t.products_all_products}
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
          {t.all}
        </Link>
        <Link
          href="/products?group=Nam"
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            selectedGroup === "Nam"
              ? "border-apple-blue text-apple-blue"
              : "border-transparent text-gray-600 hover:text-apple-gray-900"
          }`}
        >
          {t.men}
        </Link>
        <Link
          href="/products?group=Nữ"
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            selectedGroup === "Nữ"
              ? "border-apple-blue text-apple-blue"
              : "border-transparent text-gray-600 hover:text-apple-gray-900"
          }`}
        >
          {t.women}
        </Link>
        <Link
          href="/products?group=Trẻ em"
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            selectedGroup === "Trẻ em"
              ? "border-apple-blue text-apple-blue"
              : "border-transparent text-gray-600 hover:text-apple-gray-900"
          }`}
        >
          {t.kids}
        </Link>
      </div>

      {/* Results Count */}
      <div className="mb-8">
        <p className="text-lg text-gray-600">
          {t.products_found} {products.length} {products.length === 1 ? t.product_items : t.product_items}
          {selectedGroup && ` ${t.products_in_category} "${selectedGroup}"`}
        </p>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {products.map((product, index) => (
            <ProductCard key={product.id || product.slug} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">
            {t.products_no_products}
          </p>
        </div>
      )}
    </main>
  );
}


