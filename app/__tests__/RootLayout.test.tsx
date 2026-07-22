import { render, waitFor } from '@testing-library/react-native';
import type React from 'react';

const capturedScreens: { name: string; options?: Record<string, unknown> }[] = [];

jest.mock('expo-router', () => {
  const Stack = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  Stack.Screen = ({
    name,
    options,
  }: {
    name: string;
    options?: Record<string, unknown>;
  }) => {
    capturedScreens.push({ name, options });
    return null;
  };
  Stack.__capturedScreens = capturedScreens;
  return { Stack };
});

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('../../i18n', () => ({}));

function getCapturedScreens() {
  const expoRouterMock = jest.requireMock('expo-router');
  return expoRouterMock.Stack.__capturedScreens as {
    name: string;
    options?: Record<string, unknown>;
  }[];
}

beforeEach(() => {
  getCapturedScreens().length = 0;
});

const RootLayout = require('../_layout').default;

describe('RootLayout', () => {
  it('renders without crashing', async () => {
    await waitFor(() => {
      expect(() => render(<RootLayout />)).not.toThrow();
    });
  });

  it('registers drawer screen', async () => {
    render(<RootLayout />);
    await waitFor(() => {
      expect(getCapturedScreens().length).toBeGreaterThan(0);
    });
    const drawerScreen = getCapturedScreens().find((s) => s.name === 'drawer');
    expect(drawerScreen).toBeTruthy();
  });

  it('registers modal screens', async () => {
    render(<RootLayout />);
    await waitFor(() => {
      expect(getCapturedScreens().length).toBeGreaterThan(0);
    });
    const screenNames = getCapturedScreens().map((s) => s.name);
    expect(screenNames).toContain('product-form');
    expect(screenNames).toContain('cart-detail');
    expect(screenNames).toContain('product-picker');
  });

  it('does not register old tabs screen', async () => {
    render(<RootLayout />);
    await waitFor(() => {
      expect(getCapturedScreens().length).toBeGreaterThan(0);
    });
    const screenNames = getCapturedScreens().map((s) => s.name);
    expect(screenNames).not.toContain('(tabs)');
  });
});
