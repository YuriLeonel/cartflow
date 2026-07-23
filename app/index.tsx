import { colors } from '@/constants/colors';
import { borderRadius, spacing } from '@/constants/layout';
import { useCartStore } from '@/stores/useCartStore';
import { useProductStore } from '@/stores/useProductStore';
import { Ionicons } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list/react-native';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartItemRow } from '@/components/shopping-list/CartItemRow';
import { EmptyListState } from '@/components/shopping-list/EmptyListState';
import { ListFooter } from '@/components/shopping-list/ListFooter';
import { ListHeader } from '@/components/shopping-list/ListHeader';
import { ListSelector } from '@/components/shopping-list/ListSelector';
import { SectionHeader } from '@/components/shopping-list/SectionHeader';
import { buildListData, getCartTotals } from '@/components/shopping-list/list-utils';
import type { ItemData, ListItem } from '@/components/shopping-list/list-utils';

export default function MainShoppingList() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const drawerStatus = useDrawerStatus();

  const carts = useCartStore((s) => s.carts);
  const activeCartId = useCartStore((s) => s.activeCartId);
  const toggleInCart = useCartStore((s) => s.toggleInCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const setActiveCart = useCartStore((s) => s.setActiveCart);

  const products = useProductStore((s) => s.products);

  const [selectorVisible, setSelectorVisible] = useState(false);

  const activeCart = useMemo(
    () => carts.find((c) => c.id === activeCartId) ?? null,
    [carts, activeCartId],
  );

  const listData = useMemo(() => {
    if (!activeCart) return [];
    return buildListData(activeCart.items, t('list.sections.listed'), t('list.sections.cart'));
  }, [activeCart, t]);

  const totals = useMemo(() => {
    if (!activeCart) {
      return { totalCount: 0, listedCount: 0, cartCount: 0, totalCost: 0, cartCost: 0 };
    }
    return getCartTotals(activeCart.items, products);
  }, [activeCart, products]);

  const handleToggle = useCallback(
    (productId: string) => {
      if (activeCartId) {
        toggleInCart(activeCartId, productId);
      }
    },
    [activeCartId, toggleInCart],
  );

  const handleIncrement = useCallback(
    (productId: string, currentQty: number) => {
      if (activeCartId && currentQty < 999) {
        updateQuantity(activeCartId, productId, currentQty + 1);
      }
    },
    [activeCartId, updateQuantity],
  );

  const handleDecrement = useCallback(
    (productId: string, currentQty: number) => {
      if (!activeCartId) return;
      if (currentQty <= 1) {
        removeItem(activeCartId, productId);
      } else {
        updateQuantity(activeCartId, productId, currentQty - 1);
      }
    },
    [activeCartId, updateQuantity, removeItem],
  );

  const handleQuickAdd = useCallback(() => {
    if (activeCartId) {
      router.push({ pathname: '/product-picker', params: { cartId: activeCartId } });
    }
  }, [activeCartId, router]);

  const handleSelectCart = useCallback(
    (cartId: string) => {
      setActiveCart(cartId);
    },
    [setActiveCart],
  );

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'header') {
        return <SectionHeader title={item.title} />;
      }
      const itemData = item as ItemData;
      return (
        <CartItemRow
          cartId={activeCartId ?? ''}
          item={itemData.item}
          onToggle={() => handleToggle(itemData.item.productId)}
          onIncrement={() => handleIncrement(itemData.item.productId, itemData.item.quantity)}
          onDecrement={() => handleDecrement(itemData.item.productId, itemData.item.quantity)}
        />
      );
    },
    [activeCartId, handleToggle, handleIncrement, handleDecrement],
  );

  const keyExtractor = useCallback((item: ListItem) => {
    if (item.type === 'header') return item.sectionKey;
    return item.key;
  }, []);

  if (!activeCart) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
        <ListHeader
          cartName={t('list.header.selectList')}
          onMenuPress={() => {}}
          onSelectList={() => setSelectorVisible(true)}
          onQuickAdd={() => {}}
          selectListLabel={t('list.header.selectList')}
          quickAddLabel={t('list.header.quickAdd')}
        />
        <EmptyListState message={t('list.empty.noList')} />
        <ListSelector
          visible={selectorVisible}
          carts={carts}
          activeCartId={activeCartId}
          onSelect={handleSelectCart}
          onClose={() => setSelectorVisible(false)}
          title={t('list.selector.title')}
          activeLabel={t('list.selector.active')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <ListHeader
        cartName={activeCart.name}
        onMenuPress={() => {}}
        onSelectList={() => setSelectorVisible(true)}
        onQuickAdd={handleQuickAdd}
        selectListLabel={t('list.header.selectList')}
        quickAddLabel={t('list.header.quickAdd')}
      />

      {activeCart.items.length === 0 ? (
        <EmptyListState message={t('list.empty.noItems')} showArrow />
      ) : (
        <LegendList
          data={listData}
          estimatedItemSize={80}
          recycleItems
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {activeCart.items.length > 0 && (
        <ListFooter
          totals={totals}
          totalLabel={t('list.footer.total')}
          pickedLabel={t('list.footer.picked')}
          itemsLabel={t('list.footer.items')}
        />
      )}

      <Pressable
        style={[styles.fab, { bottom: insets.bottom + spacing.md }]}
        onPress={handleQuickAdd}
        accessibilityLabel={t('cart.addItem')}
        accessibilityRole='button'
      >
        <Ionicons name='add' size={24} color={colors.white} />
      </Pressable>

      <ListSelector
        visible={selectorVisible}
        carts={carts}
        activeCartId={activeCartId}
        onSelect={handleSelectCart}
        onClose={() => setSelectorVisible(false)}
        title={t('list.selector.title')}
        activeLabel={t('list.selector.active')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
