# Tasks — Phase R4 Polish

## Task 1: Install @formatjs/intl-pluralrules polyfill

**ID:** R4-T1
**Depends on:** none
**Spec ref:** R4-01

**What:** Install `@formatjs/intl-pluralrules` and add the polyfill import to `i18n/index.ts`.

**Steps:**
1. `npx expo install @formatjs/intl-pluralrules`
2. Add imports to top of `i18n/index.ts`:
   ```ts
   import '@formatjs/intl-pluralrules/polyfill';
   import '@formatjs/intl-pluralrules/locale-data/pt-BR';
   ```

**Gate:** `npm run typecheck` passes

---

## Task 2: Add recycleItems to all LegendLists

**ID:** R4-T2
**Depends on:** none
**Spec ref:** R4-02

**What:** Add `recycleItems` prop to every `<LegendList>` instance that's missing it.

**Files to edit:**
- `app/drawer/lists.tsx` (line 180)
- `app/drawer/products.tsx` (line 166)
- `app/cart-detail.tsx` (line 324)
- `app/product-picker.tsx` (line 174)
- `components/shopping-list/ListSelector.tsx` (line 41)

**Gate:** `npm run typecheck` passes

---

## Task 3: Remove CartSummary type, inline in migration

**ID:** R4-T3
**Depends on:** none
**Spec ref:** R4-03

**What:** Inline the CartSummary type into the migration code in useCartStore.ts, then remove it from types/index.ts.

**Steps:**
1. In `stores/useCartStore.ts`: change the migration cast on line 163 from `as CartSummary[]` to inline: `as Array<{ id: string; name: string; createdAt: string; updatedAt: string }>`
2. Remove `CartSummary` from the import line
3. In `types/index.ts`: remove the `CartSummary` type export (line 24)
4. Verify no other imports of `CartSummary` type remain

**Gate:** `npm run typecheck && npm run test` passes

---

## Task 4: Add JSDoc to Product.barcode

**ID:** R4-T4
**Depends on:** none
**Spec ref:** R4-04

**What:** Add a JSDoc comment explaining barcode is reserved for future barcode scanning.

**Edit:** `types/index.ts` — add JSDoc above `barcode?: string`

**Gate:** `npm run lint && npm run typecheck` passes

---

## Task 5: Remove dead tabs i18n keys

**ID:** R4-T5
**Depends on:** none
**Spec ref:** R4-05

**What:** Remove the `tabs` section from `i18n/locales/pt-BR.json` since it's vestigial from the pre-drawer layout.

**Steps:**
1. Verify no code references `tabs.*` keys (grep confirmed: only test file references `(tabs)` as a route name, not i18n keys)
2. Remove the entire `tabs` key from `pt-BR.json`

**Gate:** `npm run lint && npm run typecheck && npm run test` passes

---

## Task 6: Fix lint errors

**ID:** R4-T6
**Depends on:** none
**Spec ref:** R4-06

**What:** Fix all biome lint/format errors.

**Steps:**
1. Run `npm run format` to auto-fix formatting issues
2. Manually fix the `any` type in `__tests__/modal-rerender.test.tsx` → change to `unknown`
3. Verify `npm run lint` shows 0 errors

**Gate:** `npm run lint` → 0 errors

---

## Task 7: Fix test mock key warnings

**ID:** R4-T7
**Depends on:** none
**Spec ref:** R4-07

**What:** Update LegendList mocks in test files to pass keys to rendered children, eliminating the "unique key" console warnings.

**Files to edit:**
- `app/__tests__/ProductPicker.test.tsx`
- `app/__tests__/CartDetail.test.tsx`
- `app/drawer/__tests__/ListsScreen.test.tsx`
- `app/drawer/__tests__/ProductsScreen.test.tsx`
- `app/__tests__/HomeScreen.test.tsx` (if applicable)

**Approach:** In each mock, use `props.keyExtractor` to generate a key for each rendered child via the `key` prop.

**Gate:** `npm run test` → no "unique key" console warnings; all 167+ tests pass

---

## Task 8: Final harness validation

**ID:** R4-T8
**Depends on:** T1–T7
**Spec ref:** R4-08

**What:** Run full harness: lint + typecheck + tests. Document results.

**Gate:** All three commands pass with 0 errors and all tests green.
