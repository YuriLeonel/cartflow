# Pricing & Comparison Specification

## Problem Statement

Users can see expected prices on products but can't track what they actually paid. Without current price tracking, there's no way to compare expected vs actual spending. This feature closes that loop — register prices as you shop and see the budget difference in real time.

## Goals

- [ ] Users can set a current price on each cart item
- [ ] Users see expected vs current price per item
- [ ] Users see cart-level totals: expected, current, and difference
- [ ] Visual indicators show green (at or under budget) and red (over budget)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Price history across carts | Future phase |
| Price alerts / notifications | Not in MVP |
| Multi-currency | BRL only |
| Receipt scanning | Not in MVP |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
|----------------------|----------------|-----------|------------|
| currentPrice is optional per item | Yes | Items work without prices (Phase 3 behavior preserved) | assumed |
| Cart total only includes items with currentPrice | Yes | Items without currentPrice don't contribute to current total | assumed |
| Visual indicator: green when current ≤ expected, red when current > expected | Yes | Matches roadmap spec | assumed |
| Difference shown as absolute value + percentage | Yes | Per roadmap spec | assumed |

---

## User Stories

### P1: Set Current Price per Item ⭐ MVP

**User Story**: As a shopper, I want to record what I actually paid for each item so that I can compare against my expected budget.

**Acceptance Criteria**:

1. WHEN the user views a cart item THEN the system SHALL display the expected price (if product has one) and the current price (if set)
2. WHEN the user taps the price area on an item THEN the system SHALL show a numeric input to set the current price
3. WHEN the user enters a current price THEN the system SHALL save it to the cart item's `currentPrice` field
4. WHEN an item has both expected and current prices THEN the system SHALL show the difference with a color indicator (green ≤ expected, red > expected)
5. WHEN an item has no current price THEN the system SHALL display only the expected price

**Independent Test**: Set current price on 2 items → see green/red indicators → remove price → indicator disappears

---

### P2: Cart Totals and Budget Summary

**User Story**: As a shopper, I want to see my total expected spending vs total actual spending so that I know if I'm over or under budget.

**Acceptance Criteria**:

1. WHEN the cart has items with expected prices THEN the system SHALL display the expected total (sum of expectedPrice × quantity)
2. WHEN the cart has items with current prices THEN the system SHALL display the current total (sum of currentPrice × quantity)
3. WHEN both totals exist THEN the system SHALL display the difference (current - expected) with color indicator
4. WHEN current total ≤ expected total THEN the system SHALL show the difference in green
5. WHEN current total > expected total THEN the system SHALL show the difference in red
6. WHEN the difference is shown THEN the system SHALL display both absolute value and percentage

**Independent Test**: Add 3 items with expected prices → set current prices → see totals and difference → change a price → totals update

---

## Edge Cases

- WHEN all items lack currentPrice THEN the system SHALL hide the current total and difference
- WHEN expected total is 0 (no expected prices) THEN the system SHALL hide the percentage difference
- WHEN current price is set to 0 THEN the system SHALL treat it as valid (free item)
- WHEN item has currentPrice but no expectedPrice THEN the system SHALL show currentPrice only (no comparison)

---

## Requirement Traceability

| Requirement ID | Story | Status |
|---------------|-------|--------|
| PRICE-01 | P1: Display expected + current price | Pending |
| PRICE-02 | P1: Tap to edit current price | Pending |
| PRICE-03 | P1: Save current price | Pending |
| PRICE-04 | P1: Per-item color indicator | Pending |
| PRICE-05 | P2: Expected total | Pending |
| PRICE-06 | P2: Current total | Pending |
| PRICE-07 | P2: Difference (absolute + percentage) | Pending |
| PRICE-08 | P2: Color indicator on totals | Pending |

---

## Success Criteria

- [ ] User can set prices, see per-item indicators, see cart totals with difference
- [ ] Zero lint errors, zero type errors, all tests pass
- [ ] Visual: green/red indicators clearly distinguish budget status
