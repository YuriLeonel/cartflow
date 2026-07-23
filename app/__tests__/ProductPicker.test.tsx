import { render } from '@testing-library/react-native';
import type React from 'react';
import ProductPickerScreen from '../product-picker';

const mockProducts = [
  { id: 'p1', name: 'Arroz 1kg', category: 'Grãos', expectedPrice: 8.49 },
  { id: 'p2', name: 'Feijão 1kg', category: 'Grãos', expectedPrice: 9.99 },
  { id: 'p3', name: 'Banana 1kg', category: 'Hortifruti', expectedPrice: 7.49 },
];

const mockAddItem = jest.fn();

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
        data.map((item, index) =>
          ReactMock.createElement(
            ReactMock.Fragment,
            { key: props.keyExtractor ? props.keyExtractor(item, index) : String(index) },
            props.renderItem({ item, index }),
          ),
        ),
      );
    },
  };
});

jest.mock('@/stores/useCartStore', () => ({
  useCartStore: (selector: (state: { addItem: typeof mockAddItem }) => unknown) => {
    return selector({ addItem: mockAddItem });
  },
}));

jest.mock('@/stores/useProductStore', () => ({
  useProductStore: (selector: (state: { products: typeof mockProducts }) => unknown) => {
    return selector({ products: mockProducts });
  },
}));

describe('ProductPickerScreen', () => {
  beforeEach(() => {
    mockAddItem.mockClear();
  });

  it('renders title', async () => {
    const { getByText } = await render(<ProductPickerScreen />);
    expect(getByText('item.addTitle')).toBeTruthy();
  });

  it('renders close button', async () => {
    const { getByLabelText } = await render(<ProductPickerScreen />);
    expect(getByLabelText('common.cancel')).toBeTruthy();
  });

  it('renders search bar', async () => {
    const { getByPlaceholderText } = await render(<ProductPickerScreen />);
    expect(getByPlaceholderText('products.search')).toBeTruthy();
  });

  it('renders product names', async () => {
    const { getByText } = await render(<ProductPickerScreen />);
    expect(getByText('Arroz 1kg')).toBeTruthy();
    expect(getByText('Feijão 1kg')).toBeTruthy();
    expect(getByText('Banana 1kg')).toBeTruthy();
  });

  it('renders product categories', async () => {
    const { getAllByText } = await render(<ProductPickerScreen />);
    expect(getAllByText('Grãos').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Hortifruti').length).toBeGreaterThanOrEqual(1);
  });

  it('renders product prices', async () => {
    const { getByText } = await render(<ProductPickerScreen />);
    expect(getByText(/8,49/)).toBeTruthy();
    expect(getByText(/9,99/)).toBeTruthy();
    expect(getByText(/7,49/)).toBeTruthy();
  });

  it('shows empty state when no products', async () => {
    jest.requireMock('@/stores/useProductStore').useProductStore = (selector) => {
      return selector({ products: [] });
    };

    const { getByText } = await render(<ProductPickerScreen />);
    expect(getByText('products.noProducts')).toBeTruthy();
  });
});
