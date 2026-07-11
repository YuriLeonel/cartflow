import type { Product } from '../../types';

const mockStorage = new Map<string, string>();

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: (key: string) => mockStorage.get(key) ?? null,
    set: (key: string, value: string) => {
      mockStorage.set(key, value);
    },
    delete: (key: string) => {
      mockStorage.delete(key);
    },
  })),
}));

import { useProductStore } from '../useProductStore';

const resetStore = () => {
  useProductStore.setState({ products: [] });
  mockStorage.clear();
};

beforeEach(() => {
  resetStore();
});

describe('useProductStore', () => {
  describe('initial state', () => {
    it('starts with an empty products array', () => {
      const { products } = useProductStore.getState();
      expect(products).toEqual([]);
    });
  });

  describe('addProduct', () => {
    it('adds a product with a generated ID', () => {
      const store = useProductStore.getState();
      const error = store.addProduct({
        name: 'Arroz 1kg',
        category: 'Grãos',
        expectedPrice: 8.99,
      });

      expect(error).toBeNull();
      const { products } = useProductStore.getState();
      expect(products).toHaveLength(1);
      expect(products[0].id).toMatch(/^product_\d+$/);
      expect(products[0].name).toBe('Arroz 1kg');
      expect(products[0].category).toBe('Grãos');
      expect(products[0].expectedPrice).toBe(8.99);
    });

    it('trims product name', () => {
      const store = useProductStore.getState();
      store.addProduct({ name: '  Café Pilão  ' });

      const { products } = useProductStore.getState();
      expect(products[0].name).toBe('Café Pilão');
    });

    it('returns error for empty name', () => {
      const store = useProductStore.getState();
      const error = store.addProduct({ name: '' });

      expect(error).toBe('error.product.name.required');
      expect(useProductStore.getState().products).toHaveLength(0);
    });

    it('returns error for whitespace-only name', () => {
      const store = useProductStore.getState();
      const error = store.addProduct({ name: '   ' });

      expect(error).toBe('error.product.name.required');
      expect(useProductStore.getState().products).toHaveLength(0);
    });

    it('returns error for name exceeding 100 characters', () => {
      const store = useProductStore.getState();
      const longName = 'A'.repeat(101);
      const error = store.addProduct({ name: longName });

      expect(error).toBe('error.product.name.maxLength');
      expect(useProductStore.getState().products).toHaveLength(0);
    });

    it('accepts name with exactly 100 characters', () => {
      const store = useProductStore.getState();
      const name = 'A'.repeat(100);
      const error = store.addProduct({ name });

      expect(error).toBeNull();
      expect(useProductStore.getState().products).toHaveLength(1);
    });

    it('returns error for non-positive expectedPrice', () => {
      const store = useProductStore.getState();

      expect(store.addProduct({ name: 'Test', expectedPrice: 0 })).toBe(
        'error.product.price.positive',
      );
      expect(store.addProduct({ name: 'Test', expectedPrice: -5 })).toBe(
        'error.product.price.positive',
      );
      expect(useProductStore.getState().products).toHaveLength(0);
    });

    it('accepts product without expectedPrice', () => {
      const store = useProductStore.getState();
      const error = store.addProduct({ name: 'Banana' });

      expect(error).toBeNull();
      expect(useProductStore.getState().products[0].expectedPrice).toBeUndefined();
    });

    it('accepts positive expectedPrice', () => {
      const store = useProductStore.getState();
      const error = store.addProduct({ name: 'Leite', expectedPrice: 5.69 });

      expect(error).toBeNull();
      expect(useProductStore.getState().products[0].expectedPrice).toBe(5.69);
    });
  });

  describe('removeProduct', () => {
    it('removes a product by ID', () => {
      useProductStore.setState({
        products: [
          { id: 'p_1', name: 'Arroz' },
          { id: 'p_2', name: 'Feijão' },
        ],
      });

      useProductStore.getState().removeProduct('p_1');

      const updated = useProductStore.getState().products;
      expect(updated).toHaveLength(1);
      expect(updated[0].id).toBe('p_2');
    });
  });

  describe('updateProduct', () => {
    it('updates product fields', () => {
      const store = useProductStore.getState();
      store.addProduct({ name: 'Café', expectedPrice: 10 });

      const { products } = useProductStore.getState();
      const id = products[0].id;

      useProductStore.getState().updateProduct(id, {
        name: 'Café Especial',
        expectedPrice: 15.99,
      });

      const updated = useProductStore.getState().products[0];
      expect(updated.name).toBe('Café Especial');
      expect(updated.expectedPrice).toBe(15.99);
    });
  });

  describe('seedIfEmpty', () => {
    it('populates empty store with seed data', () => {
      useProductStore.getState().seedIfEmpty();

      const { products } = useProductStore.getState();
      expect(products.length).toBeGreaterThanOrEqual(8);
      expect(products[0].id).toMatch(/^seed_\d+$/);
    });

    it('does NOT duplicate if products already exist', () => {
      const store = useProductStore.getState();
      store.addProduct({ name: 'Existing Product' });

      useProductStore.getState().seedIfEmpty();

      const { products } = useProductStore.getState();
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Existing Product');
    });

    it('seed data has required fields', () => {
      useProductStore.getState().seedIfEmpty();

      const { products } = useProductStore.getState();
      for (const product of products) {
        expect(product.id).toBeTruthy();
        expect(product.name).toBeTruthy();
        expect(product.name.length).toBeLessThanOrEqual(100);
      }
    });

    it('seed data covers multiple categories', () => {
      useProductStore.getState().seedIfEmpty();

      const { products } = useProductStore.getState();
      const categories = new Set(products.map((p) => p.category).filter(Boolean));
      expect(categories.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe('persistence', () => {
    it('persists products to MMKV storage', () => {
      const store = useProductStore.getState();
      store.addProduct({ name: 'Test Product', expectedPrice: 5 });

      const stored = mockStorage.get('cartflow-products');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored as string);
      expect(parsed.state.products).toHaveLength(1);
      expect(parsed.state.products[0].name).toBe('Test Product');
    });

    it('loads persisted products on rehydration', async () => {
      const mockData = {
        state: {
          products: [
            {
              id: 'product_1',
              name: 'Leite',
              category: 'Laticínios',
              expectedPrice: 5.69,
            },
          ],
        },
        version: 0,
      };
      mockStorage.set('cartflow-products', JSON.stringify(mockData));

      await useProductStore.persist.rehydrate();

      const { products } = useProductStore.getState();
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Leite');
    });
  });
});
