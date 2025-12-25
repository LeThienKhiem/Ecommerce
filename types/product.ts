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
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}


