export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import HomeContent from "@/components/HomeContent";

async function getFeaturedProducts(searchQuery?: string): Promise<Product[]> {
  try {
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true);

    // Apply fuzzy search if search query is provided
    if (searchQuery && searchQuery.trim()) {
      const searchTerm = searchQuery.trim();
      
      // Search in title, description, and main_category using .or() and .ilike()
      // Format: column.ilike.%value% for partial matching
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,main_category.ilike.%${searchTerm}%`
      );

      // Tags search will be handled in JavaScript after fetching
    }

    const { data, error } = await query.order("sort_order", { ascending: false });

    if (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }

    let products = data || [];

    // Additional search for tags if search query exists
    // Since Supabase .or() already handled title/description/main_category,
    // we now check tags and add any matching products that weren't already included
    if (searchQuery && searchQuery.trim()) {
      const searchLower = searchQuery.trim().toLowerCase();
      
      // Fetch products that match tags (if not already in results)
      try {
        const { data: tagProducts, error: tagError } = await supabase
          .from("products")
          .select("*")
          .eq("is_published", true)
          .eq("is_featured", true);

        if (!tagError && tagProducts) {
          // Find products with matching tags that aren't already in results
          const existingIds = new Set(products.map((p: Product) => p.id));
          const tagMatches = tagProducts.filter((product: Product) => {
            // Skip if already in results
            if (existingIds.has(product.id)) return false;
            
            // Check if tags match
            if (product.tags && product.tags.length > 0) {
              return product.tags.some((tag: string) =>
                tag.toLowerCase().includes(searchLower)
              );
            }
            return false;
          });
          
          // Combine results
          products = [...products, ...tagMatches];
        }
      } catch (tagSearchError) {
        console.error("Error searching tags:", tagSearchError);
        // Continue with existing results if tag search fails
      }
    }

    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchQuery = searchParams.search || "";
  const featuredProducts = await getFeaturedProducts(searchQuery);
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HomeContent featuredProducts={featuredProducts} searchQuery={searchQuery} />
    </div>
  );
}

