# Phase R3 — Drawer Screens (Lists CRUD + Products CRUD) Specification

## Problem Statement

The drawer screens for lists and products currently lack full CRUD capabilities. Lists cannot be created with user-provided names (FAB just auto-generates), renaming uses iOS-only `Alert.prompt`, and deletion requires confirmation. Products have no create/edit/delete flow from the list screen, and the product form only supports create mode.

## Goals

- Lists: full CRUD with cross-platform TextInput for create and rename
- Products: full CRUD with long-press context menu for edit and delete
- Product form: support both create and edit modes via `productId` query param

## Out of Scope

| Feature | Reason |
|---------|--------|
| List reordering / drag-and-drop | Not requested, YAGNI |
| Product reordering | Not requested, YAGNI |
| Batch operations (multi-select delete) | Not requested, YAGNI |
| List sharing or collaboration | Out of current scope |
| Image upload for products | Out of current scope |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
|----------------------|---------------|-----------|-----------|
| List creation UX | Modal with TextInput (cross-platform) | Alert.prompt is iOS-only; Modal+TextInput works on both | y |
| List rename UX | Same Modal with TextInput, pre-filled with current name | Consistency with creation pattern | y |
| Product edit param passing | `productId` as query param to `/product-form` | Expo Router pattern used in this codebase | y |
| Product delete confirmation | Alert.alert (works cross-platform) | Standard React Native pattern for destructive actions | y |
| Long-press context menu for products | Alert.alert with Edit/Delete options | Consistent with list pattern, no new dependency | y |

**Open questions:** none — all resolved above.

---

## User Stories

### P1: List CRUD with cross-platform inputs ⭐ MVP

**User Story**: As a user, I want to create, rename, and delete shopping lists with a cross-platform input experience.

**Why P1**: Core list management is essential for the app's primary use case.

**Acceptance Criteria**:

1. WHEN user taps the FAB (+) button on the lists screen THEN a modal with a TextInput SHALL appear for entering the list name
2. WHEN user enters a name and taps confirm THEN a new list SHALL be created with that name
3. WHEN user long-presses a list item THEN an action menu SHALL appear with "Rename" and "Delete" options
4. WHEN user selects "Rename" from the context menu THEN a modal with a TextInput SHALL appear pre-filled with the current name
5. WHEN user confirms the rename THEN the list name SHALL be updated
6. WHEN user selects "Delete" from the context menu THEN a confirmation dialog SHALL appear
7. WHEN user confirms deletion THEN the list SHALL be removed
8. WHEN the rename modal opens on Android THEN it SHALL use TextInput (not Alert.prompt) and work correctly

**Independent Test**: Can demo by creating a list, renaming it, then deleting it — all on Android.

---

### P2: Product CRUD from products screen

**User Story**: As a user, I want to edit and delete products from the products catalog screen.

**Why P2**: Product management is needed to maintain the product catalog.

**Acceptance Criteria**:

1. WHEN user long-presses a product in the products list THEN an action menu SHALL appear with "Edit" and "Delete" options
2. WHEN user selects "Edit" THEN the product form SHALL open in edit mode with fields pre-filled
3. WHEN user saves changes in edit mode THEN the product SHALL be updated in the store
4. WHEN user selects "Delete" THEN a confirmation dialog SHALL appear before deleting
5. WHEN user confirms product deletion THEN the product SHALL be removed from the store

**Independent Test**: Can demo by long-pressing a product, editing its name, saving, then long-pressing again and deleting it.

---

### P3: Product form edit mode

**User Story**: As a user, I want the product form to work for both creating and editing products.

**Why P3**: Enables reuse of the existing form for edit flow, avoids duplication.

**Acceptance Criteria**:

1. WHEN `product-form` receives a `productId` query param THEN it SHALL load the existing product and pre-fill fields
2. WHEN in edit mode THEN the title SHALL display "Editar Produto" (or equivalent i18n key)
3. WHEN user saves in edit mode THEN `updateProduct` SHALL be called with the updated data
4. WHEN no `productId` is provided THEN the form SHALL operate in create mode (existing behavior)

**Independent Test**: Can demo by navigating to product-form with a productId and seeing pre-filled data.

---

## Edge Cases

- WHEN user enters empty name for list creation THEN the confirm button SHALL be disabled or show validation error
- WHEN user enters empty name for list rename THEN the save button SHALL be disabled or show validation error
- WHEN user tries to rename a list to a name longer than 50 characters THEN a validation error SHALL be shown
- WHEN the products list is empty and user long-presses THEN nothing happens (no context menu)
- WHEN product form is in edit mode and product doesn't exist (deleted externally) THEN the form SHALL handle gracefully (show create mode or navigate back)

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|---------------|-------|-------|--------|
| LISTS-01 | P1: List creation via modal | Implement | Pending |
| LISTS-02 | P1: Long-press context menu (rename/delete) | Implement | Pending |
| LISTS-03 | P1: Cross-platform list rename modal | Implement | Pending |
| LISTS-04 | P1: List delete with confirmation | Implement | Pending |
| LISTS-05 | P1: Validation for list name | Implement | Pending |
| PRODUCTS-01 | P2: Long-press context menu (edit/delete) | Implement | Pending |
| PRODUCTS-02 | P2: Product delete with confirmation | Implement | Pending |
| PRODUCTS-03 | P3: Product form edit mode (load by id) | Implement | Pending |
| PRODUCTS-04 | P3: Product form edit mode (updateProduct on save) | Implement | Pending |
| PRODUCTS-05 | P3: Edit mode title | Implement | Pending |

**Coverage:** 10 total, 10 mapped to tasks, 0 unmapped

---

## Success Criteria

- [ ] Lists screen: user can create, rename, and delete lists entirely via TextInput modals (no Alert.prompt)
- [ ] Products screen: user can edit and delete products via long-press context menu
- [ ] Product form: supports both create and edit modes
- [ ] All existing tests continue to pass
- [ ] New tests cover all CRUD flows
- [ ] `npm run lint && npm run typecheck && npm run test` passes with 0 errors
