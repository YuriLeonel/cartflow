import { colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing } from '@/constants/layout';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ListHeaderProps {
  cartName: string;
  onMenuPress: () => void;
  onSelectList: () => void;
  onQuickAdd: () => void;
  selectListLabel: string;
  quickAddLabel: string;
}

export function ListHeader({
  cartName,
  onMenuPress,
  onSelectList,
  onQuickAdd,
  selectListLabel,
  quickAddLabel,
}: ListHeaderProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.iconButton}
        onPress={onMenuPress}
        accessibilityLabel={t('common.openMenu')}
        accessibilityRole='button'
      >
        <Ionicons name='menu' size={24} color={colors.text} />
      </Pressable>

      <Pressable
        style={styles.nameContainer}
        onPress={onSelectList}
        accessibilityLabel={`${selectListLabel}: ${cartName}`}
        accessibilityRole='button'
      >
        <Text style={styles.cartName} numberOfLines={1}>
          {cartName}
        </Text>
        <Ionicons name='chevron-down' size={16} color={colors.textSecondary} />
      </Pressable>

      <Pressable
        style={styles.iconButton}
        onPress={onQuickAdd}
        accessibilityLabel={quickAddLabel}
        accessibilityRole='button'
      >
        <Ionicons name='add-circle-outline' size={24} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  iconButton: {
    padding: spacing.sm,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  cartName: {
    fontSize: fontSize.h2,
    fontWeight: fontWeight.bold,
    maxWidth: 200,
  },
});
