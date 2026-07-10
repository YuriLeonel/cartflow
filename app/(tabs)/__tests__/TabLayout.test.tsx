import { render, waitFor } from '@testing-library/react-native';
import type React from 'react';
import TabLayout from '../_layout';

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: (props: Record<string, unknown>) => <Text>{String(props.name)}</Text> };
});

jest.mock('expo-router', () => {
  const capturedScreens: { name: string; title: string }[] = [];

  const Tabs = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  Tabs.Screen = ({
    name,
    options,
  }: {
    name: string;
    options?: { title?: string };
  }) => {
    capturedScreens.push({ name, title: options?.title ?? '' });
    return null;
  };

  Tabs.__capturedScreens = capturedScreens;

  return { Tabs };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

function getCapturedScreens() {
  const expoRouterMock = jest.requireMock('expo-router');
  return expoRouterMock.Tabs.__capturedScreens as { name: string; title: string }[];
}

beforeEach(() => {
  getCapturedScreens().length = 0;
});

describe('TabLayout', () => {
  it('renders without crashing', async () => {
    await waitFor(() => {
      expect(() => render(<TabLayout />)).not.toThrow();
    });
  });

  it('renders all four tabs with correct screen names', async () => {
    render(<TabLayout />);
    await waitFor(() => {
      expect(getCapturedScreens()).toHaveLength(4);
    });
    expect(getCapturedScreens().map((s) => s.name)).toEqual([
      'index',
      'lists',
      'products',
      'profile',
    ]);
  });

  it('renders tabs with correct i18n titles', async () => {
    render(<TabLayout />);
    await waitFor(() => {
      expect(getCapturedScreens()).toHaveLength(4);
    });
    expect(getCapturedScreens().map((s) => s.title)).toEqual([
      'tabs.home',
      'tabs.lists',
      'tabs.products',
      'tabs.profile',
    ]);
  });
});
