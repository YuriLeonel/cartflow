import React from 'react';
import { render } from '@testing-library/react-native';
import ListsScreen from '../lists';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe('ListsScreen', () => {
  it('renders title and message', async () => {
    const { getByText } = await render(<ListsScreen />);
    expect(getByText('tabs.lists')).toBeTruthy();
    expect(getByText('tabs.comingSoon')).toBeTruthy();
  });
});
