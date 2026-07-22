import { fireEvent, render } from '@testing-library/react-native';
import type React from 'react';
import CartDetailScreen from '../cart-detail';

const mockCart = {
  id: 'c1',
  name: 'Compras do mês',
  items: [
    { productId: 'p1', quantity: 2 },
    { productId: 'p2', quantity: 1 },
  ],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const mockProducts = [
  { id: 'p1', name: 'Arroz 1kg', category: 'Grãos', expectedPrice: 8.49 },
  { id: 'p2', name: 'Feijão 1kg', category: 'Grãos', expectedPrice: 9.99 },
];

const mockRemoveItem = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockUpdateCurrentPrice = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@expo/vector-icons', () => {
  const ReactMock = require('react');
  return {
    Ionicons: (props: Record<string, unknown>) => ReactMock.createElement('Ionicons-mock', props),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({ cartId: 'c1' }),
}));

jest.mock('@legendapp/list/react-native', () => {
  const ReactMock = require('react');
  return {
    LegendList: function MockLegendList(props) {
      const data = props.data || [];
      return ReactMock.createElement(
        'LegendList-mock',
        null,
        data.map((item) => props.renderItem({ item })),
      );
    },
  };
});

const originalUseCartStore = jest.requireMock('@/stores/useCartStore').useCartStore;

jest.mock('@/stores/useCartStore', () => ({
  useCartStore: (
    selector: (state: {
      carts: (typeof mockCart)[];
      removeItem: typeof mockRemoveItem;
      updateQuantity: typeof mockUpdateQuantity;
      updateCurrentPrice: typeof mockUpdateCurrentPrice;
    }) => unknown,
  ) => {
    const state = {
      carts: [mockCart],
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
      updateCurrentPrice: mockUpdateCurrentPrice,
    };
    return selector(state);
  },
}));

jest.mock('@/stores/useProductStore', () => ({
  useProductStore: (selector: (state: { products: typeof mockProducts }) => unknown) => {
    return selector({ products: mockProducts });
  },
}));

describe('CartDetailScreen', () => {
  beforeEach(() => {
    mockRemoveItem.mockClear();
    mockUpdateQuantity.mockClear();
    mockUpdateCurrentPrice.mockClear();
    jest.requireMock('@/stores/useCartStore').useCartStore = originalUseCartStore;
  });

  it('renders cart name as title', async () => {
    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText('Compras do mês')).toBeTruthy();
  });

  it('renders item count', async () => {
    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText('2 cart.items')).toBeTruthy();
  });

  it('renders product names', async () => {
    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText('Arroz 1kg')).toBeTruthy();
    expect(getByText('Feijão 1kg')).toBeTruthy();
  });

  it('renders product categories', async () => {
    const { getAllByText } = await render(<CartDetailScreen />);
    expect(getAllByText('Grãos').length).toBeGreaterThanOrEqual(1);
  });

  it('renders product prices', async () => {
    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText(/8,49/)).toBeTruthy();
    expect(getByText(/9,99/)).toBeTruthy();
  });

  it('renders empty state when cart has no items', async () => {
    const emptyCart = { ...mockCart, items: [] };
    jest.requireMock('@/stores/useCartStore').useCartStore = (selector) => {
      return selector({
        carts: [emptyCart],
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        updateCurrentPrice: mockUpdateCurrentPrice,
      });
    };

    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText('cart.emptyState')).toBeTruthy();
  });

  it('renders add product button', async () => {
    const { getByLabelText } = await render(<CartDetailScreen />);
    expect(getByLabelText('cart.addItem')).toBeTruthy();
  });

  it('renders close button', async () => {
    const { getByLabelText } = await render(<CartDetailScreen />);
    expect(getByLabelText('common.cancel')).toBeTruthy();
  });

  it('renders set price button for items without currentPrice', async () => {
    const { getAllByText } = await render(<CartDetailScreen />);
    expect(getAllByText('cart.setPrice').length).toBeGreaterThanOrEqual(1);
  });

  it('renders currentPrice when set on an item', async () => {
    const cartWithPrice = {
      ...mockCart,
      items: [
        { productId: 'p1', quantity: 2, currentPrice: 7.99 },
        { productId: 'p2', quantity: 1 },
      ],
    };
    jest.requireMock('@/stores/useCartStore').useCartStore = (selector) => {
      return selector({
        carts: [cartWithPrice],
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        updateCurrentPrice: mockUpdateCurrentPrice,
      });
    };

    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText(/7,99/)).toBeTruthy();
  });

  it('renders expected and current price together', async () => {
    const cartWithPrice = {
      ...mockCart,
      items: [
        { productId: 'p1', quantity: 2, currentPrice: 7.99 },
        { productId: 'p2', quantity: 1 },
      ],
    };
    jest.requireMock('@/stores/useCartStore').useCartStore = (selector) => {
      return selector({
        carts: [cartWithPrice],
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        updateCurrentPrice: mockUpdateCurrentPrice,
      });
    };

    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText(/8,49/)).toBeTruthy();
    expect(getByText(/7,99/)).toBeTruthy();
  });

  it('summary section shows expected total', async () => {
    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText('cart.expectedTotal')).toBeTruthy();
  });

  it('summary section shows current total when items have currentPrice', async () => {
    const cartWithPrice = {
      ...mockCart,
      items: [
        { productId: 'p1', quantity: 2, currentPrice: 7.99 },
        { productId: 'p2', quantity: 1 },
      ],
    };
    jest.requireMock('@/stores/useCartStore').useCartStore = (selector) => {
      return selector({
        carts: [cartWithPrice],
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        updateCurrentPrice: mockUpdateCurrentPrice,
      });
    };

    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText('cart.currentTotal')).toBeTruthy();
  });

  it('summary section hides current total when no items have currentPrice', async () => {
    const { queryByText } = await render(<CartDetailScreen />);
    expect(queryByText('cart.currentTotal')).toBeNull();
  });

  it('summary shows difference when currentPrice is set', async () => {
    const cartWithPrice = {
      ...mockCart,
      items: [
        { productId: 'p1', quantity: 2, currentPrice: 7.99 },
        { productId: 'p2', quantity: 1, currentPrice: 11.5 },
      ],
    };
    jest.requireMock('@/stores/useCartStore').useCartStore = (selector) => {
      return selector({
        carts: [cartWithPrice],
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        updateCurrentPrice: mockUpdateCurrentPrice,
      });
    };

    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText('cart.overBudget')).toBeTruthy();
  });

  it('summary shows underBudget when current total is less than expected', async () => {
    const cartWithPrice = {
      ...mockCart,
      items: [
        { productId: 'p1', quantity: 2, currentPrice: 5.0 },
        { productId: 'p2', quantity: 1, currentPrice: 5.0 },
      ],
    };
    jest.requireMock('@/stores/useCartStore').useCartStore = (selector) => {
      return selector({
        carts: [cartWithPrice],
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        updateCurrentPrice: mockUpdateCurrentPrice,
      });
    };

    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText('cart.underBudget')).toBeTruthy();
  });

  it('summary shows onBudget when difference is zero', async () => {
    const cartWithPrice = {
      ...mockCart,
      items: [
        { productId: 'p1', quantity: 2, currentPrice: 8.49 },
        { productId: 'p2', quantity: 1, currentPrice: 9.99 },
      ],
    };
    jest.requireMock('@/stores/useCartStore').useCartStore = (selector) => {
      return selector({
        carts: [cartWithPrice],
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        updateCurrentPrice: mockUpdateCurrentPrice,
      });
    };

    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText('cart.onBudget')).toBeTruthy();
  });
});
