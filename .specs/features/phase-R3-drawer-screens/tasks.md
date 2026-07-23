# Phase R3 — Drawer Screens Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user — do not proceed without it.**

---

**Design**: `.specs/features/phase-R3-drawer-screens/design.md`
**Status**: Approved | In Progress | Done

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec. Guidelines found: `AGENTS.md` (unit tests required via Jest + jest-expo preset).

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
|------------|-------------------|---------------------|-----------------|-------------|
| Screen (list/product CRUD) | unit | All CRUD flows: create, rename, delete with confirmation; 1:1 to spec ACs | `app/**/__tests__/*.test.tsx` | `npm run test` |
| Screen (product form edit) | unit | Edit mode: load product, pre-fill, updateProduct on save; create mode preserved | `app/__tests__/*.test.tsx` | `npm run test` |
| Component (NameInputModal) | unit | Input validation, confirm/cancel, pre-fill behavior | `app/drawer/__tests__/*.test.tsx` | `npm run test` |
| Validation functions | unit | All validation branches | `stores/__tests__/*.test.ts` (existing) | `npm run test` |

## Parallelism Assessment

> Generated from codebase — confirm before Execute.

| Test Type | Parallel-Safe? | Isolation Model | Evidence |
|-----------|---------------|-----------------|----------|
| unit (screen tests) | Yes | Per-test store mock reset in beforeEach | `ListsScreen.test.tsx`, `ProductsScreen.test.tsx` |
| unit (form tests) | Yes | Per-test store mock reset in beforeEach | `CartDetail.test.tsx` pattern |

## Gate Check Commands

> Generated from codebase — confirm before Execute.

| Gate Level | When to Use | Command |
|-----------|-------------|---------|
| Quick | After tasks with unit tests only | `npm run test` |
| Full | After tasks with e2e/integration tests | `npm run lint && npm run typecheck && npm run test` |
| Build | After phase completion or config/entity-only tasks | `npm run lint && npm run typecheck && npm run test` |

---

## Execution Plan

### Phase 1: Foundation (Sequential)

Tasks that must be done first, in order.

```
T1 → T2 → T3
```

### Phase 2: Product Form Edit Mode (Sequential)

```
T4
```

### Phase 3: Tests (Sequential)

```
T5 → T6 → T7
```

---

## Task Breakdown

### T1: Add i18n keys for list CRUD modals and product CRUD actions

**What**: Add new Portuguese translation keys for list creation modal, rename modal, delete confirmation, and product edit/delete context menu.
**Where**: `i18n/locales/pt-BR.json`
**Depends on**: None
**Reuses**: Existing i18n structure

**Done when**:

- [ ] New keys added for list modal titles, placeholders, errors
- [ ] New keys added for product edit/delete actions
- [ ] No TypeScript errors
- [ ] Gate check passes: `npm run typecheck`

**Tests**: none
**Gate**: quick

---

### T2: Upgrade lists.tsx — Cross-platform list creation with NameInputModal

**What**: Replace the FAB's `handleCreateFallback` with a modal-based flow: tapping FAB opens a modal with TextInput for entering list name. Modal has confirm/cancel buttons, validates non-empty name, calls addCart on confirm.
**Where**: `app/drawer/lists.tsx`
**Depends on**: T1
**Reuses**: `useCartStore.addCart`, design tokens, existing FAB pattern

**Done when**:

- [ ] Tapping FAB opens a modal with TextInput (not Alert.prompt)
- [ ] Modal shows title "Nova Lista" (from i18n)
- [ ] TextInput is auto-focused when modal opens
- [ ] Confirm button calls addCart with entered name
- [ ] Cancel button closes modal without creating
- [ ] Empty name is rejected (confirm disabled or validation shown)
- [ ] Works on Android (no Alert.prompt used)
- [ ] Gate check passes: `npm run typecheck`

**Tests**: unit
**Gate**: quick

---

### T3: Upgrade lists.tsx — Long-press context menu with rename/delete

**What**: Replace the long-press Alert.prompt for rename with a modal-based TextInput flow, and add delete with confirmation dialog. Long-press shows an action sheet with Rename and Delete options. Rename opens the same NameInputModal pre-filled with current name. Delete shows Alert.alert confirmation.
**Where**: `app/drawer/lists.tsx`
**Depends on**: T2
**Reuses**: NameInputModal from T2, `useCartStore.renameCart`, `useCartStore.removeCart`

**Done when**:

- [ ] Long-press on a list shows context menu with "Renomear" and "Excluir" options
- [ ] Selecting "Renomear" opens modal pre-filled with current name
- [ ] Confirming rename calls renameCart with new name
- [ ] Empty name or same name is rejected
- [ ] Selecting "Excluir" shows confirmation Alert.alert
- [ ] Confirming delete calls removeCart
- [ ] Canceling either action does nothing
- [ ] No Alert.prompt used (cross-platform)
- [ ] Gate check passes: `npm run typecheck`

