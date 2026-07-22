# Shopping Lists — Cart Management Tasks

## Execution Protocol (MANDATORY)

Implement these tasks with the `tlc-spec-driven` skill. Do not proceed without it.

---

**Design**: `.specs/features/fase-3-listas/design.md`
**Spec**: `.specs/features/fase-3-listas/spec.md`
**Status**: Draft

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec. Guidelines found: `AGENTS.md` (unit tests mandatory, Jest).

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
|-----------|-------------------|---------------------|------------------|-------------|
| Store (business logic) | unit | All branches; 1:1 to spec ACs; all edge cases | `stores/__tests__/*.test.ts` | `npm run test` |
| Screen (component) | integration | Key user flows per screen: render, interactions, empty states | `app/__tests__/*.test.tsx` | `npm run test` |

## Parallelism Assessment

| Test Type | Parallel-Safe? | Isolation Model | Evidence |
|-----------|---------------|-----------------|----------|
| Unit (store) | Yes | Per-test state reset via `setState()` + mock MMKV | `stores/__tests__/useProductStore.test.ts` |
| Integration (screen) | Yes | Mock stores reset in `beforeEach` | `app/(tabs)/__tests__/ProductsScreen.test.tsx` |

## Gate Check Commands

| Gate Level | When to Use | Command |
|-----------|-------------|---------|
| Quick | After tasks with unit tests only | `npm run test` |
| Full | After tasks with integration tests | `npm run lint && npm run typecheck && npm run test` |

---

## Execution Plan

### Phase 1: Foundation (Sequential)

```
T1 → T2 → T3
```

### Phase 2: Screens (Parallel OK)

```
         ┌→ T4 ─┐
T3 ──┼→ T5 ─┼──→ T8
         └→ T6 ─┘
T7 ──────────→
```

### Phase 3: Integration (Sequential)

```
T8 → T9
```

---

## Task Breakdown

### T1: Expand useCartStore with Full Cart Management

**What**: Replace `CartSummary[]` with `Cart[]`, add `addItem`, `removeItem`, `updateQuantity`, `renameCart`, validation functions, and MMKV migration v1→v2
**Where**: `stores/useCartStore.ts`
**Depends on**: None
**Reuses**: `types/index.ts` (Cart, CartItem, CartSummary), `lib/storage.ts` (zustandMMKVStorage), `stores/useProductStore.ts` (pattern reference)
**Requirement**: LIST-01, LIST-02, LIST-03, LIST-04, ITEM-03, ITEM-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `carts` field stores `Cart[]` (full carts with items)
- [ ] `addItem(cartId, productId, quantity)` adds or increments existing item
- [ ] `removeItem(cartId, productId)` removes item
- [ ] `updateQuantity(cartId, productId, quantity)` sets quantity, removes if ≤0
- [ ] `renameCart(cartId, name)` updates name + updatedAt
- [ ] `validateCartName(name)` returns null or i18n error key
- [ ] `validateQuantity(qty)` returns null or i18n error key
- [ ] MMKV persistence version bumped to 2 with migration from v1
- [ ] No TypeScript errors

**Tests**: unit
**Gate**: quick

**Commit**: `feat(cart-store): expand store with full cart and item management`

---

### T2: Add i18n Keys for Cart/Lists

