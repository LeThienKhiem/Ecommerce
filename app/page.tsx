export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";

async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

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

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const allProducts = await getAllProducts();
  const searchQuery = searchParams.search || "";
  
  // Filter products based on search query (case-insensitive)
  const filteredProducts = searchQuery
    ? allProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allProducts.slice(0, 6); // Show first 6 as featured if no search
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      {!searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-semibold text-apple-gray-900 mb-6">
            Discover Your Style
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Curated products designed for your lifestyle
          </p>
          <Link
            href="/products"
            className="inline-block bg-apple-blue text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Shop Now
          </Link>
        </section>
      )}

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-apple-gray-900 mb-12 text-center">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Products"}
        </h2>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id || product.slug} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `No products found matching "${searchQuery}"`
                : "No products available at the moment."}
            </p>
            {searchQuery && (
              <Link
                href="/"
                className="text-apple-blue hover:underline"
              >
                Clear search and view all products
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
              <h4 className="font-semibold text-apple-gray-900 mb-4">Kilolook Store</h4>
              <p className="text-sm text-gray-600">
                Modern e-commerce experience
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-apple-gray-900 mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/products" className="hover:text-apple-gray-900 transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=featured" className="hover:text-apple-gray-900 transition-colors">
                    Featured
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-apple-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-apple-gray-900 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-apple-gray-900 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-apple-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/privacy" className="hover:text-apple-gray-900 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-apple-gray-900 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Kilolook Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

