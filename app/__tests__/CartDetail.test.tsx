import { render } from '@testing-library/react-native';
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

jest.mock('@/stores/useCartStore', () => ({
  useCartStore: (
    selector: (state: {
      carts: (typeof mockCart)[];
      removeItem: typeof mockRemoveItem;
      updateQuantity: typeof mockUpdateQuantity;
    }) => unknown,
  ) => {
    const state = {
      carts: [mockCart],
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
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
      });
    };

    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText('cart.emptyState')).toBeTruthy();
  });

  it('renders add product button', async () => {
    const { getByText } = await render(<CartDetailScreen />);
    expect(getByText('cart.addItem')).toBeTruthy();
  });

  it('renders close button', async () => {
    const { getByLabelText } = await render(<CartDetailScreen />);
    expect(getByLabelText('common.cancel')).toBeTruthy();
  });
});