**What**: Add all translation keys for cart screens, list management, error messages, and empty states
**Where**: `i18n/locales/pt-BR.json`
**Depends on**: None
**Reuses**: Existing `cart.*` keys (extend, don't replace)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `cart.title`, `cart.name`, `cart.namePlaceholder` added
- [ ] `cart.items`, `cart.emptyState`, `cart.addItem`, `cart.noItems` added
- [ ] `cart.confirmDelete`, `cart.confirmDeleteMessage` added
- [ ] `cart.rename` added
- [ ] `item.addTitle`, `item.quantity`, `item.remove`, `item.confirmRemove` added
- [ ] `lists.title`, `lists.emptyState`, `lists.newList`, `lists.itemCount` added
- [ ] `home.recentLists` added
- [ ] `error.cart.name.required`, `error.cart.name.maxLength` added
- [ ] `error.cart.quantity.positive`, `error.cart.quantity.max` added
- [ ] No duplicate keys

**Tests**: none
**Gate**: quick

**Commit**: `feat(i18n): add cart and list management translation keys`

---

### T3: Register New Modal Screens in Root Layout

**What**: Add `cart-detail` and `product-picker` as Stack screens with modal presentation in the root layout
**Where**: `app/_layout.tsx`
**Depends on**: None
**Reuses**: Existing `product-form` screen registration pattern

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `cart-detail` screen registered with `presentation: 'modal'`
- [ ] `product-picker` screen registered with `presentation: 'modal'`
- [ ] Both have `headerShown: false`
- [ ] Existing `(tabs)` and `product-form` screens unchanged
- [ ] No TypeScript errors

**Tests**: none
**Gate**: quick

**Commit**: `feat(nav): register cart-detail and product-picker modal screens`

---

### T4: Create Cart Detail Screen

**What**: Full screen for viewing cart items, managing quantities, deleting items, and navigating to add products
**Where**: `app/cart-detail.tsx`
**Depends on**: T1, T2, T3
**Reuses**: `useCartStore`, `useProductStore`, `@legendapp/list`, `constants/colors.ts`, `constants/layout.ts`, BRL formatting pattern from ProductsScreen
**Requirement**: CART-01, CART-02, CART-03, CART-04, CART-05, CART-06

**Tools**:

- MCP: NONE
- Skill: `react-native-expert`

**Done when**:

- [ ] Reads `cartId` from route params
- [ ] Displays cart name as screen title
- [ ] Shows item count in header
- [ ] Renders items in LegendList with: product name, category, quantity, expected price
- [ ] Empty state with "Adicionar produto" CTA when no items
- [ ] Swipe-to-delete on items with confirmation
- [ ] Quantity +/- stepper on each item
- [ ] FAB button to add products (navigates to product-picker)
- [ ] Follows existing screen styling patterns
- [ ] No TypeScript errors

**Tests**: integration
**Gate**: full

**Commit**: `feat(cart-detail): add cart detail screen with item management`

---

### T5: Create Product Picker Screen

**What**: Screen to browse/search catalog and add a product to a cart with quantity
**Where**: `app/product-picker.tsx`
**Depends on**: T1, T2, T3
**Reuses**: `useCartStore.addItem`, `useProductStore.products`, search + category group pattern from ProductsScreen, LegendList, `constants/colors.ts`, `constants/layout.ts`
**Requirement**: ITEM-01, ITEM-02, ITEM-03, ITEM-04

**Tools**:

- MCP: NONE
- Skill: `react-native-expert`

**Done when**:

- [ ] Reads `cartId` from route params
- [ ] Displays product catalog with search bar
- [ ] Products grouped by category with sticky headers
- [ ] Tap product → shows quantity prompt (default 1)
- [ ] Confirm → calls `useCartStore.addItem(cartId, productId, qty)`
- [ ] If product already in cart → increments quantity
- [ ] Empty state when catalog is empty
- [ ] Back navigation after adding product
- [ ] No TypeScript errors

**Tests**: integration
**Gate**: full

**Commit**: `feat(product-picker): add product picker screen for cart item addition`

---

### T6: Expand Lists Tab Screen

**What**: Replace placeholder with full list management — create, view, rename, delete lists
**Where**: `app/(tabs)/lists.tsx`
**Depends on**: T1, T2
**Reuses**: `useCartStore`, LegendList pattern, i18n common keys, `constants/colors.ts`, `constants/layout.ts`
**Requirement**: LIST-01, LIST-03, LIST-04, LIST-05, LIST-06, LIST-07

**Tools**:

- MCP: NONE
- Skill: `react-native-expert`

**Done when**:

- [ ] Shows "Minhas Listas" title
- [ ] Creates new list via name prompt (FAB button)
- [ ] Renders all lists in LegendList sorted by updatedAt descending
- [ ] Each list shows name + item count
- [ ] Tap list → navigate to cart-detail with cartId
- [ ] Long-press → context menu with Rename / Delete
- [ ] Rename → prompt with current name, save on confirm
- [ ] Delete → confirmation dialog → remove list
- [ ] Empty state when no lists exist
- [ ] No TypeScript errors

**Tests**: integration
**Gate**: full

**Commit**: `feat(lists-tab): implement list management with create, rename, delete`

---

### T7: Wire Home Screen to Cart Store

**What**: Connect "Nova Lista" button and "Minhas Listas" section to real data from useCartStore
**Where**: `app/(tabs)/index.tsx`
**Depends on**: T1, T2
**Reuses**: `useCartStore`, existing HomeScreen layout
**Requirement**: HOME-01, HOME-02, HOME-03

**Tools**:

- MCP: NONE
- Skill: `react-native-expert`

**Done when**:

- [ ] "Nova Lista" button creates a new list (name prompt)
- [ ] "Minhas Listas" section shows up to 5 most recent lists
- [ ] Each list shows name + item count
- [ ] Tap list → navigate to cart-detail
- [ ] Empty state message preserved when no lists
- [ ] No TypeScript errors

**Tests**: integration
**Gate**: full

**Commit**: `feat(home): wire home screen to cart store for list access`

---

### T8: Write Cart Store Unit Tests

**What**: Comprehensive unit tests for the expanded useCartStore — all new methods, edge cases, and persistence
**Where**: `stores/__tests__/useCartStore.test.ts`
**Depends on**: T1
**Reuses**: Test pattern from `stores/__tests__/useProductStore.test.ts`
**Requirement**: LIST-01 through LIST-07, CART-01 through CART-06, ITEM-01 through ITEM-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Tests for `addCart`: valid name, empty name rejection, max length rejection
- [ ] Tests for `removeCart`: removes cart, clears activeCartId if active, leaves other carts
- [ ] Tests for `renameCart`: updates name, rejects empty/long names
- [ ] Tests for `addItem`: adds new item, increments existing item quantity
- [ ] Tests for `removeItem`: removes item from cart
- [ ] Tests for `updateQuantity`: sets quantity, removes if ≤0, caps at 999
- [ ] Tests for `validateCartName`: empty, too long, valid
- [ ] Tests for `validateQuantity`: zero, negative, >999, valid
- [ ] Persistence: writes to MMKV, rehydrates on load
- [ ] Migration: v1 format converts to v2
- [ ] All tests pass
- [ ] No TypeScript errors

**Tests**: unit
**Gate**: full

**Commit**: `test(cart-store): add unit tests for expanded cart store`

---

### T9: Write Screen Integration Tests

**What**: Integration tests for CartDetail, ProductPicker, ListsTab, and HomeScreen
**Where**: `app/__tests__/CartDetail.test.tsx`, `app/__tests__/ProductPicker.test.tsx`, `app/(tabs)/__tests__/ListsScreen.test.tsx` (update), `app/(tabs)/__tests__/HomeScreen.test.tsx` (update)
**Depends on**: T4, T5, T6, T7
**Reuses**: Test pattern from `app/(tabs)/__tests__/ProductsScreen.test.tsx`
**Requirement**: All LIST, CART, ITEM, HOME requirements

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] CartDetail tests: renders items, empty state, delete item, quantity change
- [ ] ProductPicker tests: renders products, search, add to cart, empty state
- [ ] ListsScreen tests: renders lists, create list, empty state, tap navigates
- [ ] HomeScreen tests: recent lists, create list, empty state, tap navigates
- [ ] All tests pass
- [ ] No TypeScript errors

