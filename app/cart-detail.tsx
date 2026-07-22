import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/layout';
import { useCartStore } from '@/stores/useCartStore';
import { useProductStore } from '@/stores/useProductStore';
import { Ionicons } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

interface CartItemRowProps {
  cartId: string;
  productId: string;
  quantity: number;
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

const CartItemRow = React.memo(
  ({ cartId, productId, quantity, onRemove, onIncrement, onDecrement }: CartItemRowProps) => {
    const { t } = useTranslation();
    const product = useProductStore((s) => s.products.find((p) => p.id === productId));
    const cartItem = useCartStore((s) =>
      s.carts.find((c) => c.id === cartId)?.items.find((item) => item.productId === productId),
    );
    const updateCurrentPrice = useCartStore((s) => s.updateCurrentPrice);

    const [editingPrice, setEditingPrice] = useState(false);
    const [priceInput, setPriceInput] = useState('');

    const currentPrice = cartItem?.currentPrice;
    const expectedPrice = product?.expectedPrice;

    const priceIndicator =
      currentPrice !== undefined && expectedPrice !== undefined
        ? currentPrice <= expectedPrice
          ? ('under' as const)
          : ('over' as const)
        : null;

    const handlePriceTap = () => {
      setPriceInput(currentPrice !== undefined ? String(currentPrice) : '');
      setEditingPrice(true);
    };

    const handlePriceSubmit = () => {
      const parsed = Number.parseFloat(priceInput);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        updateCurrentPrice(cartId, productId, parsed);
      } else if (priceInput.trim() === '') {
        updateCurrentPrice(cartId, productId, undefined);
      }
      setEditingPrice(false);
    };

    const handleClearPrice = () => {
      updateCurrentPrice(cartId, productId, undefined);
      setEditingPrice(false);
    };

    const cardBorderStyle =
      priceIndicator === 'under'
        ? { borderLeftColor: colors.secondary, borderLeftWidth: 3 }
        : priceIndicator === 'over'
          ? { borderLeftColor: colors.error, borderLeftWidth: 3 }
          : {};

    return (
      <View style={[styles.itemCard, cardBorderStyle]} accessibilityRole='summary'>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{product?.name ?? t('cart.noItems')}</Text>
          {product?.category && <Text style={styles.itemCategory}>{product.category}</Text>}
          <View style={styles.priceArea}>
            {expectedPrice !== undefined && (
              <Text style={styles.itemPrice}>{formatPrice(expectedPrice)}</Text>
            )}
            {editingPrice ? (
              <TextInput
                style={styles.priceInput}
                value={priceInput}
                onChangeText={setPriceInput}
                onSubmitEditing={handlePriceSubmit}
                onBlur={handlePriceSubmit}
                keyboardType='numeric'
                placeholder={t('cart.setPrice')}
                accessibilityLabel={t('cart.currentPrice')}
                returnKeyType='done'
                autoFocus
              />
            ) : (
              <Pressable
                onPress={handlePriceTap}
                accessibilityLabel={
                  currentPrice !== undefined ? t('cart.currentPrice') : t('cart.setPrice')
                }
                accessibilityRole='button'
              >
                {currentPrice !== undefined ? (
                  <View style={styles.currentPriceRow}>
                    <Text style={styles.currentPrice}>{formatPrice(currentPrice)}</Text>
                    <Pressable
                      onPress={handleClearPrice}
                      accessibilityLabel={t('common.delete')}
                      accessibilityRole='button'
                    >
                      <Ionicons name='close-circle' size={16} color={colors.error} />
                    </Pressable>
                  </View>
                ) : (
                  <Text style={styles.setPriceText}>{t('cart.setPrice')}</Text>
                )}
              </Pressable>
            )}
          </View>
        </View>
        <View style={styles.itemActions}>
          <View style={styles.quantityRow}>
            <Pressable
              style={styles.quantityButton}
              onPress={onDecrement}
              accessibilityLabel={t('item.quantity')}
              accessibilityRole='button'
            >
              <Ionicons name='remove' size={18} color={colors.primary} />
            </Pressable>
            <Text style={styles.quantityText}>{quantity}</Text>
            <Pressable
              style={styles.quantityButton}
              onPress={onIncrement}
              accessibilityLabel={t('item.quantity')}
              accessibilityRole='button'
            >
              <Ionicons name='add' size={18} color={colors.primary} />
            </Pressable>
          </View>
          <Pressable
            style={styles.deleteButton}
            onPress={onRemove}
            accessibilityLabel={t('item.remove')}
            accessibilityRole='button'
          >
            <Ionicons name='trash-outline' size={18} color={colors.error} />
          </Pressable>
        </View>
      </View>
    );
  },
);

interface SummaryData {
  expectedTotal: number;
  currentTotal: number;
  difference: number;
  hasCurrentPrice: boolean;
}

