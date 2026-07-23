# Roadmap — Cartflow MVP

_Autonomous execution plan for the Cartflow shopping list app._
_This file is managed by the Loop Orchestrator. Do not edit status fields manually._

---

## Phase Overview

| # | Phase | Status | Depends On | Started | Completed |
|---|-------|--------|------------|---------|-----------|
| 1 | Foundation — Navigation & Context | completed | — | 2026-07-06 | 2026-07-06 |
| 2 | Product Catalog — Search, Categories, CRUD | completed | Phase 1 | 2026-07-08 | 2026-07-10 |
| 3 | Shopping Lists — Cart Management | completed | Phase 1, 2 | 2026-07-22 | 2026-07-22 |
| 4 | Pricing & Comparison — Expected vs Current | completed | Phase 3 | 2026-07-22 | 2026-07-22 |
| R1 | Navigation Refactor — Tabs to Drawer + Data Model | completed | Phase 4 | 2026-07-22 | 2026-07-22 |
| R2 | List UI — Header, Footer, Item Rows, Sections | completed | R1 | 2026-07-22 | 2026-07-22 |
| R3 | Drawer Screens — Lists CRUD + Products CRUD | completed | R1 | 2026-07-22 | 2026-07-22 |
| R4 | Polish — Warning Fixes + Final QA | completed | R2, R3 | 2026-07-22 | 2026-07-22 |

---

## Phase 1: Foundation — Navigation & Context

**Status:** `completed`
**Complexity:** Medium
**Estimated scope:** <10 tasks

### Goal

Establish the project foundation with Expo Router navigation, theming, i18n, and a working development environment.

### Deliverables

- [x] Expo Router file-based navigation with Bottom Tabs (Home, Listas, Produtos, Perfil)
- [x] Home screen with quick access to main actions
- [x] Placeholder screens for Lists, Products, and Profile
- [x] i18n setup with `i18next` + `react-i18next` + `expo-localization` — Portuguese (pt-BR)
- [x] All screens render without errors on Android + iOS

### Acceptance Criteria

```
npm run lint       → 0 errors
npm run typecheck  → 0 errors
npm run test       → all tests pass
npx expo start     → app launches with 4 navigable tabs
```

### Notes

- React 18.3.1 (not 19) — SDK 52 requirement
- Use `npx expo install` for all packages to auto-match SDK versions
- Portuguese only — no English locale file needed

---

## Phase 2: Product Catalog — Search, Categories, CRUD

**Status:** `completed`
**Complexity:** Large
**Estimated scope:** 10-15 tasks
**Depends on:** Phase 1

### Goal

Allow the user to browse, search, and register products with categories and expected prices.

### Deliverables

- [x] ProductStore — Zustand + MMKV for products (CRUD)
- [x] Product list screen with categories using `@legendapp/list`
- [x] Real-time search filtering by product name
- [x] Manual product registration form (name, category, expected price)
- [x] Seed data for development/testing (16 products)
- [x] Unit tests for store logic and components (12 tests)

### Acceptance Criteria

```
npm run lint       → 0 errors
npm run typecheck  → 0 errors
npm run test       → all tests pass
npx expo start     → can list, search, filter, and add products
```

### Notes

- `@legendapp/list` — not FlatList or FlashList
- Category is optional with fallback "Sem categoria"
- Products persist between sessions via MMKV
- Reference SoftList (`br.com.ridsoftware.shoppinglist`) for UX patterns

---

## Phase 3: Shopping Lists — Cart Management

**Status:** `completed`
**Complexity:** Large
**Estimated scope:** 10-15 tasks
**Depends on:** Phase 1, 2

### Goal

Core of the app — create shopping lists, add products from the catalog, manage quantities, and persist data between sessions.

### Deliverables

- [x] CartStore — CRUD for carts and items (productId, quantity)
- [x] Lists screen — create, rename, delete shopping lists
- [x] Cart detail screen — view items, totals, add/remove products
- [x] Add item screen — select product from catalog, set quantity
- [x] MMKV persistence for carts
- [x] Unit tests for store logic and key flows
- [x] All harness sensors pass

### Acceptance Criteria

```
npm run lint       → 0 errors
npm run typecheck  → 0 errors
npm run test       → all tests pass
npx expo start     → can create list, add products, edit quantities
```

### Notes

- Reference existing `types/index.ts` — `Cart`, `CartItem`, `CartSummary` already defined
- Reference `stores/useCartStore.ts` and `stores/useProductStore.ts` for patterns
- `@legendapp/list` for list rendering
- Items link to products by `productId` — no duplicate product data

