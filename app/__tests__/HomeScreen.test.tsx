import { render } from '@testing-library/react-native';
import type React from 'react';
import MainShoppingList from '../index';

const mockCarts: Array<{
  id: string;
  name: string;
  items: Array<{ productId: string; quantity: number; inCart: boolean }>;
  createdAt: string;
  updatedAt: string;
}> = [];
let mockActiveCartId: string | null = null;
const mockSetActiveCart = jest.fn((id: string | null) => {
  mockActiveCartId = id;
});
const mockToggleInCart = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockRemoveItem = jest.fn();

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
}));

jest.mock('@react-navigation/drawer', () => ({
  useDrawerStatus: () => 'closed',
}));

jest.mock('@legendapp/list/react-native', () => {
  const ReactMock = require('react');
  return {
    LegendList: ({
      data,
      renderItem,
      keyExtractor,
    }: {
      data: unknown[];
      renderItem: (info: { item: unknown }) => React.ReactNode;
      keyExtractor: (item: unknown) => string;
    }) => {
      return ReactMock.createElement(
        'LegendList-mock',
        null,
        data.map((item: unknown) =>
          ReactMock.createElement(renderItem, { item, key: keyExtractor(item) }),
        ),
      );
    },
  };
});

jest.mock('@/stores/useCartStore', () => ({
  useCartStore: (
    selector: (state: {
      carts: typeof mockCarts;
      activeCartId: string | null;
      setActiveCart: typeof mockSetActiveCart;
      toggleInCart: typeof mockToggleInCart;
      updateQuantity: typeof mockUpdateQuantity;
      removeItem: typeof mockRemoveItem;
    }) => unknown,
  ) =>
    selector({
      carts: mockCarts,
      activeCartId: mockActiveCartId,
      setActiveCart: mockSetActiveCart,
      toggleInCart: mockToggleInCart,
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
    }),
}));

jest.mock('@/stores/useProductStore', () => ({
  useProductStore: (selector: (state: { products: unknown[] }) => unknown) =>
    selector({ products: [] }),
}));

jest.mock('@/components/shopping-list/ListSelector', () => {
  const ReactMock = require('react');
  return {
    ListSelector: () => ReactMock.createElement('ListSelector-mock'),
  };
});

describe('MainShoppingList', () => {
  beforeEach(() => {
    mockCarts.length = 0;
    mockActiveCartId = null;
    mockSetActiveCart.mockClear();
    mockToggleInCart.mockClear();
    mockUpdateQuantity.mockClear();
    mockRemoveItem.mockClear();
  });

  it('shows empty state when no active cart', async () => {
    const { getByText } = await render(<MainShoppingList />);
    expect(getByText('list.empty.noList')).toBeTruthy();
  });

  it('shows header with select list prompt when no active cart', async () => {
    const { getByText } = await render(<MainShoppingList />);
    expect(getByText('list.header.selectList')).toBeTruthy();
  });

  it('shows empty list state when active cart has no items', async () => {
    mockCarts.push({
      id: 'c1',
      name: 'Lista 1',
      items: [],
      createdAt: '',
      updatedAt: '',
    });
    mockActiveCartId = 'c1';

    const { getByText } = await render(<MainShoppingList />);
    expect(getByText('list.empty.noItems')).toBeTruthy();
  });

  it('shows list name when active cart exists', async () => {
    mockCarts.push({
      id: 'c1',
      name: 'Compras do mês',
      items: [],
      createdAt: '',
      updatedAt: '',
    });
    mockActiveCartId = 'c1';

    const { getByText } = await render(<MainShoppingList />);
    expect(getByText('Compras do mês')).toBeTruthy();
  });
});
