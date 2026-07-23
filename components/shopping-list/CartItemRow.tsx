import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/layout';
import { useProductStore } from '@/stores/useProductStore';
import type { CartItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatPrice, getDisplayPrice, getPriceColor } from './list-utils';

interface CartItemRowProps {
  cartId: string;
  item: CartItem;
  onToggle: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const CartItemRow = React.memo(function CartItemRow({
  cartId,
  item,
  onToggle,
  onIncrement,
  onDecrement,
}: CartItemRowProps) {
  const { t } = useTranslation();
  const product = useProductStore((s) => s.products.find((p) => p.id === item.productId));
  const priceColor = getPriceColor(item, product);
  const displayPrice = getDisplayPrice(item, product);

  const borderColor =
    priceColor === 'green' ? colors.secondary : priceColor === 'red' ? colors.error : 'transparent';

  return (
    <View
      style={[
        styles.container,
        { borderLeftColor: borderColor, borderLeftWidth: borderColor === 'transparent' ? 0 : 3 },
      ]}
      accessibilityRole='summary'
    >
      <Pressable
        style={styles.checkbox}
        onPress={onToggle}
        accessibilityRole='checkbox'
        accessibilityState={{ checked: item.inCart }}
        accessibilityLabel={item.inCart ? t('item.uncheck') : t('item.checkPicked')}
      >
        <Ionicons
          name={item.inCart ? 'checkbox' : 'square-outline'}
          size={24}
          color={item.inCart ? colors.secondary : colors.textSecondary}
        />
      </Pressable>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product?.name ?? t('item.productFallback')}
        </Text>
        <Text style={styles.price}>{displayPrice}</Text>
      </View>

      <View style={styles.quantityRow}>
        <Pressable
          style={styles.quantityButton}
          onPress={onDecrement}
          accessibilityLabel={t('item.decreaseQuantity')}
          accessibilityRole='button'
        >
          <Ionicons name='remove' size={16} color={colors.primary} />
        </Pressable>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <Pressable
          style={styles.quantityButton}
          onPress={onIncrement}
          accessibilityLabel={t('item.increaseQuantity')}
          accessibilityRole='button'
        >
          <Ionicons name='add' size={16} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  checkbox: {
    paddingRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  price: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
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
    marginHorizontal: spacing.sm,
    minWidth: 20,
    textAlign: 'center',
  },
});
