# Pricing & Comparison Tasks

## Execution Protocol

Implement these tasks with the `tlc-spec-driven` skill.

---

**Spec**: `.specs/features/fase-4-precos/spec.md`
**Status**: Draft

---

## Task Breakdown

### T1: Add updateCurrentPrice to CartStore + Tests

**What**: Add `updateCurrentPrice(cartId, productId, price?: number)` method to useCartStore, with validation and persistence. Include unit tests.
**Where**: `stores/useCartStore.ts`, `stores/__tests__/useCartStore.test.ts`
**Depends on**: None
**Requirement**: PRICE-03

**Done when**:

- [ ] `updateCurrentPrice(cartId, productId, price)` sets `currentPrice` on the item
- [ ] `updateCurrentPrice(cartId, productId, undefined)` clears `currentPrice`
- [ ] Negative prices rejected
- [ ] Tests cover: set price, clear price, negative rejection, nonexistent item
- [ ] All existing tests still pass

**Tests**: unit
**Gate**: quick

**Commit**: `feat(cart-store): add updateCurrentPrice method`

---

### T2: Expand CartItemRow with Price Display and Edit

**What**: Update CartItemRow to show expected price, current price, tap-to-edit current price, and per-item color indicator
**Where**: `app/cart-detail.tsx`
**Depends on**: T1
**Requirement**: PRICE-01, PRICE-02, PRICE-04

**Done when**:

- [ ] Shows expected price when product has one
- [ ] Shows current price when set (below expected price)
- [ ] Tap on price area opens numeric input for current price
- [ ] Saving current price calls `updateCurrentPrice`
- [ ] Green indicator when currentPrice ≤ expectedPrice
- [ ] Red indicator when currentPrice > expectedPrice
- [ ] No indicator when currentPrice is not set

**Tests**: integration (update CartDetail.test.tsx)
**Gate**: full

**Commit**: `feat(cart-detail): add price display and edit with visual indicators`

---

### T3: Add Cart Summary Footer with Totals

**What**: Add a summary section at the bottom of cart detail showing expected total, current total, and difference with color indicator
**Where**: `app/cart-detail.tsx`
**Depends on**: T2
**Requirement**: PRICE-05, PRICE-06, PRICE-07, PRICE-08

**Done when**:

- [ ] Shows expected total (sum of expectedPrice × quantity for items with expectedPrice)
- [ ] Shows current total (sum of currentPrice × quantity for items with currentPrice)
- [ ] Shows difference (current - expected) in absolute value and percentage
- [ ] Green indicator when current ≤ expected
- [ ] Red indicator when current > expected
- [ ] Hides current total when no items have currentPrice
- [ ] Hides percentage when expected total is 0

**Tests**: integration (update CartDetail.test.tsx)
**Gate**: full

**Commit**: `feat(cart-detail): add budget summary with totals and difference indicator`

---

### T4: Add i18n Keys for Pricing

**What**: Add translation keys for price labels, totals, and difference display
**Where**: `i18n/locales/pt-BR.json`
**Depends on**: None
**Requirement**: All PRICE requirements

**Done when**:

- [ ] `cart.expectedTotal`, `cart.currentTotal`, `cart.difference` added
- [ ] `cart.overBudget`, `cart.underBudget` added (or similar)
- [ ] `cart.percentage` format key added
- [ ] No duplicate keys

**Tests**: none
**Gate**: quick

**Commit**: `feat(i18n): add pricing and budget comparison translation keys`

---

## Execution Plan

```
T4 ──→ T1 ──→ T2 ──→ T3
```

T4 and T1 have no dependencies on each other but T4 is quick and can go first.
