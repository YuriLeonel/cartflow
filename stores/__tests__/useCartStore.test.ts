import type { Cart } from '../../types';

const mockStorage = new Map<string, string>();
const mockSetFn = jest.fn((name: string, value: string) => {
  mockStorage.set(name, value);
});

jest.mock('../../lib/storage', () => ({
  zustandMMKVStorage: {
    getItem: (name: string) => mockStorage.get(name) ?? null,
    setItem: (...args: unknown[]) => mockSetFn(...(args as [string, string])),
    removeItem: (name: string) => {
      mockStorage.delete(name);
    },
  },
}));

jest.mock('expo-crypto', () => ({
  randomUUID: () => `test-uuid-${Math.random().toString(36).slice(2, 10)}`,
}));

import { useCartStore, validateCartName, validateQuantity } from '../useCartStore';

const resetStore = () => {
  useCartStore.setState({ carts: [], activeCartId: null });
  mockStorage.clear();
  mockSetFn.mockClear();
};

beforeEach(() => {
  resetStore();
});

describe('validateCartName', () => {
  it('returns error for empty name', () => {
    expect(validateCartName('')).toBe('error.cart.name.required');
  });

  it('returns error for whitespace-only name', () => {
    expect(validateCartName('   ')).toBe('error.cart.name.required');
  });

  it('returns error for name exceeding 50 characters', () => {
    expect(validateCartName('A'.repeat(51))).toBe('error.cart.name.maxLength');
  });

  it('returns null for valid name', () => {
    expect(validateCartName('Compras do mês')).toBeNull();
  });

  it('returns null for name with exactly 50 characters', () => {
    expect(validateCartName('A'.repeat(50))).toBeNull();
  });

  it('trims and validates', () => {
    expect(validateCartName('   ')).toBe('error.cart.name.required');
  });
});

describe('validateQuantity', () => {
  it('returns error for zero', () => {
    expect(validateQuantity(0)).toBe('error.cart.quantity.positive');
  });

  it('returns error for negative', () => {
    expect(validateQuantity(-1)).toBe('error.cart.quantity.positive');
  });

  it('returns error for non-integer', () => {
    expect(validateQuantity(1.5)).toBe('error.cart.quantity.positive');
  });

  it('returns error for quantity exceeding 999', () => {
    expect(validateQuantity(1000)).toBe('error.cart.quantity.max');
  });

  it('returns null for valid quantity', () => {
    expect(validateQuantity(1)).toBeNull();
    expect(validateQuantity(500)).toBeNull();
    expect(validateQuantity(999)).toBeNull();
  });
});

