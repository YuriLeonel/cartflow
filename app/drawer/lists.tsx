import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/layout';
import { useCartStore } from '@/stores/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list/react-native';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ListsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const carts = useCartStore((s) => s.carts);
  const addCart = useCartStore((s) => s.addCart);
  const removeCart = useCartStore((s) => s.removeCart);
  const renameCart = useCartStore((s) => s.renameCart);

  const sortedCarts = useMemo(
    () =>
      [...carts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [carts],
  );

  const handleCreate = () => {
    Alert.prompt?.(
      t('cart.name'),
      undefined,
      (name: string) => {
        if (name) {
          addCart(name);
        }
      },
      'plain-text',
      '',
      t('common.confirm'),
    );
  };

  const handleLongPress = (cartId: string, currentName: string) => {
    Alert.alert(currentName, undefined, [
      {
        text: t('cart.rename'),
        onPress: () => {
          Alert.prompt?.(
            t('cart.name'),
            currentName,
            (newName: string) => {
              if (newName && newName !== currentName) {
                renameCart(cartId, newName);
              }
            },
            'plain-text',
            currentName,
            t('common.save'),
          );
        },
      },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          Alert.alert(t('cart.confirmDelete'), t('cart.confirmDeleteMessage'), [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('common.delete'), style: 'destructive', onPress: () => removeCart(cartId) },
          ]);
        },
      },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const handleCreateFallback = () => {
    const name = `Lista ${carts.length + 1}`;
    addCart(name);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.title}>{t('lists.title')}</Text>

      {sortedCarts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('lists.emptyState')}</Text>
        </View>
      ) : (
        <LegendList
          data={sortedCarts}
          estimatedItemSize={72}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.cartCard}
              onPress={() => router.push({ pathname: '/cart-detail', params: { cartId: item.id } })}
              onLongPress={() => handleLongPress(item.id, item.name)}
              accessibilityRole='button'
              accessibilityLabel={item.name}
            >
              <View style={styles.cartInfo}>
                <Text style={styles.cartName}>{item.name}</Text>
                <Text style={styles.cartCount}>
                  {item.items.length} {t('cart.items')}
                </Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color={colors.textSecondary} />
            </Pressable>
          )}
        />
      )}

      <Pressable
        style={[styles.fab, { bottom: insets.bottom + spacing.md }]}
        onPress={handleCreateFallback}
        accessibilityLabel={t('lists.newList')}
        accessibilityRole='button'
      >
        <Ionicons name='add' size={24} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  cartCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cartInfo: {
    flex: 1,
  },
  cartName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  cartCount: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
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
