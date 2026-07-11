import { render } from '@testing-library/react-native';
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

  it('renders category headers', async () => {
    const { getByText } = await render(<ProductsScreen />);
    expect(getByText('Grãos')).toBeTruthy();
    expect(getByText('Hortifruti')).toBeTruthy();
  });

  it('renders product names', async () => {
    const { getByText } = await render(<ProductsScreen />);
    expect(getByText('Arroz 1kg')).toBeTruthy();
    expect(getByText('Feijão 1kg')).toBeTruthy();
    expect(getByText('Banana 1kg')).toBeTruthy();
  });

  it('shows empty state when no products', async () => {
    mockState.products = [];
    const { getByText } = await render(<ProductsScreen />);
    expect(getByText('products.emptyState')).toBeTruthy();
  });
});
