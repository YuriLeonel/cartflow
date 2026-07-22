# Shopping Lists — Cart Management Specification

## Problem Statement

The app has products in a catalog but no way to organize them into shopping lists. Users need to create named lists, add products from the catalog, track quantities, and manage items across sessions. This is the core workflow of the app — without it, the product catalog has no practical use.

## Goals

- [ ] Users can create, rename, and delete shopping lists
- [ ] Users can add products from the catalog to a list with a quantity
- [ ] Users can view a list's items, edit quantities, and remove items
- [ ] All cart data persists between sessions via MMKV
- [ ] Home screen provides quick access to create lists and view existing ones

## Out of Scope

| Feature | Reason |
|---------|--------|
| Price comparison (expected vs current) | Phase 4 scope |
| Barcode scanning | Future phase |
| Cloud sync / multi-device | Future phase |
| Shared lists / collaboration | Not in MVP |
| List templates or recurring lists | Not in MVP |
| Undo / redo actions | YAGNI for MVP |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
|----------------------|----------------|-----------|------------|
| Adding same product to a list increments quantity | Yes, merge on duplicate | Avoids confusing duplicate entries; natural shopping behavior | assumed |
| List name is required, max 50 characters | Yes | Matches product name pattern (required, bounded) | assumed |
| Quantity is a positive integer (1–999) | Yes | No fractional items; 999 cap prevents overflow | assumed |
| Active cart context is global (one cart open at a time) | Yes | Existing `activeCartId` pattern; simplifies navigation | assumed |
| Empty lists can be deleted without confirmation | No — confirmation required | Prevents accidental data loss | assumed |
| Items display shows product name + quantity + category | Yes | Standard shopping list UX | assumed |

**Open questions:** none — all resolved or logged above.

---

## User Stories

### P1: Create and Manage Lists ⭐ MVP

**User Story**: As a shopper, I want to create named shopping lists so that I can organize my purchases by store or occasion.

**Why P1**: Without lists, there's no cart to add items to. This is the foundation of the cart workflow.

**Acceptance Criteria**:

1. WHEN the user taps "Nova Lista" on the home screen THEN the system SHALL prompt for a list name and create a new list with the entered name
2. WHEN the user taps "Nova Lista" on the lists tab THEN the system SHALL prompt for a list name and create a new list
3. WHEN the user long-presses a list item THEN the system SHALL show options to rename or delete the list
4. WHEN the user renames a list THEN the system SHALL update the name and the `updatedAt` timestamp
5. WHEN the user deletes a list THEN the system SHALL show a confirmation dialog, then remove the list and all its items
6. WHEN the user taps a list item THEN the system SHALL navigate to the cart detail screen for that list
7. WHEN the lists screen is empty THEN the system SHALL display an empty state message
8. WHEN the lists screen has lists THEN the system SHALL display them sorted by `updatedAt` descending (most recent first)

**Independent Test**: Create 3 lists → see them on Lists screen and Home screen → rename one → delete one → verify 2 remain

---

### P2: Cart Detail — View and Manage Items

**User Story**: As a shopper, I want to see all items in my shopping list with quantities so that I know what to buy.

**Why P2**: Core utility — the user needs to see and manage what's in their list.

**Acceptance Criteria**:

1. WHEN the user opens a cart detail screen THEN the system SHALL display the list name as the screen title
2. WHEN the cart has items THEN the system SHALL display each item with: product name, category, quantity, and expected price (if product has one)
3. WHEN the cart has items THEN the system SHALL display a total item count in the header
4. WHEN the cart has no items THEN the system SHALL display an empty state with a call-to-action to add products
5. WHEN the user taps the add button THEN the system SHALL navigate to the product picker screen
6. WHEN the user swipes left on an item THEN the system SHALL reveal a delete action
7. WHEN the user taps the delete action on an item THEN the system SHALL remove the item from the cart
8. WHEN the user taps an item's quantity THEN the system SHALL allow editing the quantity (inline stepper or input)

**Independent Test**: Open a cart with 3 items → see all details → delete one via swipe → edit quantity on another → verify changes persist

---

### P3: Add Products to Cart

**User Story**: As a shopper, I want to pick products from my catalog and add them to my shopping list with a quantity.

