import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/layout';
import { parsePrice } from '@/lib/format';
import { useProductStore } from '@/stores/useProductStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { productId } = useLocalSearchParams<{ productId?: string }>();
  const isEditMode = !!productId;
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const products = useProductStore((s) => s.products);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    if (isEditMode && productId) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setName(product.name);
        setCategory(product.category || '');
        setExpectedPrice(product.expectedPrice != null ? String(product.expectedPrice) : '');
      }
    }
  }, [isEditMode, productId, products]);

  const handleSave = () => {
    setNameError('');
    setPriceError('');

    if (isEditMode && productId) {
      updateProduct(productId, {
        name: name.trim(),
        category: category.trim() || undefined,
        expectedPrice: parsePrice(expectedPrice),
      });
      router.back();
      return;
    }

    const result = addProduct({
      name: name.trim(),
      category: category.trim() || undefined,
      expectedPrice: parsePrice(expectedPrice),
    });

    if (result) {
      if (result === 'error.product.name.required') {
        setNameError(t(result));
      } else if (result === 'error.product.name.maxLength') {
        setNameError(t(result));
      } else if (result === 'error.product.price.positive') {
        setPriceError(t(result));
      }
      return;
    }

    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.content, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.title}>
          {isEditMode ? t('products.editProduct') : t('products.newProduct')}
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>{t('products.nameLabel')}</Text>
          <TextInput
            style={[styles.input, nameError ? styles.inputError : null]}
            value={name}
            onChangeText={setName}
            placeholder={t('products.namePlaceholder')}
            placeholderTextColor={colors.textSecondary}
            maxLength={100}
            autoCorrect={false}
            accessibilityLabel={t('products.nameLabel')}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('products.category')}</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder={t('products.withoutCategory')}
            placeholderTextColor={colors.textSecondary}
            autoCorrect={false}
            accessibilityLabel={t('products.category')}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('products.expectedPrice')}</Text>
          <TextInput
            style={[styles.input, priceError ? styles.inputError : null]}
            value={expectedPrice}
            onChangeText={setExpectedPrice}
            placeholder={t('products.pricePlaceholder')}
            placeholderTextColor={colors.textSecondary}
            keyboardType='numeric'
            accessibilityLabel={t('products.expectedPrice')}
          />
          {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.cancelButton}
            onPress={handleCancel}
            accessibilityLabel={t('common.cancel')}
            accessibilityRole='button'
          >
            <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
          </Pressable>
          <Pressable
            style={styles.saveButton}
            onPress={handleSave}
            accessibilityLabel={t('common.save')}
            accessibilityRole='button'
          >
            <Text style={styles.saveButtonText}>{t('common.save')}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
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
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: fontSize.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  cancelButtonText: {
    fontSize: fontSize.button,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    fontSize: fontSize.button,
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
});
