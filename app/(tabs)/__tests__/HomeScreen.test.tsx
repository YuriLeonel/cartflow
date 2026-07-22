import { render } from '@testing-library/react-native';
import type React from 'react';
import HomeScreen from '../index';

const mockCarts: Array<{
  id: string;
  name: string;
  items: Array<{ productId: string; quantity: number }>;
  createdAt: string;
  updatedAt: string;
}> = [];
const mockAddCart = jest.fn();

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

jest.mock('@/stores/useCartStore', () => ({
  useCartStore: (
    selector: (state: { carts: typeof mockCarts; addCart: typeof mockAddCart }) => unknown,
  ) => selector({ carts: mockCarts, addCart: mockAddCart }),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    mockCarts.length = 0;
    mockAddCart.mockClear();
  });

  it('renders title, subtitle, button, and section', async () => {
    const { getByText } = await render(<HomeScreen />);
    expect(getByText('home.title')).toBeTruthy();
    expect(getByText('home.subtitle')).toBeTruthy();
    expect(getByText('home.newCart')).toBeTruthy();
    expect(getByText('home.myCarts')).toBeTruthy();
  });

  it('shows empty state when no carts', async () => {
    const { getByText } = await render(<HomeScreen />);
    expect(getByText('home.emptyState')).toBeTruthy();
  });

  it('shows recent carts when they exist', async () => {
    mockCarts.push(
      {
        id: 'c1',
        name: 'Lista 1',
        items: [{ productId: 'p1', quantity: 1 }],
        createdAt: '',
        updatedAt: '',
      },
      { id: 'c2', name: 'Lista 2', items: [], createdAt: '', updatedAt: '' },
    );

    const { getByText } = await render(<HomeScreen />);
    expect(getByText('Lista 1')).toBeTruthy();
    expect(getByText('Lista 2')).toBeTruthy();
  });

  it('renders new cart button', async () => {
    const { getByLabelText } = await render(<HomeScreen />);
    expect(getByLabelText('home.newCartA11y')).toBeTruthy();
  });
});
