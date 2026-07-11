import { render } from '@testing-library/react-native';
import type React from 'react';
import HomeScreen from '../index';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe('HomeScreen', () => {
  it('renders title, subtitle, button, section, and empty state', async () => {
    const { getByText } = await render(<HomeScreen />);
    expect(getByText('home.title')).toBeTruthy();
    expect(getByText('home.subtitle')).toBeTruthy();
    expect(getByText('home.newCart')).toBeTruthy();
    expect(getByText('home.myCarts')).toBeTruthy();
    expect(getByText('home.emptyState')).toBeTruthy();
  });
});
