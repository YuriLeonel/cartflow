import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/layout';
import type { Cart } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list/react-native';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface ListSelectorProps {
  visible: boolean;
  carts: Cart[];
  activeCartId: string | null;
  onSelect: (cartId: string) => void;
  onClose: () => void;
  title: string;
  activeLabel: string;
}

export function ListSelector({
  visible,
  carts,
  activeCartId,
  onSelect,
  onClose,
  title,
  activeLabel,
}: ListSelectorProps) {
  const handleSelect = (cartId: string) => {
    onSelect(cartId);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          {carts.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma lista criada</Text>
          ) : (
            <LegendList
              data={carts}
              estimatedItemSize={56}
              recycleItems
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isActive = item.id === activeCartId;
                return (
                  <Pressable
                    style={[styles.row, isActive && styles.rowActive]}
                    onPress={() => handleSelect(item.id)}
                    accessibilityRole='button'
                    accessibilityLabel={`${item.name}${isActive ? ` — ${activeLabel}` : ''}`}
                  >
                    <Text
                      style={[styles.rowText, isActive && styles.rowTextActive]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    {isActive && <Ionicons name='checkmark' size={20} color={colors.primary} />}
                  </Pressable>
                );
              }}
            />
          )}
          <Pressable style={styles.closeButton} onPress={onClose} accessibilityLabel='Fechar'>
            <Text style={styles.closeText}>Fechar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxHeight: '60%',
  },
  title: {
    fontSize: fontSize.h2,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowActive: {
    backgroundColor: `${colors.primary}10`,
  },
  rowText: {
    fontSize: fontSize.body,
    color: colors.text,
    flex: 1,
  },
  rowTextActive: {
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  closeButton: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  closeText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
});
