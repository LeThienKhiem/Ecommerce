"use client";

import Link from "next/link";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface HomeContentProps {
  featuredProducts: Product[];
  searchQuery: string;
}

export default function HomeContent({ featuredProducts, searchQuery }: HomeContentProps) {
  const { t, lang } = useLanguage();

  return (
    <>
      {/* Hero Section */}
      {!searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-semibold text-apple-gray-900 mb-6">
            {t.home_hero_title}
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {t.home_hero_subtitle}
          </p>
          <Link
            href="/products"
            className="inline-block bg-apple-blue text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            {t.buy_now}
          </Link>
        </section>
      )}

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-apple-gray-900 mb-12 text-center">
          {searchQuery 
            ? `${t.home_search_results} "${searchQuery}"`
            : t.featured_products}
        </h2>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product: Product, index: number) => (
              <ProductCard key={product.id || product.slug} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `${t.home_no_search_results} "${searchQuery}"`
                : t.home_no_products}
            </p>
            {searchQuery && (
              <Link
                href="/"
                className="text-apple-blue hover:underline"
              >
                {t.home_clear_search}
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-apple-gray-900 mb-4">{t.home_footer_store}</h4>
              <p className="text-sm text-gray-600">
                {t.home_footer_tagline}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-apple-gray-900 mb-4">
                {t.home_footer_shop}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/products" className="hover:text-apple-gray-900 transition-colors">
                    {t.all_products}
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=featured" className="hover:text-apple-gray-900 transition-colors">
                    {t.home_footer_featured}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-apple-gray-900 mb-4">
                {t.home_footer_company}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-apple-gray-900 transition-colors">
                    {t.about}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-apple-gray-900 transition-colors">
                    {t.contact}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-apple-gray-900 mb-4">
                {t.home_footer_legal}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/privacy" className="hover:text-apple-gray-900 transition-colors">
                    {t.home_footer_privacy}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-apple-gray-900 transition-colors">
                    {t.home_footer_terms}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>
              &copy; {new Date().getFullYear()} {t.home_footer_store}. {t.home_footer_rights}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}




