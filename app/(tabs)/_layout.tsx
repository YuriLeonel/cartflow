import { colors } from '@/constants/colors';
import { iconSize } from '@/constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const tabIcons: Record<string, { focused: IoniconsName; default: IoniconsName }> = {
  index: { focused: 'home', default: 'home-outline' },
  lists: { focused: 'list', default: 'list-outline' },
  products: { focused: 'cart', default: 'cart-outline' },
  profile: { focused: 'person', default: 'person-outline' },
};

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          const icons = tabIcons[route.name] || tabIcons.index;
          return (
            <Ionicons
              name={focused ? icons.focused : icons.default}
              size={iconSize.tab}
              color={focused ? colors.primary : colors.inactiveTab}
            />
          );
        },
      })}
    >
      <Tabs.Screen name='index' options={{ title: t('tabs.home') }} />
      <Tabs.Screen name='lists' options={{ title: t('tabs.lists') }} />
      <Tabs.Screen name='products' options={{ title: t('tabs.products') }} />
      <Tabs.Screen name='profile' options={{ title: t('tabs.profile') }} />
    </Tabs>
  );
}