**Tests**: integration
**Gate**: full

**Commit**: `test(screens): add integration tests for cart screens`

---

## Parallel Execution Map

```
Phase 1 (Sequential):
  T1 ──→ T2 ──→ T3

Phase 2 (Parallel):
  T3 complete, then:
    ├── T4 [P]
    ├── T5 [P]  } Can run simultaneously
    ├── T6 [P]
    └── T7 [P]

Phase 3 (Sequential):
  T4, T5, T6, T7 complete, then:
    T8 ──→ T9
```

---

## Task Granularity Check

| Task | Scope | Status |
|------|-------|--------|
| T1: Expand useCartStore | 1 store file | ✅ Granular |
| T2: Add i18n keys | 1 JSON file | ✅ Granular |
| T3: Register modal screens | 1 layout file | ✅ Granular |
| T4: Cart detail screen | 1 screen file | ✅ Granular |
| T5: Product picker screen | 1 screen file | ✅ Granular |
| T6: Lists tab screen | 1 screen file | ✅ Granular |
| T7: Wire home screen | 1 screen file | ✅ Granular |
| T8: Cart store tests | 1 test file | ✅ Granular |
| T9: Screen integration tests | 4 test files | ⚠️ Borderline — but cohesive (all cart screens) |

## Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagram Shows | Status |
|------|-------------------|---------------|--------|
| T1 | None | None | ✅ Match |
| T2 | None | None | ✅ Match |
| T3 | None | None | ✅ Match |
| T4 | T1, T2, T3 | T3 → T4 | ✅ Match |
| T5 | T1, T2, T3 | T3 → T5 | ✅ Match |
| T6 | T1, T2 | T3 → T6 (implicit via T2) | ✅ Match |
| T7 | T1, T2 | T3 → T7 (implicit via T2) | ✅ Match |
| T8 | T1 | T1 → T8 | ✅ Match |
| T9 | T4, T5, T6, T7 | T4/T5/T6/T7 → T9 | ✅ Match |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
|------|---------------------------|-----------------|-----------|--------|
| T1 | Store (business logic) | unit | unit | ✅ OK |
| T2 | Config (i18n JSON) | none | none | ✅ OK |
| T3 | Config (layout) | none | none | ✅ OK |
| T4 | Screen (component) | integration | integration | ✅ OK |
| T5 | Screen (component) | integration | integration | ✅ OK |
| T6 | Screen (component) | integration | integration | ✅ OK |
| T7 | Screen (component) | integration | integration | ✅ OK |
| T8 | Store (test) | unit | unit | ✅ OK |
| T9 | Screen (test) | integration | integration | ✅ OK |
