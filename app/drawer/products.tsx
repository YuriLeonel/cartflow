import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/layout';
import { useProductStore } from '@/stores/useProductStore';
import { Ionicons } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list/react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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

const ProductListItem = React.memo(({ item }: { item: ListItem }) => {
  if (item.type === 'category') {
    return <Text style={styles.categoryHeader}>{item.category}</Text>;
  }
  return (
    <View
      style={styles.productCard}
      accessibilityRole='summary'
      accessibilityLabel={`${item.name}${item.expectedPrice !== undefined ? `, ${formatPrice(item.expectedPrice)}` : ''}`}
    >
      <Text style={styles.productName}>{item.name}</Text>
      {item.expectedPrice !== undefined && (
        <Text style={styles.productPrice}>{formatPrice(item.expectedPrice)}</Text>
      )}
    </View>
  );
});

export default function ProductsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const products = useProductStore((s) => s.products);
  const seedIfEmpty = useProductStore((s) => s.seedIfEmpty);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    seedIfEmpty();
  }, [seedIfEmpty]);

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

  const isSearching = searchQuery.trim().length > 0;
  const showNoResults = isSearching && filteredProducts.length === 0;

  if (products.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.title}>{t('products.title')}</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('products.noProducts')}</Text>
        </View>
        <Pressable
          style={[styles.fab, { bottom: insets.bottom + spacing.md }]}
          onPress={() => router.push('/product-form')}
          accessibilityLabel={t('products.newProduct')}
          accessibilityRole='button'
        >
          <Ionicons name='add' size={24} color={colors.white} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.title}>{t('products.title')}</Text>
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
      {showNoResults ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('products.emptyState')}</Text>
        </View>
      ) : (
        <LegendList
          data={sections}
          estimatedItemSize={64}
          keyExtractor={(item) => (item.type === 'category' ? `cat-${item.category}` : item.id)}
          stickyHeaderIndices={stickyIndices}
          renderItem={({ item }) => <ProductListItem item={item} />}
        />
      )}
      <Pressable
        style={[styles.fab, { bottom: insets.bottom + spacing.md }]}
        onPress={() => router.push('/product-form')}
        accessibilityLabel={t('products.newProduct')}
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
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
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
