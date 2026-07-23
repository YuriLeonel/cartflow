import type { CartItem, Product } from '@/types';

export interface SectionData {
  type: 'header';
  title: string;
  sectionKey: string;
}

export interface ItemData {
  type: 'item';
  item: CartItem;
  key: string;
}

export type ListItem = SectionData | ItemData;

export interface CartTotals {
  totalCount: number;
  listedCount: number;
  cartCount: number;
  totalCost: number;
  cartCost: number;
}

export function splitSections(items: CartItem[]): {
  listed: CartItem[];
  picked: CartItem[];
} {
  const listed: CartItem[] = [];
  const picked: CartItem[] = [];
  for (const item of items) {
    if (item.inCart) {
      picked.push(item);
    } else {
      listed.push(item);
    }
  }
  return { listed, picked };
}

export function buildListData(
  items: CartItem[],
  listedLabel: string,
  cartLabel: string,
): ListItem[] {
  const { listed, picked } = splitSections(items);
  const result: ListItem[] = [];

  if (listed.length > 0) {
    result.push({ type: 'header', title: listedLabel, sectionKey: 'section-listed' });
    for (const item of listed) {
      result.push({ type: 'item', item, key: `item-${item.productId}` });
    }
  }

  if (picked.length > 0) {
    result.push({ type: 'header', title: cartLabel, sectionKey: 'section-cart' });
    for (const item of picked) {
      result.push({ type: 'item', item, key: `item-${item.productId}` });
    }
  }

  return result;
}

export function getCartTotals(items: CartItem[], products: Product[]): CartTotals {
  const totalCount = items.length;
  let listedCount = 0;
  let cartCount = 0;
  let totalCost = 0;
  let cartCost = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    const price = item.currentPrice ?? product?.expectedPrice;

    if (item.inCart) {
      cartCount++;
      if (price !== undefined) {
        cartCost += price * item.quantity;
      }
    } else {
      listedCount++;
    }

    if (price !== undefined) {
      totalCost += price * item.quantity;
    }
  }

  return { totalCount, listedCount, cartCount, totalCost, cartCost };
}

export function getDisplayPrice(item: CartItem, product?: Product): string {
  if (item.currentPrice !== undefined) {
    return formatPrice(item.currentPrice);
  }
  if (product?.expectedPrice !== undefined) {
    return formatPrice(product.expectedPrice);
  }
  return 'Sem preço';
}

export function getPriceColor(item: CartItem, product?: Product): 'green' | 'red' | null {
  if (item.currentPrice !== undefined && product?.expectedPrice !== undefined) {
    return item.currentPrice <= product.expectedPrice ? 'green' : 'red';
  }
  return null;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}
