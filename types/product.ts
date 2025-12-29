export interface Product {
  id?: number;
  title: string;
  slug: string;
  price_original: number;
  price_selling: number;
  description?: string;
  images?: string[];
  category?: string;
  source_url?: string;
  affiliate_link?: string;
  stock?: number;
  sizes?: string[];
  tags?: string[];
  is_published?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}


