import { fireEvent, render } from '@testing-library/react-native';
import type React from 'react';
import ProductsScreen from '../products';

const mockSeedIfEmpty = jest.fn();
const mockState = {
  products: [
    { id: '1', name: 'Arroz 1kg', category: 'Grãos', expectedPrice: 8.49 },
    { id: '2', name: 'Feijão 1kg', category: 'Grãos', expectedPrice: 9.99 },
    { id: '3', name: 'Banana 1kg', category: 'Hortifruti', expectedPrice: 7.49 },
  ] as Array<{ id: string; name: string; category?: string; expectedPrice?: number }>,
  seedIfEmpty: mockSeedIfEmpty,
};

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

jest.mock('@/stores/useProductStore', () => ({
  useProductStore: (selector: (state: typeof mockState) => unknown) => selector(mockState),
}));

jest.mock('@legendapp/list/react-native', () => {
  const ReactMock = require('react');
  return {
    LegendList: function MockLegendList(props) {
      const data = props.data || [];
      const renderItem = props.renderItem;
      return ReactMock.createElement(
        'LegendList-mock',
        null,
        data.map((item, index) =>
          ReactMock.createElement(
            ReactMock.Fragment,
            { key: props.keyExtractor ? props.keyExtractor(item, index) : String(index) },
            renderItem({ item, index }),
          ),
        ),
      );
    },
  };
});

describe('ProductsScreen', () => {
  beforeEach(() => {
    mockSeedIfEmpty.mockClear();
    mockState.products = [
      { id: '1', name: 'Arroz 1kg', category: 'Grãos', expectedPrice: 8.49 },
      { id: '2', name: 'Feijão 1kg', category: 'Grãos', expectedPrice: 9.99 },
      { id: '3', name: 'Banana 1kg', category: 'Hortifruti', expectedPrice: 7.49 },
    ];
  });

  it('renders category headers', () => {
    const { getByText } = render(<ProductsScreen />);
    expect(getByText('Grãos')).toBeTruthy();
    expect(getByText('Hortifruti')).toBeTruthy();
  });

  it('renders product names', () => {
    const { getByText } = render(<ProductsScreen />);
    expect(getByText('Arroz 1kg')).toBeTruthy();
    expect(getByText('Feijão 1kg')).toBeTruthy();
    expect(getByText('Banana 1kg')).toBeTruthy();
  });

  it('formats prices as BRL currency', () => {
    const { getByText } = render(<ProductsScreen />);
    expect(getByText('R$ 8,49')).toBeTruthy();
    expect(getByText('R$ 9,99')).toBeTruthy();
    expect(getByText('R$ 7,49')).toBeTruthy();
  });

  it('shows empty state when no products', () => {
    mockState.products = [];
    const { getByText } = render(<ProductsScreen />);
    expect(getByText('products.emptyState')).toBeTruthy();
  });

  describe('search functionality', () => {
    it('renders search bar with placeholder', () => {
      const { getByPlaceholderText } = render(<ProductsScreen />);
      expect(getByPlaceholderText('products.search')).toBeTruthy();
    });

    it('filters products by name (case-insensitive)', () => {
      const { getByPlaceholderText, queryByText } = render(<ProductsScreen />);
      const searchInput = getByPlaceholderText('products.search');
      fireEvent.changeText(searchInput, 'arroz');
      expect(queryByText('Arroz 1kg')).toBeTruthy();
      expect(queryByText('Feijão 1kg')).toBeNull();
      expect(queryByText('Banana 1kg')).toBeNull();
    });

    it('shows no results message when search matches nothing', () => {
      const { getByPlaceholderText, getByText, queryByText } = render(<ProductsScreen />);
      const searchInput = getByPlaceholderText('products.search');
      fireEvent.changeText(searchInput, 'xyz');
      expect(getByText('products.emptyState')).toBeTruthy();
      expect(queryByText('Arroz 1kg')).toBeNull();
    });

    it('restores full list when search is cleared', () => {
      const { getByPlaceholderText, queryByText } = render(<ProductsScreen />);
      const searchInput = getByPlaceholderText('products.search');
      fireEvent.changeText(searchInput, 'arroz');
      expect(queryByText('Feijão 1kg')).toBeNull();
      fireEvent.changeText(searchInput, '');
      expect(queryByText('Arroz 1kg')).toBeTruthy();
      expect(queryByText('Feijão 1kg')).toBeTruthy();
      expect(queryByText('Banana 1kg')).toBeTruthy();
    });

    it('shows no products empty state when products array is empty', () => {
      mockState.products = [];
      const { getByText } = render(<ProductsScreen />);
      expect(getByText('products.emptyState')).toBeTruthy();
    });
  });
});
