import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/layout';
import { useProductStore } from '@/stores/useProductStore';
import { LegendList } from '@legendapp/list/react-native';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
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

export default function ProductsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const products = useProductStore((s) => s.products);
  const seedIfEmpty = useProductStore((s) => s.seedIfEmpty);

  useEffect(() => {
    seedIfEmpty();
  }, [seedIfEmpty]);

  const sections = useMemo(() => {
    const grouped = new Map<string, Array<ProductItem>>();
    for (const product of products) {
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
    for (const [category, items] of grouped) {
      result.push({ type: 'category', category });
      result.push(...items);
    }
    return result;
  }, [products, t]);

  const stickyIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].type === 'category') {
        indices.push(i);
      }
    }
    return indices;
  }, [sections]);

  if (products.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.title}>{t('products.title')}</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('products.emptyState')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.title}>{t('products.title')}</Text>
      <LegendList
        data={sections}
        keyExtractor={(item: ListItem) =>
          item.type === 'category' ? `cat-${item.category}` : item.id
        }
        stickyHeaderIndices={stickyIndices}
        renderItem={({ item }: { item: ListItem }) => {
          if (item.type === 'category') {
            return <Text style={styles.categoryHeader}>{item.category}</Text>;
          }
          return (
            <View style={styles.productCard}>
              <Text style={styles.productName}>{item.name}</Text>
              {item.expectedPrice !== undefined && (
                <Text style={styles.productPrice}>{formatPrice(item.expectedPrice)}</Text>
              )}
            </View>
          );
        }}
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
});