describe('useCartStore', () => {
  describe('initial state', () => {
    it('starts with empty carts and no active cart', () => {
      const { carts, activeCartId } = useCartStore.getState();
      expect(carts).toEqual([]);
      expect(activeCartId).toBeNull();
    });
  });

  describe('addCart', () => {
    it('adds a cart with generated ID and empty items', () => {
      const error = useCartStore.getState().addCart('Compras do mês');

      expect(error).toBeNull();
      const { carts } = useCartStore.getState();
      expect(carts).toHaveLength(1);
      expect(carts[0].id).toMatch(/^cart_test-uuid-/);
      expect(carts[0].name).toBe('Compras do mês');
      expect(carts[0].items).toEqual([]);
    });

    it('trims cart name', () => {
      useCartStore.getState().addCart('  Lista  ');

      expect(useCartStore.getState().carts[0].name).toBe('Lista');
    });

    it('returns error for empty name', () => {
      const error = useCartStore.getState().addCart('');

      expect(error).toBe('error.cart.name.required');
      expect(useCartStore.getState().carts).toHaveLength(0);
    });

    it('returns error for name exceeding 50 characters', () => {
      const error = useCartStore.getState().addCart('A'.repeat(51));

      expect(error).toBe('error.cart.name.maxLength');
      expect(useCartStore.getState().carts).toHaveLength(0);
    });

    it('sets createdAt and updatedAt to same value', () => {
      useCartStore.getState().addCart('Test');

      const cart = useCartStore.getState().carts[0];
      expect(cart.createdAt).toBeTruthy();
      expect(cart.updatedAt).toBe(cart.createdAt);
    });
  });

  describe('removeCart', () => {
    it('removes cart by ID', () => {
      useCartStore.setState({
        carts: [
          { id: 'c1', name: 'A', items: [], createdAt: '', updatedAt: '' },
          { id: 'c2', name: 'B', items: [], createdAt: '', updatedAt: '' },
        ],
      });

      useCartStore.getState().removeCart('c1');

      const { carts } = useCartStore.getState();
      expect(carts).toHaveLength(1);
      expect(carts[0].id).toBe('c2');
    });

    it('clears activeCartId if removed cart was active', () => {
      useCartStore.setState({
        carts: [
          { id: 'c1', name: 'A', items: [], createdAt: '', updatedAt: '' },
          { id: 'c2', name: 'B', items: [], createdAt: '', updatedAt: '' },
        ],
        activeCartId: 'c1',
      });

      useCartStore.getState().removeCart('c1');

      expect(useCartStore.getState().activeCartId).toBeNull();
    });

    it('keeps activeCartId if removed cart was not active', () => {
      useCartStore.setState({
        carts: [
          { id: 'c1', name: 'A', items: [], createdAt: '', updatedAt: '' },
          { id: 'c2', name: 'B', items: [], createdAt: '', updatedAt: '' },
        ],
        activeCartId: 'c2',
      });

      useCartStore.getState().removeCart('c1');

      expect(useCartStore.getState().activeCartId).toBe('c2');
    });
  });

  describe('renameCart', () => {
    it('renames cart and updates updatedAt', () => {
      useCartStore.setState({
        carts: [
          { id: 'c1', name: 'Old', items: [], createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        ],
      });

      const error = useCartStore.getState().renameCart('c1', 'New');

      expect(error).toBeNull();
      const cart = useCartStore.getState().carts[0];
      expect(cart.name).toBe('New');
      expect(cart.updatedAt).not.toBe('2024-01-01');
    });

    it('returns error for empty name', () => {
      useCartStore.setState({
        carts: [{ id: 'c1', name: 'A', items: [], createdAt: '', updatedAt: '' }],
      });

      const error = useCartStore.getState().renameCart('c1', '');

      expect(error).toBe('error.cart.name.required');
      expect(useCartStore.getState().carts[0].name).toBe('A');
    });
  });

  describe('addItem', () => {
    const baseCarts: Cart[] = [
      { id: 'c1', name: 'Lista', items: [], createdAt: '', updatedAt: '' },
    ];

    it('adds new item to cart', () => {
      useCartStore.setState({ carts: baseCarts });

      const error = useCartStore.getState().addItem('c1', 'p1', 2);

      expect(error).toBeNull();
      const items = useCartStore.getState().carts[0].items;
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({ productId: 'p1', quantity: 2 });
    });

    it('increments quantity when adding duplicate product', () => {
      useCartStore.setState({
        carts: [
          { id: 'c1', name: 'L', items: [{ productId: 'p1', quantity: 2 }], createdAt: '', updatedAt: '' },
        ],
      });

      useCartStore.getState().addItem('c1', 'p1', 3);

      const items = useCartStore.getState().carts[0].items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(5);
    });

    it('does not affect other carts', () => {
      useCartStore.setState({
        carts: [
          { id: 'c1', name: 'A', items: [], createdAt: '', updatedAt: '' },
          { id: 'c2', name: 'B', items: [], createdAt: '', updatedAt: '' },
        ],
      });

      useCartStore.getState().addItem('c1', 'p1', 1);

      expect(useCartStore.getState().carts[1].items).toHaveLength(0);
    });

    it('returns error for invalid quantity', () => {
      useCartStore.setState({ carts: baseCarts });

      expect(useCartStore.getState().addItem('c1', 'p1', 0)).toBe('error.cart.quantity.positive');
      expect(useCartStore.getState().addItem('c1', 'p1', -1)).toBe('error.cart.quantity.positive');
      expect(useCartStore.getState().addItem('c1', 'p1', 1000)).toBe('error.cart.quantity.max');
      expect(useCartStore.getState().carts[0].items).toHaveLength(0);
    });
  });

  describe('removeItem', () => {
    it('removes item from cart', () => {
      useCartStore.setState({
        carts: [
          {
            id: 'c1',
            name: 'L',
            items: [
              { productId: 'p1', quantity: 1 },
              { productId: 'p2', quantity: 2 },
            ],
            createdAt: '',
            updatedAt: '',
          },
        ],
      });

      useCartStore.getState().removeItem('c1', 'p1');

      const items = useCartStore.getState().carts[0].items;
      expect(items).toHaveLength(1);
      expect(items[0].productId).toBe('p2');
    });

    it('does nothing if product not in cart', () => {
      useCartStore.setState({
        carts: [
          {
            id: 'c1',
            name: 'L',
            items: [{ productId: 'p1', quantity: 1 }],
            createdAt: '',
            updatedAt: '',
          },
        ],
      });

      useCartStore.getState().removeItem('c1', 'p99');

      expect(useCartStore.getState().carts[0].items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('sets new quantity', () => {
      useCartStore.setState({
        carts: [
          {
            id: 'c1',
            name: 'L',
            items: [{ productId: 'p1', quantity: 1 }],
            createdAt: '',
            updatedAt: '',
          },
        ],
      });

      useCartStore.getState().updateQuantity('c1', 'p1', 5);

      expect(useCartStore.getState().carts[0].items[0].quantity).toBe(5);
    });

    it('removes item when quantity is 0', () => {
      useCartStore.setState({
        carts: [
          {
            id: 'c1',
            name: 'L',
            items: [{ productId: 'p1', quantity: 1 }],
            createdAt: '',
            updatedAt: '',
          },
        ],
      });

      useCartStore.getState().updateQuantity('c1', 'p1', 0);

      expect(useCartStore.getState().carts[0].items).toHaveLength(0);
    });

    it('removes item when quantity is negative', () => {
      useCartStore.setState({
        carts: [
          {
            id: 'c1',
            name: 'L',
            items: [{ productId: 'p1', quantity: 5 }],
            createdAt: '',
            updatedAt: '',
          },
        ],
      });

      useCartStore.getState().updateQuantity('c1', 'p1', -1);

      expect(useCartStore.getState().carts[0].items).toHaveLength(0);
    });

    it('does not affect other items', () => {
      useCartStore.setState({
        carts: [
          {
            id: 'c1',
            name: 'L',
            items: [
              { productId: 'p1', quantity: 1 },
              { productId: 'p2', quantity: 3 },
            ],
            createdAt: '',
            updatedAt: '',
          },
        ],
      });

      useCartStore.getState().updateQuantity('c1', 'p1', 10);

      const items = useCartStore.getState().carts[0].items;
      expect(items[0].quantity).toBe(10);
      expect(items[1].quantity).toBe(3);
    });
  });

  describe('setActiveCart', () => {
    it('sets active cart ID', () => {
      useCartStore.getState().setActiveCart('c1');
      expect(useCartStore.getState().activeCartId).toBe('c1');
    });

    it('clears active cart ID', () => {
      useCartStore.setState({ activeCartId: 'c1' });
      useCartStore.getState().setActiveCart(null);
      expect(useCartStore.getState().activeCartId).toBeNull();
    });
  });

  describe('persistence', () => {
    it('persists carts to MMKV storage', () => {
      useCartStore.getState().addCart('Test Cart');

      const stored = mockStorage.get('cartflow-carts');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored as string);
      expect(parsed.state.carts).toHaveLength(1);
      expect(parsed.state.carts[0].name).toBe('Test Cart');
    });

    it('loads persisted carts on rehydration', async () => {
      const mockData = {
        state: {
          carts: [
            {
              id: 'c1',
              name: 'Persisted Cart',
              items: [{ productId: 'p1', quantity: 2 }],
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
            },
          ],
          activeCartId: null,
        },
        version: 2,
      };
      mockStorage.set('cartflow-carts', JSON.stringify(mockData));

      await useCartStore.persist.rehydrate();

      const { carts } = useCartStore.getState();
      expect(carts).toHaveLength(1);
      expect(carts[0].name).toBe('Persisted Cart');
      expect(carts[0].items).toHaveLength(1);
    });

    it('migrates v1 format (CartSummary[]) to v2 (Cart[])', async () => {
      const v1Data = {
        state: {
          carts: [
            { id: 'c1', name: 'Old Cart', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
          ],
          activeCartId: null,
        },
        version: 1,
      };
      mockStorage.set('cartflow-carts', JSON.stringify(v1Data));

      await useCartStore.persist.rehydrate();

      const { carts } = useCartStore.getState();
      expect(carts).toHaveLength(1);
      expect(carts[0].id).toBe('c1');
      expect(carts[0].name).toBe('Old Cart');
      expect(carts[0].items).toEqual([]);
    });
  });
});
