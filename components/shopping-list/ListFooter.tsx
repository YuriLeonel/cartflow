import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/layout';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { CartTotals } from './list-utils';
import { formatPrice } from './list-utils';

interface ListFooterProps {
  totals: CartTotals;
  totalLabel: string;
  pickedLabel: string;
  itemsLabel: string;
}

export function ListFooter({ totals, totalLabel, pickedLabel, itemsLabel }: ListFooterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.panelLabel}>{totalLabel}</Text>
        <Text style={styles.panelCount}>
          {totals.totalCount} {itemsLabel}
        </Text>
        <Text style={styles.panelCost}>{formatPrice(totals.totalCost)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.panel}>
        <Text style={styles.panelLabel}>{pickedLabel}</Text>
        <Text style={styles.panelCount}>
          {totals.cartCount} {itemsLabel}
        </Text>
        <Text style={styles.panelCost}>{formatPrice(totals.cartCost)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  panel: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  panelLabel: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  panelCount: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  panelCost: {
    fontSize: fontSize.h2,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
});