**Tests**: unit
**Gate**: quick

---

### T4: Upgrade product-form.tsx — Edit mode via productId query param

**What**: Add edit mode to the product form. When `productId` is in the route params, load the existing product data and pre-fill the form. On save, call `updateProduct` instead of `addProduct`. Change title to "Editar Produto" in edit mode.
**Where**: `app/product-form.tsx`
**Depends on**: None
**Reuses**: `useProductStore.updateProduct`, `useProductStore.products`, existing form layout

**Done when**:

- [ ] Form reads `productId` from `useLocalSearchParams()`
- [ ] When productId present, loads existing product and pre-fills name, category, expectedPrice
- [ ] Title shows "Editar Produto" in edit mode, "Novo Produto" in create mode
- [ ] Save button calls `updateProduct(productId, updates)` in edit mode
- [ ] Save button calls `addProduct(...)` in create mode (existing behavior preserved)
- [ ] Back/cancel behavior unchanged
- [ ] Gate check passes: `npm run typecheck`

**Tests**: unit
**Gate**: quick

---

### T5: Write unit tests for lists CRUD flows

**What**: Write tests covering list creation modal, rename modal, delete confirmation, and validation. Tests derived from spec ACs LISTS-01 through LISTS-05.
**Where**: `app/drawer/__tests__/ListsScreen.test.tsx` (update existing)
**Depends on**: T3
**Reuses**: Existing test patterns and mocks

**Done when**:

- [ ] Tests cover: FAB opens create modal, confirm creates list
- [ ] Tests cover: long-press opens context menu, rename flow, delete flow
- [ ] Tests cover: empty name validation
- [ ] Tests cover: delete confirmation dialog
- [ ] Gate check passes: `npm run test`

**Tests**: unit
**Gate**: quick

---

### T6: Write unit tests for products edit/delete and product form edit mode

**What**: Write tests for products screen context menu (edit/delete) and product form edit mode. Tests derived from spec ACs PRODUCTS-01 through PRODUCTS-05.
**Where**: `app/drawer/__tests__/ProductsScreen.test.tsx` (update), `app/__tests__/ProductForm.test.tsx` (new)
**Depends on**: T4
**Reuses**: Existing test patterns and mocks

**Done when**:

- [ ] Products screen tests: long-press shows edit/delete options
- [ ] Products screen tests: edit navigates with productId param
- [ ] Products screen tests: delete shows confirmation
- [ ] Product form tests: edit mode loads product data
- [ ] Product form tests: edit mode shows "Editar Produto" title
- [ ] Product form tests: save in edit mode calls updateProduct
- [ ] Product form tests: create mode preserved (existing behavior)
- [ ] Gate check passes: `npm run test`

**Tests**: unit
**Gate**: quick

---

### T7: Full build gate — lint + typecheck + all tests

**What**: Run the full build gate to verify everything works together. Fix any issues found.
**Where**: All files
**Depends on**: T5, T6
**Reuses**: All previous tasks

**Done when**:

- [ ] `npm run lint` → 0 errors
- [ ] `npm run typecheck` → 0 errors
- [ ] `npm run test` → all tests pass
- [ ] Gate check passes: `npm run lint && npm run typecheck && npm run test`

**Tests**: none (validation gate)
**Gate**: build

---

## Parallel Execution Map

```
Phase 1 (Sequential):
  T1 → T2 → T3

Phase 2 (Sequential):
  T4

Phase 3 (Sequential):
  T5 → T6 → T7
```

## Task Granularity Check

| Task | Scope | Status |
|------|-------|--------|
| T1: Add i18n keys | 1 file | ✅ Granular |
| T2: Lists create modal | 1 file (modify) | ✅ Granular |
| T3: Lists context menu | 1 file (modify) | ✅ Granular |
| T4: Product form edit | 1 file (modify) | ✅ Granular |
| T5: Lists tests | 1 file (update) | ✅ Granular |
| T6: Products/form tests | 2 files (update/new) | ✅ Granular |
| T7: Full build gate | validation only | ✅ Granular |

## Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagram Shows | Status |
|------|-------------------|---------------|--------|
| T1 | None | Phase 1 start | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T2 | T2 → T3 | ✅ Match |
| T4 | None | Phase 2 start | ✅ Match |
| T5 | T3 | T3 → T5 | ✅ Match |
| T6 | T4 | T4 → T6 | ✅ Match |
| T7 | T5, T6 | T5, T6 → T7 | ✅ Match |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
|------|---------------------------|-----------------|-----------|--------|
| T2 | Screen (list CRUD) | unit | unit | ✅ OK |
| T3 | Screen (list CRUD) | unit | unit | ✅ OK |
| T4 | Screen (product form) | unit | unit | ✅ OK |
| T5 | Screen (list tests) | unit | unit | ✅ OK |
| T6 | Screen (product/form tests) | unit | unit | ✅ OK |