---

## Phase 4: Pricing & Comparison — Expected vs Current

**Status:** `completed`
**Complexity:** Medium
**Estimated scope:** <10 tasks
**Depends on:** Phase 3

### Goal

Allow users to register current prices and compare against expected prices, with visual budget indicators.

### Deliverables

- [x] Price input on cart item detail (currentPrice field)
- [x] Expected vs current price display per item
- [x] Cart totals — expected total, current total, difference
- [x] Visual indicators — green (atual ≤ esperado), red (atual > esperado)
- [x] Difference in absolute value and percentage
- [x] Unit tests for price calculations
- [x] All harness sensors pass

### Acceptance Criteria

```
npm run lint       → 0 errors
npm run typecheck  → 0 errors
npm run test       → all tests pass
Manual QA          → can set prices, see totals, see color indicators
```

### Notes

- `currentPrice` is optional on `CartItem` — items work without prices
- Prices stored as integer cents (avoid floating-point)
- Visual indicators use theme colors (green/red)

---

## Phase R1: Navigation Refactor — Tabs to Drawer + Data Model

**Status:** `pending`
**Complexity:** High
**Estimated scope:** <12 tasks
**Depends on:** Phase 4

### Goal

Replace the tab navigator with a drawer (sidebar) navigation. The home screen becomes the active shopping list. Add `inCart` field to CartItem for tracking "picked up" items. This is a structural refactor — no new UI features, just navigation reorganization and data model changes.

### Architecture Change

**Current:** 4-tab layout (Home, Lists, Products, Profile)
**New:** Drawer layout with main content area + sidebar

```
Current:                          New:
┌─────────────────────┐          ┌─────────────────────────┐
│ [Home][Lists][Prod]  │          │ ☰ List Header    [menu] │
│                     │          ├─────────────────────────┤
│   Tab Content       │    →     │                         │
│                     │          │   Active Shopping List   │
│                     │          │                         │
│─────────────────────│          ├─────────────────────────┤
│ [Profile]           │          │ Total: X items  R$ Y.YY  │
└─────────────────────┘          │ Cart:  X items  R$ Y.YY  │
                                 └─────────────────────────┘
                                 Drawer (sidebar):
                                 ├── Lists management
                                 └── Products catalog
```

### Deliverables

- [ ] Replace `(tabs)/_layout.tsx` with `drawer/_layout.tsx` using `Drawer` from `expo-router/drawer`
- [ ] Move `app/(tabs)/index.tsx` → `app/index.tsx` (main shopping list, outside drawer)
- [ ] Move `app/(tabs)/lists.tsx` → `app/drawer/lists.tsx` (inside drawer)
- [ ] Move `app/(tabs)/products.tsx` → `app/drawer/products.tsx` (inside drawer)
- [ ] Delete `app/(tabs)/profile.tsx` and remove profile tab
- [ ] Delete `app/(tabs)/_layout.tsx` (old tab layout)
- [ ] Update `app/_layout.tsx` root Stack to include drawer + modals
- [ ] Add `inCart: boolean` field to `CartItem` type in `types/index.ts`
- [ ] Add MMKV store migration (v2 → v3) for `inCart` field defaulting to `false`
- [ ] Add `toggleInCart(cartId, productId)` action to `useCartStore`
- [ ] Wire `setActiveCart(cartId)` to list selector (already exists in store)
- [ ] Install `@react-navigation/drawer` and `@react-navigation/native` (required for SDK 52 drawer)

### Acceptance Criteria

```
npm run lint       → 0 errors
npm run typecheck  → 0 errors
npm run test       → all tests pass (existing + new)
Drawer opens       → sidebar shows Lists and Products entries
Main screen        → renders empty list (no items yet)
```

### Technical Notes

- Expo Router `Drawer` layout for SDK 52 requires `@react-navigation/drawer` (not bundled yet)
- Already have `react-native-reanimated` and `react-native-gesture-handler` (drawer dependencies)
- `CartItem.inCart` defaults to `false` for existing persisted items via MMKV migration
- Modals (`cart-detail`, `product-form`, `product-picker`) stay at root Stack level, outside drawer
- The main screen (`app/index.tsx`) is NOT inside the drawer — it's the drawer's main content

### File Structure After R1

