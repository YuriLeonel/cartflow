import { render } from '@testing-library/react-native';
import TabLayout from '../_layout';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('expo-router', () => {
  const MockTabs = () => null;
  MockTabs.Screen = () => null;
  return { Tabs: MockTabs };
});

describe('TabLayout', () => {
  it('renders without crashing', () => {
    expect(() => render(<TabLayout />)).not.toThrow();
  });
});
