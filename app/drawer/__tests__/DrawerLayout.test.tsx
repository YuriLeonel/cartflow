import { render, waitFor } from '@testing-library/react-native';
import type React from 'react';

const capturedScreens: { name: string; options?: { title?: string } }[] = [];

jest.mock('expo-router/drawer', () => {
  const Drawer = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  Drawer.Screen = ({
    name,
    options,
  }: {
    name: string;
    options?: { title?: string };
  }) => {
    capturedScreens.push({ name, options });
    return null;
  };
  Drawer.__capturedScreens = capturedScreens;
  return { Drawer };
});

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: (props: Record<string, unknown>) => <Text>{String(props.name)}</Text> };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

function getCapturedScreens() {
  const drawerMock = jest.requireMock('expo-router/drawer');
  return drawerMock.Drawer.__capturedScreens as {
    name: string;
    options?: { title?: string };
  }[];
}

beforeEach(() => {
  getCapturedScreens().length = 0;
});

const DrawerLayout = require('../_layout').default;

describe('DrawerLayout', () => {
  it('renders without crashing', async () => {
    await waitFor(() => {
      expect(() => render(<DrawerLayout />)).not.toThrow();
    });
  });

  it('renders two drawer screens: lists and products', async () => {
    render(<DrawerLayout />);
    await waitFor(() => {
      expect(getCapturedScreens()).toHaveLength(2);
    });
    expect(getCapturedScreens().map((s) => s.name)).toEqual(['lists', 'products']);
  });

  it('renders screens with correct i18n titles', async () => {
    render(<DrawerLayout />);
    await waitFor(() => {
      expect(getCapturedScreens()).toHaveLength(2);
    });
    expect(getCapturedScreens().map((s) => s.options?.title)).toEqual([
      'drawer.lists',
      'drawer.products',
    ]);
  });
});
