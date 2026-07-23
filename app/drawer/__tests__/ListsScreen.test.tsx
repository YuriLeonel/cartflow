import { act, fireEvent, render } from '@testing-library/react-native';
import type React from 'react';
import { Alert } from 'react-native';
import ListsScreen from '../lists';

const mockCarts: Array<{
  id: string;
  name: string;
  items: Array<{ productId: string; quantity: number }>;
  createdAt: string;
  updatedAt: string;
}> = [];
const mockAddCart = jest.fn();
const mockRemoveCart = jest.fn();
const mockRenameCart = jest.fn();

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
  useCartStore: (
    selector: (state: {
      carts: typeof mockCarts;
      addCart: typeof mockAddCart;
      removeCart: typeof mockRemoveCart;
      renameCart: typeof mockRenameCart;
    }) => unknown,
  ) =>
    selector({
      carts: mockCarts,
      addCart: mockAddCart,
      removeCart: mockRemoveCart,
      renameCart: mockRenameCart,
    }),
}));

describe('ListsScreen', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    mockCarts.length = 0;
    mockAddCart.mockClear();
    mockRemoveCart.mockClear();
    mockRenameCart.mockClear();
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('renders title', () => {
    const { getByText } = render(<ListsScreen />);
    expect(getByText('lists.title')).toBeTruthy();
  });

  it('shows empty state when no lists', () => {
    const { getByText } = render(<ListsScreen />);
    expect(getByText('lists.emptyState')).toBeTruthy();
  });

  it('renders list items when carts exist', () => {
    mockCarts.push({
      id: 'c1',
      name: 'Compras do mês',
      items: [{ productId: 'p1', quantity: 2 }],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    });

    const { getByText } = render(<ListsScreen />);
    expect(getByText('Compras do mês')).toBeTruthy();
    expect(getByText('1 cart.items')).toBeTruthy();
  });

  it('renders FAB button', () => {
    const { getByLabelText } = render(<ListsScreen />);
    expect(getByLabelText('lists.newList')).toBeTruthy();
  });

  describe('create list via modal', () => {
    it('opens create modal when FAB is pressed', () => {
      const { getByLabelText, getByText } = render(<ListsScreen />);
      fireEvent.press(getByLabelText('lists.newList'));
      expect(getByText('lists.createTitle')).toBeTruthy();
    });

    it('shows TextInput in create modal', () => {
      const { getByLabelText, getByPlaceholderText } = render(<ListsScreen />);
      fireEvent.press(getByLabelText('lists.newList'));
      expect(getByPlaceholderText('lists.namePlaceholder')).toBeTruthy();
    });

    it('calls addCart with entered name on confirm', () => {
      const { getByLabelText, getByPlaceholderText, getByText } = render(<ListsScreen />);
      fireEvent.press(getByLabelText('lists.newList'));
      const input = getByPlaceholderText('lists.namePlaceholder');
      fireEvent.changeText(input, 'Minha Lista');
      fireEvent.press(getByText('common.confirm'));
      expect(mockAddCart).toHaveBeenCalledWith('Minha Lista');
    });

    it('does not call addCart with empty name', () => {
      const { getByLabelText, getByPlaceholderText, getByText } = render(<ListsScreen />);
      fireEvent.press(getByLabelText('lists.newList'));
      const input = getByPlaceholderText('lists.namePlaceholder');
      fireEvent.changeText(input, '   ');
      fireEvent.press(getByText('common.confirm'));
      expect(mockAddCart).not.toHaveBeenCalled();
    });

    it('closes modal on cancel without calling addCart', () => {
      const { getByLabelText, getByText, queryByText } = render(<ListsScreen />);
      fireEvent.press(getByLabelText('lists.newList'));
      expect(getByText('lists.createTitle')).toBeTruthy();
      fireEvent.press(getByText('common.cancel'));
      expect(queryByText('lists.createTitle')).toBeNull();
      expect(mockAddCart).not.toHaveBeenCalled();
    });
  });

  describe('long-press context menu', () => {
    beforeEach(() => {
      mockCarts.push({
        id: 'c1',
        name: 'Compras do mês',
        items: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      });
    });

    it('shows context menu with rename and delete options on long-press', () => {
      const { getByText } = render(<ListsScreen />);
      fireEvent(getByText('Compras do mês'), 'longPress');
      expect(alertSpy).toHaveBeenCalledWith(
        'Compras do mês',
        undefined,
        expect.arrayContaining([
          expect.objectContaining({ text: 'cart.contextRename' }),
          expect.objectContaining({ text: 'cart.contextDelete', style: 'destructive' }),
          expect.objectContaining({ text: 'common.cancel', style: 'cancel' }),
        ]),
      );
    });

    it('opens rename modal when rename option is pressed', () => {
      const { getByText } = render(<ListsScreen />);
      fireEvent(getByText('Compras do mês'), 'longPress');
      const renameButton = alertSpy.mock.calls[0][2].find(
        (btn: { text: string }) => btn.text === 'cart.contextRename',
      );
      act(() => {
        renameButton.onPress();
      });
      expect(getByText('lists.renameTitle')).toBeTruthy();
    });

    it('calls renameCart when rename is confirmed', () => {
      const { getByText, getByPlaceholderText } = render(<ListsScreen />);
      fireEvent(getByText('Compras do mês'), 'longPress');
      const renameButton = alertSpy.mock.calls[0][2].find(
        (btn: { text: string }) => btn.text === 'cart.contextRename',
      );
      act(() => {
        renameButton.onPress();
      });
      const input = getByPlaceholderText('lists.namePlaceholder');
      fireEvent.changeText(input, 'Nova Nome');
      fireEvent.press(getByText('common.confirm'));
      expect(mockRenameCart).toHaveBeenCalledWith('c1', 'Nova Nome');
    });

    it('shows delete confirmation when delete option is pressed', () => {
      const { getByText } = render(<ListsScreen />);
      fireEvent(getByText('Compras do mês'), 'longPress');
      const deleteOption = alertSpy.mock.calls[0][2].find(
        (btn: { text: string }) => btn.text === 'cart.contextDelete',
      );
      act(() => {
        deleteOption.onPress();
      });
      expect(alertSpy).toHaveBeenCalledTimes(2);
      expect(alertSpy).toHaveBeenLastCalledWith(
        'cart.confirmDelete',
        'cart.confirmDeleteMessage',
        expect.arrayContaining([
          expect.objectContaining({ text: 'common.cancel', style: 'cancel' }),
          expect.objectContaining({ text: 'common.delete', style: 'destructive' }),
        ]),
      );
    });

    it('calls removeCart when delete is confirmed', () => {
      const { getByText } = render(<ListsScreen />);
      fireEvent(getByText('Compras do mês'), 'longPress');
      const deleteOption = alertSpy.mock.calls[0][2].find(
        (btn: { text: string }) => btn.text === 'cart.contextDelete',
      );
      act(() => {
        deleteOption.onPress();
      });
      const confirmDelete = alertSpy.mock.calls[1][2].find(
        (btn: { text: string }) => btn.text === 'common.delete',
      );
      act(() => {
        confirmDelete.onPress();
      });
      expect(mockRemoveCart).toHaveBeenCalledWith('c1');
    });
  });
});
