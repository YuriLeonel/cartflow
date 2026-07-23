export interface Product {
  id: string;
  name: string;
  /** Reserved for future barcode scanning feature (SoftList reference). Currently unused. */
  barcode?: string;
  category?: string;
  expectedPrice?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  currentPrice?: number;
  inCart: boolean;
}

export interface Cart {
  id: string;
  name: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
