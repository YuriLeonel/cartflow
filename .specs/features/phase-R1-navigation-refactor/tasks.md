# Tasks: Phase R1 — Navigation Refactor

**Created:** 2026-07-22
**Total tasks:** 12

---

## Task Dependencies

```
T1 (install deps) → T2 (data model) → T3 (store migration + toggleInCart)
T1 → T4 (drawer layout) → T5 (root layout) → T6 (move index.tsx)
T6 → T7 (move lists.tsx) → T8 (move products.tsx)
T7, T8 → T9 (delete old files)
T9 → T10 (update tests)
T10 → T11 (new tests)
T11 → T12 (harness validation)
```

---

## Tasks

### T1: Install drawer dependencies

**Files:** `package.json`
**Action:** Run `npx expo install @react-navigation/drawer @react-navigation/native`
**Verify:** `npm run typecheck` passes, packages appear in package.json
**Commit:** `feat: install drawer navigation dependencies`

---

### T2: Add `inCart` field to CartItem type

**Files:** `types/index.ts`
**Action:** Add `inCart: boolean` to `CartItem` interface
**Verify:** `npm run typecheck` passes
**Commit:** `feat: add inCart field to CartItem type`

---

### T3: Add MMKV migration + toggleInCart action

**Files:** `stores/useCartStore.ts`
**Action:**
1. Bump MMKV version from 2 to 3
2. Add migration: `inCart: false` for all existing items
3. Add `toggleInCart(cartId, productId)` action
**Verify:** `npm run typecheck` passes, `npm run test` passes
**Commit:** `feat: add toggleInCart action and MMKV v3 migration`

---

### T4: Create drawer layout

**Files:** `app/drawer/_layout.tsx` (new)
**Action:**
1. Create `app/drawer/` directory
2. Create `_layout.tsx` with `Drawer` from `expo-router/drawer`
3. Two entries: Lists (icon: list), Products (icon: cart)
**Verify:** `npm run typecheck` passes
**Commit:** `feat: create drawer layout with Lists and Products entries`

---

### T5: Update root layout

**Files:** `app/_layout.tsx`
**Action:**
1. Remove `(tabs)` group reference
2. Add `drawer` group reference
3. Keep modals at Stack level
**Verify:** `npm run typecheck` passes
**Commit:** `refactor: update root layout to use drawer instead of tabs`

---

### T6: Move index.tsx to root

**Files:** `app/(tabs)/index.tsx` → `app/index.tsx`
**Action:**
1. Move file from `app/(tabs)/index.tsx` to `app/index.tsx`
2. Update imports if needed
**Verify:** `npm run typecheck` passes
**Commit:** `refactor: move home screen to root level for drawer content`

---

### T7: Move lists.tsx to drawer

**Files:** `app/(tabs)/lists.tsx` → `app/drawer/lists.tsx`
**Action:**
1. Move file from `app/(tabs)/lists.tsx` to `app/drawer/lists.tsx`
2. Update imports if needed
**Verify:** `npm run typecheck` passes
**Commit:** `refactor: move lists screen to drawer`

---

### T8: Move products.tsx to drawer

**Files:** `app/(tabs)/products.tsx` → `app/drawer/products.tsx`
**Action:**
1. Move file from `app/(tabs)/products.tsx` to `app/drawer/products.tsx`
2. Update imports if needed
**Verify:** `npm run typecheck` passes
**Commit:** `refactor: move products screen to drawer`

---

### T9: Delete old tab files

**Files:** `app/(tabs)/_layout.tsx`, `app/(tabs)/profile.tsx`, `app/(tabs)/` directory
**Action:**
1. Delete `app/(tabs)/profile.tsx`
2. Delete `app/(tabs)/_layout.tsx`
3. Remove `app/(tabs)/` directory
**Verify:** `npm run typecheck` passes
**Commit:** `refactor: remove old tab navigation files`

---

### T10: Update existing tests

**Files:** `app/__tests__/`, `app/drawer/__tests__/`
**Action:**
1. Move `HomeScreen.test.tsx` to `app/__tests__/`
2. Move `ListsScreen.test.tsx` to `app/drawer/__tests__/`
3. Move `ProductsScreen.test.tsx` to `app/drawer/__tests__/`
4. Delete `ProfileScreen.test.tsx`
5. Delete `TabLayout.test.tsx`
6. Update mocks for new drawer structure
**Verify:** `npm run test` passes
**Commit:** `test: update tests for drawer navigation structure`

---

### T11: Add new tests

**Files:** `app/__tests__/RootLayout.test.tsx`, `app/drawer/__tests__/DrawerLayout.test.tsx`, `stores/__tests__/useCartStore.test.ts`
**Action:**
1. Add RootLayout test (verify drawer + modals registered)
2. Add DrawerLayout test (verify drawer entries)
3. Add toggleInCart tests to useCartStore
4. Add v3 migration tests to useCartStore
**Verify:** `npm run test` passes
**Commit:** `test: add tests for drawer layout and toggleInCart`

---

### T12: Run full harness validation

**Files:** none (validation only)
**Action:**
1. `npm run lint` → 0 errors
2. `npm run typecheck` → 0 errors
3. `npm run test` → all tests pass
**Verify:** All three commands pass
**Commit:** (none — validation only)
