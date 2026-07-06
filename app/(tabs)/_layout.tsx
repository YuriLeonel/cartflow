import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '@/constants/colors';

const tabIcons: Record<string, string> = {
  index: '\u{1F3E0}',
  lists: '\u{1F4CB}',
  products: '\u{1F6D2}',
  profile: '\u{1F464}',
};

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8E8E93',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 22 }}>{tabIcons[route.name] || '?'}</Text>
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.home') }} />
      <Tabs.Screen name="lists" options={{ title: t('tabs.lists') }} />
      <Tabs.Screen name="products" options={{ title: t('tabs.products') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile') }} />
    </Tabs>
  );
}
