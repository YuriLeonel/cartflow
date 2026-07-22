import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/layout';
import { useCartStore } from '@/stores/useCartStore';
import { useProductStore } from '@/stores/useProductStore';
import { Ionicons } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CategorySection {
  type: 'category';
  category: string;
}

interface ProductItem {
  type: 'product';
  id: string;
  name: string;
  category?: string;
  expectedPrice?: number;
}

type ListItem = CategorySection | ProductItem;

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

const PickerListItem = React.memo(
  ({ item, onSelect }: { item: ListItem; onSelect: (productId: string) => void }) => {
    const { t } = useTranslation();

    if (item.type === 'category') {
      return <Text style={styles.categoryHeader}>{item.category}</Text>;
    }

    return (
      <Pressable
        style={styles.productCard}
        onPress={() => onSelect(item.id)}
        accessibilityRole='button'
        accessibilityLabel={`${item.name}${item.expectedPrice !== undefined ? `, ${formatPrice(item.expectedPrice)}` : ''}`}
      >
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          {item.expectedPrice !== undefined && (
            <Text style={styles.productPrice}>{formatPrice(item.expectedPrice)}</Text>
          )}
        </View>
        <Ionicons name='add-circle' size={28} color={colors.primary} />
      </Pressable>
    );
  },
);

export default function ProductPickerScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartId } = useLocalSearchParams<{ cartId: string }>();

  const products = useProductStore((s) => s.products);
  const addItem = useCartStore((s) => s.addItem);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.trim().toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(query));
  }, [products, searchQuery]);

  const sections = useMemo(() => {
    const grouped = new Map<string, Array<ProductItem>>();
    for (const product of filteredProducts) {
      const category = product.category || t('products.withoutCategory');
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)?.push({
        type: 'product',
        id: product.id,
        name: product.name,
        category: product.category,
        expectedPrice: product.expectedPrice,
      });
    }
    const result: ListItem[] = [];
    const sortedCategories = Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));
    for (const [category, items] of sortedCategories) {
      result.push({ type: 'category', category });
      result.push(...items);
    }
    return result;
  }, [filteredProducts, t]);

  const stickyIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].type === 'category') {
        indices.push(i);
      }
    }
    return indices;
  }, [sections]);

  const handleSelectProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    Alert.alert(t('item.addTitle'), product?.name ?? '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.confirm'),
        onPress: () => {
          const error = addItem(cartId, productId, 1);
          if (!error) {
            router.back();
          }
        },
      },
    ]);
  };

  if (products.length === 0) {
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
          <Text style={styles.title}>{t('item.addTitle')}</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('products.noProducts')}</Text>
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
        <Text style={styles.title}>{t('item.addTitle')}</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name='search' size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('products.search')}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          accessibilityLabel={t('products.search')}
        />
      </View>

      {sections.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('products.emptyState')}</Text>
        </View>
      ) : (
        <LegendList
          data={sections}
          estimatedItemSize={64}
          keyExtractor={(item) => (item.type === 'category' ? `cat-${item.category}` : item.id)}
          stickyHeaderIndices={stickyIndices}
          renderItem={({ item }) => <PickerListItem item={item} onSelect={handleSelectProduct} />}
        />
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
  title: {
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.body,
    color: colors.text,
    padding: 0,
  },
  categoryHeader: {
    fontSize: fontSize.h2,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  productInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  productName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  productPrice: {
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
