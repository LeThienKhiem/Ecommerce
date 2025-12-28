export interface Order {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  total_price: number;
  payment_method: 'local_transfer' | 'cod';
  status?: 'pending' | 'done';
  products: Array<{
    product_id?: number;
    title: string;
    slug: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  created_at: string;
  updated_at: string;
}





