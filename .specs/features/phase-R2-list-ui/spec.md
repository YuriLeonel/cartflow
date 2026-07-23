# Phase R2 — List UI (Header, Footer, Item Rows, Sections)

## Requirement IDs

| ID | Requirement | Priority |
|----|-------------|----------|
| R2-01 | Main screen shows active shopping list with LegendList sections | P0 |
| R2-02 | Header: hamburger icon opens drawer, list name selector, quick-add icon | P0 |
| R2-03 | Body: items split into "Listed" (inCart=false) and "Cart" (inCart=true) sections | P0 |
| R2-04 | CartItemRow: checkbox, product name, quantity +/-, price, color indicator | P0 |
| R2-05 | Footer: dual panel — Total (all items count + cost) + Cart (picked items count + cost) | P0 |
| R2-06 | EmptyListState: instructional text + arrow when no items or no list selected | P0 |
| R2-07 | ListSelector: modal to switch between lists via setActiveCart | P0 |
| R2-08 | FAB "+" opens product-picker modal for active cart | P0 |
| R2-09 | Checkbox tap calls toggleInCart, item moves between sections | P0 |
| R2-10 | Footer totals update dynamically | P0 |
| R2-11 | Quantity controls: +/- buttons, decrement removes at qty=1 | P1 |
| R2-12 | Price display: currentPrice if set, else expectedPrice, else "Sem preço" | P1 |
| R2-13 | Color indicator: green left border (price ≤ expected), red if over | P1 |
| R2-14 | Unit tests for toggleInCart, getCartTotals, section splitting | P0 |
| R2-15 | Integration tests for components | P1 |

## Acceptance Criteria

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

## Out of Scope

- List CRUD (create/rename/delete) — Phase R3
- Product CRUD — Phase R3
- Price editing inline — existing in cart-detail.tsx, not in scope for list rows
- Search/filter within list
