# Design: Phase R1 — Navigation Refactor

**Created:** 2026-07-22

---

## Architecture

### Current State

```
Root Stack
├── (tabs)                    ← Tab Navigator (4 tabs)
│   ├── index (Home)
│   ├── lists
│   ├── products
│   └── profile
├── product-form (modal)
├── cart-detail (modal)
└── product-picker (modal)
```

### Target State

```
Root Stack
├── drawer                    ← Drawer Navigator
│   ├── index (Active Shopping List)
│   ├── lists
│   └── products
├── product-form (modal)
├── cart-detail (modal)
└── product-picker (modal)
```

## Implementation Details

### 1. Drawer Layout (`app/drawer/_layout.tsx`)

- Uses `Drawer` from `expo-router/drawer`
- Two sidebar entries: Lists, Products
- Icons: Ionicons `list` for Lists, `cart` for Products
- Active tint color: `colors.primary` (#E8652D)

### 2. Root Layout (`app/_layout.tsx`)

- Remove `(tabs)` group reference
- Add `drawer` group reference
- Keep modals at Stack level
- Wrap in `GestureHandlerRootView` (already done)

### 3. Main Screen (`app/index.tsx`)

- Moves from `app/(tabs)/index.tsx` to `app/index.tsx`
- Content stays the same (placeholder for now, R2 will build it out)
- No longer wrapped in tab navigator

### 4. Data Model Changes

#### `types/index.ts`

```typescript
interface CartItem {
  productId: string;
  quantity: number;
  currentPrice?: number;
  inCart: boolean;  // NEW: tracks if item is "picked up"
}
```

#### `useCartStore.ts` — Migration

- Bump MMKV version from 2 to 3
- Migration: add `inCart: false` to all existing cart items

#### `useCartStore.ts` — New Action

```typescript
toggleInCart: (cartId: string, productId: string) => string | null
```

- Flips `inCart` boolean on the specified item
- Returns null on success, error key on failure

## Testing Strategy

### Existing Tests to Update

- `app/(tabs)/__tests__/TabLayout.test.tsx` → remove (tabs no longer exist)
- `app/(tabs)/__tests__/HomeScreen.test.tsx` → move to `app/__tests__/`
- `app/(tabs)/__tests__/ListsScreen.test.tsx` → move to `app/drawer/__tests__/`
- `app/(tabs)/__tests__/ProductsScreen.test.tsx` → move to `app/drawer/__tests__/`
- `app/(tabs)/__tests__/ProfileScreen.test.tsx` → delete (profile removed)

### New Tests

- `app/__tests__/RootLayout.test.tsx` — verify drawer + modals are registered
- `app/drawer/__tests__/DrawerLayout.test.tsx` — verify drawer entries
- `stores/__tests__/useCartStore.test.ts` — add tests for `toggleInCart` and v3 migration

### Mock Updates

- All screen tests need updated mocks for `expo-router` (drawer instead of tabs)
- Store tests need updated MMKV version and migration tests
