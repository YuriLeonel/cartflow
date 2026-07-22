import { colors } from '@/constants/colors';
import { iconSize } from '@/constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const drawerIcons: Record<string, { focused: IoniconsName; default: IoniconsName }> = {
  lists: { focused: 'list', default: 'list-outline' },
  products: { focused: 'cart', default: 'cart-outline' },
};

export default function DrawerLayout() {
  const { t } = useTranslation();

  return (
    <Drawer
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerIcon: ({ focused }) => {
          const icons = drawerIcons[route.name] || drawerIcons.lists;
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
      <Drawer.Screen name='lists' options={{ title: t('drawer.lists') }} />
      <Drawer.Screen name='products' options={{ title: t('drawer.products') }} />
    </Drawer>
  );
}