```
app/
├── _layout.tsx              ← Root Stack (Drawer + modals)
├── index.tsx                ← Main shopping list (drawer content area)
├── drawer/
│   ├── _layout.tsx          ← Drawer layout
│   ├── lists.tsx            ← Lists management
│   └── products.tsx         ← Products catalog
├── cart-detail.tsx          ← Modal
├── product-form.tsx         ← Modal
└── product-picker.tsx       ← Modal
```

---

## Phase R2: List UI — Header, Footer, Item Rows, Sections

**Status:** `completed`
**Complexity:** High
**Estimated scope:** <15 tasks
**Depends on:** R1

### Goal

Build the complete active shopping list UI. The main screen shows the current list with a header (list selector, quick add), categorized item rows with checkboxes, "Listed" and "Cart" sections, and a dual-panel footer with totals.

### Design Reference

The UI follows a shopping list app pattern:
- **Header:** Hamburger icon (opens drawer), current list name with dropdown selector, quick-add icon
- **Body:** Items organized into two sections — "Listed" (items to find) and "Cart" (items picked up)
- **Item row:** Checkbox (toggles inCart), product name, quantity controls, price, color indicator
- **Footer:** Two panels — Total (all items count + cost) and Cart (picked items count + cost)
- **Empty state:** Instructional text + arrow pointing to add button
- **FAB:** "+" to open product picker modal

### Deliverables

- [ ] Create `ListHeader` component — hamburger icon, list name selector dropdown, quick-add icon
- [ ] Create `ListFooter` component — dual panel: total items/cost + cart items/cost
- [ ] Create `CartItemRow` component — checkbox, name, quantity +/-, price, color indicator
- [ ] Create `SectionHeader` component — "Listed" / "Cart" section dividers
- [ ] Create `EmptyListState` component — instructional overlay with arrow
- [ ] Create `ListSelector` component — dropdown/modal to switch between lists
- [ ] Implement `app/index.tsx` — main shopping list screen using LegendList with sections
- [ ] Wire `toggleInCart` to checkbox — tapping moves item between sections
- [ ] Wire list selector to `setActiveCart` — switching lists refreshes the view
- [ ] Compute and display totals in footer (listed total, cart total, both counts)
- [ ] Handle empty state — no lists created yet, empty list, etc.
- [ ] Handle list creation from header (quick-add or dropdown)
- [ ] Handle list deletion from selector
- [ ] Add unit tests for toggleInCart, getCartTotals, section splitting logic
- [ ] Add integration tests for ListHeader, ListFooter, CartItemRow

### Acceptance Criteria

```
npm run lint       → 0 errors
npm run typecheck  → 0 errors
npm run test       → all tests pass
Main screen        → shows empty state when no list selected
List with items    → items split into Listed/Cart sections
Checkbox tap       → item moves between sections
Footer             → updates dynamically with correct totals
Header             → can switch between lists
```

### Technical Notes

- Use `LegendList` from `@legendapp/list` with `recycleItems={true}` and `estimatedItemSize={80}`
- Sections implemented via `LegendList` section headers (or custom section grouping)
- Footer is fixed at bottom (not scrollable) — use `FlexView` or absolute positioning
- List selector can be a `Modal` with a flat list of carts (cross-platform, avoids Alert.prompt)
- Quantity controls: +/- buttons with current value display
- Color indicator: green left border (currentPrice ≤ expectedPrice), red if over
- Price display: show `currentPrice` if set, else `expectedPrice` from product, else "Sem preço"

### Component Hierarchy

```
app/index.tsx
├── ListHeader
│   ├── HamburgerButton (opens drawer)
│   ├── ListSelector (dropdown/modal)
│   └── QuickAddButton (opens product-picker)
├── LegendList (sections)
│   ├── SectionHeader ("Listed")
│   │   └── CartItemRow (for each !inCart item)
│   ├── SectionHeader ("Cart")
│   │   └── CartItemRow (for each inCart item)
│   └── EmptyListState (when no items)
├── ListFooter
│   ├── TotalPanel (items count + cost)
│   └── CartPanel (picked items count + cost)
└── FAB (opens product-picker)
```

---

## Phase R3: Drawer Screens — Lists CRUD + Products CRUD

**Status:** `pending`
**Complexity:** Medium
**Estimated scope:** <10 tasks
**Depends on:** R1

### Goal

Implement the sidebar drawer screens with full CRUD for both lists and products. Lists can be created, renamed (cross-platform), and deleted. Products can be created, edited, and deleted. The product form supports both create and edit modes.

