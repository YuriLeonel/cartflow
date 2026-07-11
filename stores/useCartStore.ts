import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from '../lib/storage';
import type { CartSummary } from '../types';

interface CartStore {
  carts: CartSummary[];
  activeCartId: string | null;
  addCart: (name: string) => void;
  removeCart: (id: string) => void;
  setActiveCart: (id: string | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      carts: [],
      activeCartId: null,

      addCart: (name) =>
        set((state) => {
          const now = new Date().toISOString();
          const newCart: CartSummary = {
            id: `cart_${Date.now()}`,
            name,
            createdAt: now,
            updatedAt: now,
          };
          return { carts: [...state.carts, newCart] };
        }),

      removeCart: (id) =>
        set((state) => ({
          carts: state.carts.filter((c) => c.id !== id),
          activeCartId: state.activeCartId === id ? null : state.activeCartId,
        })),

      setActiveCart: (id) => set({ activeCartId: id }),
    }),
    {
      name: 'cartflow-carts',
      storage: createJSONStorage(() => zustandMMKVStorage),
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          return persistedState;
        }
        return persistedState;
      },
    },
  ),
);
