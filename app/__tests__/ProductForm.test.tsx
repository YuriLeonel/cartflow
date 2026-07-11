import { fireEvent, render } from '@testing-library/react-native';
import type React from 'react';
import ProductFormScreen from '../product-form';

const mockBack = jest.fn();
const mockAddProduct = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('@/stores/useProductStore', () => ({
  useProductStore: (selector: (state: { addProduct: typeof mockAddProduct }) => unknown) =>
    selector({ addProduct: mockAddProduct }),
}));

jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children }) => React.createElement('KeyboardAvoidingView-mock', null, children),
  };
});

describe('ProductFormScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockAddProduct.mockReset();
    mockAddProduct.mockReturnValue(null);
  });

  it('renders all form fields', () => {
    const { getByPlaceholderText, getByText } = render(<ProductFormScreen />);
    expect(getByText('products.newProduct')).toBeTruthy();
    expect(getByPlaceholderText('products.namePlaceholder')).toBeTruthy();
    expect(getByPlaceholderText('products.withoutCategory')).toBeTruthy();
    expect(getByPlaceholderText('products.pricePlaceholder')).toBeTruthy();
  });

  it('renders save and cancel buttons', () => {
    const { getByText } = render(<ProductFormScreen />);
    expect(getByText('common.save')).toBeTruthy();
    expect(getByText('common.cancel')).toBeTruthy();
  });

  describe('validation', () => {
    it('shows error when name is empty (PROD-09)', () => {
      const { getByText } = render(<ProductFormScreen />);
      fireEvent.press(getByText('common.save'));
      expect(getByText('error.product.name.required')).toBeTruthy();
    });

    it('shows error when name has only spaces (PROD-E01)', () => {
      const { getByText, getByPlaceholderText } = render(<ProductFormScreen />);
      fireEvent.changeText(getByPlaceholderText('products.namePlaceholder'), '   ');
      fireEvent.press(getByText('common.save'));
      expect(getByText('error.product.name.required')).toBeTruthy();
    });

    it('shows error when name exceeds 100 chars (PROD-E03)', () => {
      const { getByText, getByPlaceholderText } = render(<ProductFormScreen />);
      const longName = 'a'.repeat(101);
      fireEvent.changeText(getByPlaceholderText('products.namePlaceholder'), longName);
      fireEvent.press(getByText('common.save'));
      expect(getByText('error.product.name.maxLength')).toBeTruthy();
    });

    it('shows error when price is negative (PROD-E02)', () => {
      const { getByText, getByPlaceholderText } = render(<ProductFormScreen />);
      fireEvent.changeText(getByPlaceholderText('products.namePlaceholder'), 'Arroz');
      fireEvent.changeText(getByPlaceholderText('products.pricePlaceholder'), '-5');
      fireEvent.press(getByText('common.save'));
      expect(getByText('error.product.price.positive')).toBeTruthy();
    });
  });

  it('saves product and navigates back on valid submission (PROD-08)', () => {
    const { getByText, getByPlaceholderText } = render(<ProductFormScreen />);
    fireEvent.changeText(getByPlaceholderText('products.namePlaceholder'), 'Arroz 1kg');
    fireEvent.changeText(getByPlaceholderText('products.withoutCategory'), 'Grãos');
    fireEvent.changeText(getByPlaceholderText('products.pricePlaceholder'), '8,49');
    fireEvent.press(getByText('common.save'));

    expect(mockAddProduct).toHaveBeenCalledWith({
      name: 'Arroz 1kg',
      category: 'Grãos',
      expectedPrice: 8.49,
    });
    expect(mockBack).toHaveBeenCalled();
  });

  it('saves product without optional fields', () => {
    const { getByText, getByPlaceholderText } = render(<ProductFormScreen />);
    fireEvent.changeText(getByPlaceholderText('products.namePlaceholder'), 'Banana');
    fireEvent.press(getByText('common.save'));

    expect(mockAddProduct).toHaveBeenCalledWith({
      name: 'Banana',
      category: undefined,
      expectedPrice: undefined,
    });
    expect(mockBack).toHaveBeenCalled();
  });

  it('navigates back without saving on cancel (PROD-10)', () => {
    const { getByText } = render(<ProductFormScreen />);
    fireEvent.press(getByText('common.cancel'));
    expect(mockAddProduct).not.toHaveBeenCalled();
    expect(mockBack).toHaveBeenCalled();
  });

  it('shows server-side error when store rejects', () => {
    mockAddProduct.mockReturnValue('error.product.name.required');
    const { getByText, getByPlaceholderText } = render(<ProductFormScreen />);
    fireEvent.changeText(getByPlaceholderText('products.namePlaceholder'), 'Valid Name');
    fireEvent.press(getByText('common.save'));

    expect(mockAddProduct).toHaveBeenCalled();
    expect(mockBack).not.toHaveBeenCalled();
  });
});
