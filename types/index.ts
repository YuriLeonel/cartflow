export interface Product {
  id: string;
  name: string;
  barcode?: string;
  category?: string;
  expectedPrice?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  currentPrice?: number;
}

export interface Cart {
  id: string;
  name: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