### Deliverables

- [ ] Implement `app/drawer/lists.tsx` — list management screen with full CRUD
- [ ] Cross-platform list creation — inline TextInput (not Alert.prompt)
- [ ] Cross-platform list rename — inline TextInput in edit mode
- [ ] List delete with confirmation dialog
- [ ] Long-press context menu for list actions (rename, delete)
- [ ] Implement `app/drawer/products.tsx` — product catalog with full CRUD
- [ ] Product delete with confirmation (long-press → delete)
- [ ] Product edit — long-press → navigate to product-form with productId param
- [ ] Update `app/product-form.tsx` — support edit mode (pre-fill fields, call updateProduct)
- [ ] Add unit tests for new CRUD flows
- [ ] Add integration tests for drawer screens

### Acceptance Criteria

```
npm run lint       → 0 errors
npm run typecheck  → 0 errors
npm run test       → all tests pass
Lists screen       → can create, rename, delete lists
Products screen    → can create, edit, delete products
Rename lists       → works on Android (no Alert.prompt)
Product edit       → opens form with pre-filled data
```

### Technical Notes

- List rename: use a `Modal` with `TextInput` (consistent with list creation)
- Product edit: `product-form.tsx` receives `productId` query param, loads existing product data
- When `productId` is present → edit mode (updateProduct on save), else → create mode (addProduct)
- Product delete: confirmation alert before calling `removeProduct`
- Both screens use `LegendList` with search bar (existing pattern from products.tsx)

---

## Phase R4: Polish — Warning Fixes + Final QA

**Status:** `completed`
**Complexity:** Low
**Estimated scope:** <8 tasks
**Depends on:** R2, R3

### Goal

Fix all console warnings, clean up unused code, ensure full test coverage, and run final harness validation across the entire app.

### Deliverables

- [x] Install and configure `@formatjs/intl-pluralrules` polyfill for i18n
- [x] Fix LegendList warnings — add `recycleItems={true}` and tune `estimatedItemSize` across all screens
- [x] Remove unused `CartSummary` type (vestigial from migration)
- [x] Remove unused `Product.barcode` field (or keep if future scanning planned — document decision)
- [x] Remove unused `handleCreate` function in old lists.tsx (iOS-only Alert.prompt path)
- [x] Clean up any dead code from the tabs → drawer migration
- [x] Run full harness: lint + typecheck + tests
- [x] Final manual QA checklist — all screens, all flows, both platforms

### Acceptance Criteria

```
npm run lint       → 0 errors
npm run typecheck  → 0 errors
npm run test       → all tests pass
Console            → no red/yellow warnings
All screens        → functional, no crashes
All CRUD           → works on Android and iOS
```

### Technical Notes

- `@formatjs/intl-pluralrules` — add to `i18n/index.ts` initialization
- LegendList `estimatedItemSize` — measure actual row height, set to ~80 for cart items, ~48 for product rows
- `CartSummary` type — only used in MMKV migration, can be inlined or kept for migration compatibility
- `Product.barcode` — keep in type definition for future barcode scanning feature, just document it's unused

---

## Guardrails

| # | Guardrail | Rule |
|---|-----------|------|
| 1 | **Branch strategy** | Git Flow: `develop` for daily work, `feature/*` per phase, `main` for production |
| 2 | **Commit convention** | Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:` |
| 3 | **Testing minimum** | Every phase must have unit tests. E2E only when explicitly requested. |
| 4 | **Definition of done** | All deliverables checked + all harness sensors green + tests pass + spec committed |
| 5 | **Portuguese only** | All user-facing strings in pt-BR. Code (vars, comments, files) stays English. |
| 6 | **YAGNI** | Build only what the current phase requires. No speculative abstractions. |
| 7 | **Atomic commits** | One logical change per commit. Never mix feature code with unrelated refactors. |

---

## Status Legend

| Status | Meaning |
|--------|---------|
| `pending` | Not started — waiting for dependencies or turn in queue |
| `in_progress` | Currently being executed by the orchestrator |
| `completed` | All deliverables implemented and harness passed |
| `failed` | Harness failed after 3 attempts — needs human intervention |
| `blocked` | Cannot proceed — missing dependency or unresolved decision |
| `skipped` | Intentionally skipped (with reason documented) |

---

_Roadmap created: 2026-07-22_
_Last updated by loop cycle: 2026-07-22_
_Total cycles completed: 2_
_Refinement phases added: 2026-07-22 (R1-R4)_
