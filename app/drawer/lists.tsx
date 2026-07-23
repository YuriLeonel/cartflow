import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/layout';
import { useCartStore } from '@/stores/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list/react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NameInputModalProps {
  visible: boolean;
  title: string;
  initialValue?: string;
  maxLength?: number;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

function NameInputModal({
  visible,
  title,
  initialValue = '',
  maxLength = 50,
  onConfirm,
  onCancel,
}: NameInputModalProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setValue(initialValue);
    }
  }, [visible, initialValue]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const trimmed = value.trim();
  const isValid = trimmed.length > 0 && trimmed !== initialValue;
  const hasError = visible && value.length > 0 && trimmed.length === 0;

  const handleConfirm = () => {
    if (isValid) {
      onConfirm(trimmed);
      setValue('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onCancel}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.modalBackdrop} onPress={onCancel} />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TextInput
            ref={inputRef}
            style={[styles.modalInput, hasError ? styles.modalInputError : null]}
            value={value}
            onChangeText={setValue}
            placeholder={t('lists.namePlaceholder')}
            placeholderTextColor={colors.textSecondary}
            maxLength={maxLength}
            autoCorrect={false}
            accessibilityLabel={t('cart.name')}
          />
          {hasError ? <Text style={styles.modalError}>{t('lists.nameRequired')}</Text> : null}
          <View style={styles.modalButtons}>
            <Pressable style={styles.modalCancelButton} onPress={onCancel}>
              <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
            </Pressable>
            <Pressable
              style={[styles.modalConfirmButton, !isValid ? styles.modalConfirmDisabled : null]}
              onPress={handleConfirm}
              disabled={!isValid}
            >
              <Text
                style={[styles.modalConfirmText, !isValid ? styles.modalConfirmTextDisabled : null]}
              >
                {t('common.confirm')}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function ListsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const carts = useCartStore((s) => s.carts);
  const addCart = useCartStore((s) => s.addCart);
  const removeCart = useCartStore((s) => s.removeCart);
  const renameCart = useCartStore((s) => s.renameCart);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'rename'>('create');
  const [editingCartId, setEditingCartId] = useState<string | null>(null);
  const [editingCartName, setEditingCartName] = useState('');

  const sortedCarts = useMemo(
    () =>
      [...carts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [carts],
  );

  const openCreateModal = () => {
    setModalMode('create');
    setEditingCartId(null);
    setEditingCartName('');
    setModalVisible(true);
  };

  const openRenameModal = (cartId: string, currentName: string) => {
    setModalMode('rename');
    setEditingCartId(cartId);
    setEditingCartName(currentName);
    setModalVisible(true);
  };

  const handleModalConfirm = (name: string) => {
    setModalVisible(false);
    if (modalMode === 'create') {
      addCart(name);
    } else if (editingCartId) {
      renameCart(editingCartId, name);
    }
  };

  const handleLongPress = (cartId: string, currentName: string) => {
    Alert.alert(currentName, undefined, [
      {
        text: t('cart.contextRename'),
        onPress: () => openRenameModal(cartId, currentName),
      },
      {
        text: t('cart.contextDelete'),
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
          recycleItems
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
        onPress={openCreateModal}
        accessibilityLabel={t('lists.newList')}
        accessibilityRole='button'
      >
        <Ionicons name='add' size={24} color={colors.white} />
      </Pressable>

      <NameInputModal
        visible={modalVisible}
        title={modalMode === 'create' ? t('lists.createTitle') : t('lists.renameTitle')}
        initialValue={modalMode === 'rename' ? editingCartName : ''}
        onConfirm={handleModalConfirm}
        onCancel={() => setModalVisible(false)}
      />
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: fontSize.h2,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.body,
    color: colors.text,
    backgroundColor: colors.surface,
    height: 48,
  },
  modalInputError: {
    borderColor: colors.error,
  },
  modalError: {
    fontSize: fontSize.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalCancelButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  modalCancelText: {
    fontSize: fontSize.button,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
  modalConfirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  modalConfirmDisabled: {
    opacity: 0.5,
  },
  modalConfirmText: {
    fontSize: fontSize.button,
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
  modalConfirmTextDisabled: {
    opacity: 0.7,
  },
});
