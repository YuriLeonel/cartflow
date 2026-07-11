import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from '../lib/storage';
import type { Product } from '../types';

const seedProducts: Product[] = [
  {
    id: 'seed_1',
    name: 'Arroz Tipo 1 Tio João 1kg',
    category: 'Grãos',
    expectedPrice: 8.49,
  },
  {
    id: 'seed_2',
    name: 'Feijão Carioca Camil 1kg',
    category: 'Grãos',
    expectedPrice: 9.99,
  },
  {
    id: 'seed_3',
    name: 'Óleo de Soja Liza 900ml',
    category: 'Mercearia',
    expectedPrice: 6.79,
  },
  {
    id: 'seed_4',
    name: 'Açúcar Cristal União 1kg',
    category: 'Mercearia',
    expectedPrice: 5.29,
  },
  {
    id: 'seed_5',
    name: 'Leite Integral Piracanjuba 1L',
    category: 'Laticínios',
    expectedPrice: 5.69,
  },
  {
    id: 'seed_6',
    name: 'Queijo Mussarela Fatiado 200g',
    category: 'Laticínios',
    expectedPrice: 12.99,
  },
  {
    id: 'seed_7',
    name: 'Banana Prata 1kg',
    category: 'Hortifruti',
    expectedPrice: 7.49,
  },
  {
    id: 'seed_8',
    name: 'Tomate Italiano 1kg',
    category: 'Hortifruti',
    expectedPrice: 9.99,
  },
  {
    id: 'seed_9',
    name: 'Café Pilão Torrado e Moído 500g',
    category: 'Mercearia',
    expectedPrice: 15.99,
  },
  {
    id: 'seed_10',
    name: 'Macarrão Espaguete Adria 500g',
    category: 'Mercearia',
    expectedPrice: 4.29,
  },
];

export interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => string | null;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => void;
  seedIfEmpty: () => void;
}

const validateProduct = (product: Omit<Product, 'id'>): string | null => {
  const trimmedName = product.name.trim();
  if (trimmedName.length === 0) {
    return 'error.product.name.required';
  }
  if (trimmedName.length > 100) {
    return 'error.product.name.maxLength';
  }
  if (product.expectedPrice !== undefined && product.expectedPrice <= 0) {
    return 'error.product.price.positive';
  }
  return null;
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],

      addProduct: (product) => {
        const error = validateProduct(product);
        if (error) {
          return error;
        }
        const newProduct: Product = {
          ...product,
          name: product.name.trim(),
          id: `product_${Date.now()}`,
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
        return null;
      },

      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      seedIfEmpty: () =>
        set((state) => {
          if (state.products.length === 0) {
            return { products: seedProducts };
          }
          return {};
        }),
    }),
    {
      name: 'cartflow-products',
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
