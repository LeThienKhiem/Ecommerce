export interface WholesaleContact {
  id: number;
  name: string;
  phone: string;
  address: string;
  message: string | null;
  status: "open" | "closed";
  created_at: string;
  updated_at?: string;
}




