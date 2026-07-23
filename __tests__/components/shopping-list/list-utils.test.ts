import {
  buildListData,
  formatPrice,
  getCartTotals,
  getDisplayPrice,
  getPriceColor,
  splitSections,
} from '../../../components/shopping-list/list-utils';
import type { CartItem, Product } from '../../../types';

const baseProducts: Product[] = [
  { id: 'p1', name: 'Arroz', expectedPrice: 8.49 },
  { id: 'p2', name: 'Feijão', expectedPrice: 9.99 },
  { id: 'p3', name: 'Café' },
];

describe('splitSections', () => {
  it('splits items by inCart flag', () => {
    const items: CartItem[] = [
      { productId: 'p1', quantity: 1, inCart: false },
      { productId: 'p2', quantity: 2, inCart: true },
      { productId: 'p3', quantity: 1, inCart: false },
    ];

    const result = splitSections(items);

    expect(result.listed).toHaveLength(2);
    expect(result.picked).toHaveLength(1);
    expect(result.listed.map((i) => i.productId)).toEqual(['p1', 'p3']);
    expect(result.picked[0].productId).toBe('p2');
  });

  it('returns empty arrays for empty input', () => {
    const result = splitSections([]);
    expect(result.listed).toEqual([]);
    expect(result.picked).toEqual([]);
  });

  it('handles all items in cart', () => {
    const items: CartItem[] = [
      { productId: 'p1', quantity: 1, inCart: true },
      { productId: 'p2', quantity: 1, inCart: true },
    ];
    const result = splitSections(items);
    expect(result.listed).toEqual([]);
    expect(result.picked).toHaveLength(2);
  });

  it('handles all items not in cart', () => {
    const items: CartItem[] = [{ productId: 'p1', quantity: 1, inCart: false }];
    const result = splitSections(items);
    expect(result.listed).toHaveLength(1);
    expect(result.picked).toEqual([]);
  });
});

describe('buildListData', () => {
  it('builds flat list with section headers', () => {
    const items: CartItem[] = [
      { productId: 'p1', quantity: 1, inCart: false },
      { productId: 'p2', quantity: 2, inCart: true },
    ];

    const result = buildListData(items, 'Encontrados', 'Carrinho');

    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({
      type: 'header',
      title: 'Encontrados',
      sectionKey: 'section-listed',
    });
    expect(result[1]).toEqual({ type: 'item', item: items[0], key: 'item-p1' });
    expect(result[2]).toEqual({ type: 'header', title: 'Carrinho', sectionKey: 'section-cart' });
    expect(result[3]).toEqual({ type: 'item', item: items[1], key: 'item-p2' });
  });

  it('omits header when section is empty', () => {
    const items: CartItem[] = [{ productId: 'p1', quantity: 1, inCart: true }];

    const result = buildListData(items, 'Encontrados', 'Carrinho');

    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('header');
    expect((result[0] as { title: string }).title).toBe('Carrinho');
  });

  it('returns empty array for no items', () => {
    expect(buildListData([], 'Encontrados', 'Carrinho')).toEqual([]);
  });
});

describe('getCartTotals', () => {
  it('computes totals correctly', () => {
    const items: CartItem[] = [
      { productId: 'p1', quantity: 2, inCart: false },
      { productId: 'p2', quantity: 1, inCart: true, currentPrice: 10.0 },
    ];

    const result = getCartTotals(items, baseProducts);

    expect(result.totalCount).toBe(2);
    expect(result.listedCount).toBe(1);
    expect(result.cartCount).toBe(1);
    expect(result.totalCost).toBeCloseTo(8.49 * 2 + 10.0);
    expect(result.cartCost).toBeCloseTo(10.0);
  });

  it('uses expectedPrice when no currentPrice', () => {
    const items: CartItem[] = [{ productId: 'p1', quantity: 3, inCart: false }];

    const result = getCartTotals(items, baseProducts);

    expect(result.totalCost).toBeCloseTo(8.49 * 3);
  });

  it('handles items with no price at all', () => {
    const items: CartItem[] = [{ productId: 'p3', quantity: 1, inCart: false }];

    const result = getCartTotals(items, baseProducts);

    expect(result.totalCount).toBe(1);
    expect(result.totalCost).toBe(0);
  });

  it('returns zeros for empty items', () => {
    const result = getCartTotals([], baseProducts);
    expect(result.totalCount).toBe(0);
    expect(result.listedCount).toBe(0);
    expect(result.cartCount).toBe(0);
    expect(result.totalCost).toBe(0);
    expect(result.cartCost).toBe(0);
  });
});

describe('getDisplayPrice', () => {
  it('shows currentPrice when set', () => {
    const item: CartItem = { productId: 'p1', quantity: 1, inCart: false, currentPrice: 7.99 };
    const result = getDisplayPrice(item, baseProducts[0]);
    expect(result).toContain('7,99');
  });

  it('falls back to expectedPrice', () => {
    const item: CartItem = { productId: 'p1', quantity: 1, inCart: false };
    const result = getDisplayPrice(item, baseProducts[0]);
    expect(result).toContain('8,49');
  });

  it('shows "Sem preço" when no prices', () => {
    const item: CartItem = { productId: 'p3', quantity: 1, inCart: false };
    expect(getDisplayPrice(item, baseProducts[2])).toBe('Sem preço');
  });

  it('shows "Sem preço" when product not found', () => {
    const item: CartItem = { productId: 'unknown', quantity: 1, inCart: false };
    expect(getDisplayPrice(item)).toBe('Sem preço');
  });
});

describe('getPriceColor', () => {
  it('returns green when currentPrice <= expectedPrice', () => {
    const item: CartItem = { productId: 'p1', quantity: 1, inCart: false, currentPrice: 5.0 };
    expect(getPriceColor(item, baseProducts[0])).toBe('green');
  });

  it('returns green when prices are equal', () => {
    const item: CartItem = { productId: 'p1', quantity: 1, inCart: false, currentPrice: 8.49 };
    expect(getPriceColor(item, baseProducts[0])).toBe('green');
  });

  it('returns red when currentPrice > expectedPrice', () => {
    const item: CartItem = { productId: 'p1', quantity: 1, inCart: false, currentPrice: 15.0 };
    expect(getPriceColor(item, baseProducts[0])).toBe('red');
  });

  it('returns null when no currentPrice', () => {
    const item: CartItem = { productId: 'p1', quantity: 1, inCart: false };
    expect(getPriceColor(item, baseProducts[0])).toBeNull();
  });

  it('returns null when no expectedPrice', () => {
    const item: CartItem = { productId: 'p3', quantity: 1, inCart: false, currentPrice: 5.0 };
    expect(getPriceColor(item, baseProducts[2])).toBeNull();
  });
});

describe('formatPrice', () => {
  it('formats BRL currency', () => {
    const result = formatPrice(10.5);
    expect(result).toContain('10,50');
    expect(result).toContain('R$');
  });

  it('formats zero', () => {
    const result = formatPrice(0);
    expect(result).toContain('0,00');
    expect(result).toContain('R$');
  });
});
