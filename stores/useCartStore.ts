import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'cartflow-storage' });

const zustandMMKVStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
};

interface Cart {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CartStore {
  carts: Cart[];
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
          const newCart: Cart = {
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
    },
  ),
);
