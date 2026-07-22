# Roadmap — Cartflow MVP

_Autonomous execution plan for the Cartflow shopping list app._
_This file is managed by the Loop Orchestrator. Do not edit status fields manually._

---

## Phase Overview

| # | Phase | Status | Depends On | Started | Completed |
|---|-------|--------|------------|---------|-----------|
| 1 | Foundation — Navigation & Context | completed | — | 2026-07-06 | 2026-07-06 |
| 2 | Product Catalog — Search, Categories, CRUD | completed | Phase 1 | 2026-07-08 | 2026-07-10 |
| 3 | Shopping Lists — Cart Management | pending | Phase 1, 2 | — | — |
| 4 | Pricing & Comparison — Expected vs Current | pending | Phase 3 | — | — |

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

**Status:** `pending`
**Complexity:** Large
**Estimated scope:** 10-15 tasks
**Depends on:** Phase 1, 2

### Goal

Core of the app — create shopping lists, add products from the catalog, manage quantities, and persist data between sessions.

### Deliverables

- [ ] CartStore — CRUD for carts and items (productId, quantity)
- [ ] Lists screen — create, rename, delete shopping lists
- [ ] Cart detail screen — view items, totals, add/remove products
- [ ] Add item screen — select product from catalog, set quantity
- [ ] MMKV persistence for carts
- [ ] Unit tests for store logic and key flows
- [ ] All harness sensors pass

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

**Status:** `pending`
**Complexity:** Medium
**Estimated scope:** <10 tasks
**Depends on:** Phase 3

### Goal

Allow users to register current prices and compare against expected prices, with visual budget indicators.

### Deliverables

- [ ] Price input on cart item detail (currentPrice field)
- [ ] Expected vs current price display per item
- [ ] Cart totals — expected total, current total, difference
- [ ] Visual indicators — green (atual ≤ esperado), red (atual > esperado)
- [ ] Difference in absolute value and percentage
- [ ] Unit tests for price calculations
- [ ] All harness sensors pass

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
_Last updated by loop cycle: —_
_Total cycles completed: 0_