function CartSummary({ data }: { data: SummaryData }) {
  const { t } = useTranslation();

  const differenceLabel =
    data.difference < 0
      ? t('cart.underBudget')
      : data.difference > 0
        ? t('cart.overBudget')
        : t('cart.onBudget');

  const differenceColor = data.difference <= 0 ? colors.secondary : colors.error;

  const percentage =
    data.expectedTotal > 0
      ? ` (${((Math.abs(data.difference) / data.expectedTotal) * 100).toFixed(1)}%)`
      : '';

  return (
    <View style={styles.summary} accessibilityRole='summary'>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{t('cart.expectedTotal')}</Text>
        <Text style={styles.summaryValue}>{formatPrice(data.expectedTotal)}</Text>
      </View>
      {data.hasCurrentPrice && (
        <>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.currentTotal')}</Text>
            <Text style={styles.summaryValue}>{formatPrice(data.currentTotal)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: differenceColor }]}>{differenceLabel}</Text>
            <Text style={[styles.summaryValue, { color: differenceColor }]}>
              {data.difference > 0 ? '+' : ''}
              {formatPrice(Math.abs(data.difference))}
              {percentage}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

export default function CartDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartId } = useLocalSearchParams<{ cartId: string }>();

  const cart = useCartStore((s) => s.carts.find((c) => c.id === cartId));
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const products = useProductStore((s) => s.products);

  const summaryData = useMemo(() => {
    if (!cart) return null;

    let expectedTotal = 0;
    let currentTotal = 0;
    let hasCurrentPrice = false;

    for (const item of cart.items) {
      const product = products.find((p) => p.id === item.productId);
      if (product?.expectedPrice !== undefined) {
        expectedTotal += product.expectedPrice * item.quantity;
      }
      if (item.currentPrice !== undefined) {
        currentTotal += item.currentPrice * item.quantity;
        hasCurrentPrice = true;
      }
    }

    return {
      expectedTotal,
      currentTotal,
      difference: currentTotal - expectedTotal,
      hasCurrentPrice,
    };
  }, [cart, products]);

  const handleRemove = (productId: string) => {
    Alert.alert(t('item.remove'), t('item.confirmRemove'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => removeItem(cartId, productId),
      },
    ]);
  };

  const handleIncrement = (productId: string, currentQty: number) => {
    if (currentQty < 999) {
      updateQuantity(cartId, productId, currentQty + 1);
    }
  };

  const handleDecrement = (productId: string, currentQty: number) => {
    if (currentQty <= 1) {
      handleRemove(productId);
    } else {
      updateQuantity(cartId, productId, currentQty - 1);
    }
  };

  const itemCount = cart?.items.length ?? 0;

  if (!cart) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel={t('common.cancel')}
        >
          <Ionicons name='close' size={24} color={colors.text} />
        </Pressable>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('cart.emptyState')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel={t('common.cancel')}
        >
          <Ionicons name='close' size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitle}>
          <Text style={styles.title} numberOfLines={1}>
            {cart.name}
          </Text>
          <Text style={styles.subtitle}>
            {itemCount} {t('cart.items')}
          </Text>
        </View>
      </View>

      {itemCount === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('cart.emptyState')}</Text>
          <Pressable
            style={styles.emptyButton}
            onPress={() => router.push({ pathname: '/product-picker', params: { cartId } })}
            accessibilityLabel={t('cart.addItem')}
            accessibilityRole='button'
          >
            <Text style={styles.emptyButtonText}>{t('cart.addItem')}</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.listContainer}>
            <LegendList
              data={cart.items}
              estimatedItemSize={80}
              keyExtractor={(item) => item.productId}
              renderItem={({ item }) => (
                <CartItemRow
                  cartId={cartId}
                  productId={item.productId}
                  quantity={item.quantity}
                  onRemove={() => handleRemove(item.productId)}
                  onIncrement={() => handleIncrement(item.productId, item.quantity)}
                  onDecrement={() => handleDecrement(item.productId, item.quantity)}
                />
              )}
            />
          </View>
          {summaryData && <CartSummary data={summaryData} />}
        </>
      )}

      {itemCount > 0 && (
        <Pressable
          style={[styles.fab, { bottom: insets.bottom + spacing.md }]}
          onPress={() => router.push({ pathname: '/product-picker', params: { cartId } })}
          accessibilityLabel={t('cart.addItem')}
          accessibilityRole='button'
        >
          <Ionicons name='add' size={24} color={colors.white} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  listContainer: {
    flex: 1,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  itemCategory: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  priceArea: {
    marginTop: spacing.xs,
  },
  itemPrice: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  currentPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  currentPrice: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  setPriceText: {
    fontSize: fontSize.caption,
    color: colors.primary,
  },
  priceInput: {
    fontSize: fontSize.caption,
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 2,
    minWidth: 80,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    marginHorizontal: spacing.md,
    minWidth: 24,
    textAlign: 'center',
  },
  deleteButton: {
    padding: spacing.xs,
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
    marginBottom: spacing.md,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  emptyButtonText: {
    fontSize: fontSize.button,
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
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
