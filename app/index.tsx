import { colors } from '@/constants/colors';
import { borderRadius, buttonPadding, fontSize, fontWeight, spacing } from '@/constants/layout';
import { useCartStore } from '@/stores/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const carts = useCartStore((s) => s.carts);
  const addCart = useCartStore((s) => s.addCart);

  const recentCarts = useMemo(
    () =>
      [...carts]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [carts],
  );

  const handleCreateCart = () => {
    const name = `Lista ${carts.length + 1}`;
    addCart(name);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.title}>{t('home.title')}</Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleCreateCart}
        accessibilityRole='button'
        accessibilityLabel={t('home.newCartA11y')}
      >
        <Text style={styles.buttonText}>{t('home.newCart')}</Text>
      </Pressable>
      <Text style={styles.sectionTitle}>{t('home.myCarts')}</Text>

      {recentCarts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('home.emptyState')}</Text>
        </View>
      ) : (
        recentCarts.map((cart) => (
          <Pressable
            key={cart.id}
            style={styles.cartRow}
            onPress={() => router.push({ pathname: '/cart-detail', params: { cartId: cart.id } })}
            accessibilityRole='button'
            accessibilityLabel={cart.name}
          >
            <View style={styles.cartInfo}>
              <Text style={styles.cartName}>{cart.name}</Text>
              <Text style={styles.cartCount}>
                {cart.items.length} {t('cart.items')}
              </Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color={colors.textSecondary} />
          </Pressable>
        ))
      )}
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
  },
  subtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: buttonPadding.vertical,
    paddingHorizontal: buttonPadding.horizontal,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.button,
    fontWeight: fontWeight.semibold,
  },
  sectionTitle: {
    fontSize: fontSize.h2,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  cartRow: {
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
});
