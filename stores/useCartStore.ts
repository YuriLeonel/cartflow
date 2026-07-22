import { randomUUID } from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from '../lib/storage';
import type { Cart, CartItem, CartSummary } from '../types';

export const validateCartName = (name: string): string | null => {
  const trimmed = name.trim();
  if (trimmed.length === 0) return 'error.cart.name.required';
  if (trimmed.length > 50) return 'error.cart.name.maxLength';
  return null;
};

export const validateQuantity = (quantity: number): string | null => {
  if (!Number.isInteger(quantity) || quantity <= 0) return 'error.cart.quantity.positive';
  if (quantity > 999) return 'error.cart.quantity.max';
  return null;
};

interface CartStore {
  carts: Cart[];
  activeCartId: string | null;
  addCart: (name: string) => string | null;
  removeCart: (id: string) => void;
  renameCart: (id: string, name: string) => string | null;
  setActiveCart: (id: string | null) => void;
  addItem: (cartId: string, productId: string, quantity: number) => string | null;
  removeItem: (cartId: string, productId: string) => void;
  updateQuantity: (cartId: string, productId: string, quantity: number) => void;
  updateCurrentPrice: (cartId: string, productId: string, price?: number) => void;
  toggleInCart: (cartId: string, productId: string) => string | null;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      carts: [],
      activeCartId: null,

      addCart: (name) => {
        const error = validateCartName(name);
        if (error) return error;
        const now = new Date().toISOString();
        const newCart: Cart = {
          id: `cart_${randomUUID()}`,
          name: name.trim(),
          items: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ carts: [...state.carts, newCart] }));
        return null;
      },

      removeCart: (id) =>
        set((state) => ({
          carts: state.carts.filter((c) => c.id !== id),
          activeCartId: state.activeCartId === id ? null : state.activeCartId,
        })),

      renameCart: (id, name) => {
        const error = validateCartName(name);
        if (error) return error;
        set((state) => ({
          carts: state.carts.map((c) =>
            c.id === id ? { ...c, name: name.trim(), updatedAt: new Date().toISOString() } : c,
          ),
        }));
        return null;
      },

      setActiveCart: (id) => set({ activeCartId: id }),

      addItem: (cartId, productId, quantity) => {
        const qtyError = validateQuantity(quantity);
        if (qtyError) return qtyError;
        set((state) => ({
          carts: state.carts.map((cart) => {
            if (cart.id !== cartId) return cart;
            const existing = cart.items.find((item) => item.productId === productId);
            const newItems = existing
              ? cart.items.map((item) =>
                  item.productId === productId
                    ? { ...item, quantity: item.quantity + quantity }
                    : item,
                )
              : [...cart.items, { productId, quantity, inCart: false }];
            return { ...cart, items: newItems, updatedAt: new Date().toISOString() };
          }),
        }));
        return null;
      },

      removeItem: (cartId, productId) =>
        set((state) => ({
          carts: state.carts.map((cart) => {
            if (cart.id !== cartId) return cart;
            return {
              ...cart,
              items: cart.items.filter((item) => item.productId !== productId),
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      updateQuantity: (cartId, productId, quantity) =>
        set((state) => ({
          carts: state.carts.map((cart) => {
            if (cart.id !== cartId) return cart;
            const newItems =
              quantity <= 0
                ? cart.items.filter((item) => item.productId !== productId)
                : cart.items.map((item) =>
                    item.productId === productId ? { ...item, quantity } : item,
                  );
            return { ...cart, items: newItems, updatedAt: new Date().toISOString() };
          }),
        })),

      updateCurrentPrice: (cartId, productId, price) =>
        set((state) => ({
          carts: state.carts.map((cart) => {
            if (cart.id !== cartId) return cart;
            return {
              ...cart,
              items: cart.items.map((item) =>
                item.productId === productId ? { ...item, currentPrice: price } : item,
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      toggleInCart: (cartId, productId) => {
        let found = false;
        set((state) => ({
          carts: state.carts.map((cart) => {
            if (cart.id !== cartId) return cart;
            return {
              ...cart,
              items: cart.items.map((item) => {
                if (item.productId !== productId) return item;
                found = true;
                return { ...item, inCart: !item.inCart };
              }),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
        return found ? null : 'error.cart.item.notFound';
      },
    }),
    {
      name: 'cartflow-carts',
      storage: createJSONStorage(() => zustandMMKVStorage),
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as {
          carts?: Array<{ items?: Array<{ inCart?: boolean }> }>;
          activeCartId?: string | null;
        };
        if (version === 0 || version === 1) {
          const oldCarts = (state?.carts ?? []) as CartSummary[];
          return {
            ...state,
            carts: oldCarts.map((c) => ({
              id: c.id,
              name: c.name,
              items: [],
              createdAt: c.createdAt,
              updatedAt: c.updatedAt,
            })),
          };
        }
        if (version === 2) {
          return {
            ...state,
            carts: (state?.carts ?? []).map((cart) => ({
              ...cart,
              items: (cart.items ?? []).map((item) => ({
                ...item,
                inCart: item.inCart ?? false,
              })),
            })),
          };
        }
        return persistedState;
      },
    },
  ),
);
