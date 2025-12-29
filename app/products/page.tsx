export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import Header from "@/components/Header";
import ProductsContent from "./ProductsContent";

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
      <ProductsContent products={products} selectedGroup={selectedGroup} />
    </div>
  );
}