**Why P3**: Without this, lists are manually typed — connecting the catalog to lists is the key integration.

**Acceptance Criteria**:

1. WHEN the user opens the product picker THEN the system SHALL display the product catalog with search
2. WHEN the user selects a product THEN the system SHALL prompt for quantity (default: 1)
3. WHEN the user confirms adding a product that's already in the cart THEN the system SHALL increment the existing item's quantity by the new amount
4. WHEN the user confirms adding a new product THEN the system SHALL add it to the cart with the specified quantity
5. WHEN the product picker is open and the catalog is empty THEN the system SHALL display an empty state

**Independent Test**: Open product picker → search for a product → add it with qty 2 → add same product again with qty 1 → verify qty is now 3 → add a different product with qty 1 → verify 2 items in cart

---

### P4: Wire Home Screen

**User Story**: As a shopper, I want quick access to create a new list and see my recent lists from the home screen.

**Why P4**: The home screen is the entry point — it should surface the core action and recent context.

**Acceptance Criteria**:

1. WHEN the user taps "Nova Lista" on the home screen THEN the system SHALL prompt for a name and create a new list (same as lists tab action)
2. WHEN the home screen loads and lists exist THEN the system SHALL display the 5 most recent lists with name and item count
3. WHEN the home screen loads and no lists exist THEN the system SHALL display the existing empty state message
4. WHEN the user taps a list on the home screen THEN the system SHALL navigate to the cart detail screen

**Independent Test**: Create 2 lists with items → go to home → see both listed with item counts → tap one → arrives at cart detail

---

## Edge Cases

- WHEN the user tries to create a list with an empty name THEN the system SHALL reject the input and show an error
- WHEN the user tries to create a list with a name longer than 50 characters THEN the system SHALL reject the input and show an error
- WHEN the user tries to add a product that no longer exists (deleted from catalog) THEN the system SHALL still display the item in the cart (orphaned reference) but skip it in price calculations
- WHEN the quantity reaches 999 and user tries to increment THEN the system SHALL cap at 999
- WHEN the quantity is 1 and user tries to decrement THEN the system SHALL remove the item from the cart (or show minimum warning)
- WHEN the user deletes a list that is the `activeCart` THEN the system SHALL clear `activeCartId`

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|---------------|-------|-------|--------|
| LIST-01 | P1: Create list | Design | Pending |
| LIST-02 | P1: List name validation | Design | Pending |
| LIST-03 | P1: Rename list | Design | Pending |
| LIST-04 | P1: Delete list with confirmation | Design | Pending |
| LIST-05 | P1: Navigate to cart detail | Design | Pending |
| LIST-06 | P1: Empty state | Design | Pending |
| LIST-07 | P1: Sort by updatedAt | Design | Pending |
| CART-01 | P2: Cart detail screen | Design | Pending |
| CART-02 | P2: Item display (name, category, qty, price) | Design | Pending |
| CART-03 | P2: Item count in header | Design | Pending |
| CART-04 | P2: Empty cart state | Design | Pending |
| CART-05 | P2: Delete item via swipe | Design | Pending |
| CART-06 | P2: Edit quantity | Design | Pending |
| ITEM-01 | P3: Product picker screen | Design | Pending |
| ITEM-02 | P3: Quantity prompt (default 1) | Design | Pending |
| ITEM-03 | P3: Duplicate product merge | Design | Pending |
| ITEM-04 | P3: Add product to cart | Design | Pending |
| HOME-01 | P4: Home — create list action | Design | Pending |
| HOME-02 | P4: Home — recent lists display | Design | Pending |
| HOME-03 | P4: Home — tap list navigates to detail | Design | Pending |

**ID format:** `[CATEGORY]-[NUMBER]` (LIST for list management, CART for cart detail, ITEM for item operations, HOME for home screen)

**Coverage:** 20 total, 0 mapped to tasks, 20 unmapped — pending Design phase

---

## Success Criteria

- [ ] User can create a list, add products, edit quantities, and see accurate totals
- [ ] All cart data persists between app restarts (MMKV)
- [ ] Zero lint errors, zero type errors, all tests pass
- [ ] Navigation flow: Home/Lists → Cart Detail → Add Product → back to Cart Detail works end-to-end
