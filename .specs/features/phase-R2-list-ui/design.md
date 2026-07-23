# Design — Phase R2 List UI

## Architecture

### Component Hierarchy

```
app/index.tsx (MainShoppingList)
├── ListHeader
│   ├── Pressable (hamburger → drawer.openDrawer)
│   ├── Pressable (list name → opens ListSelector modal)
│   └── Pressable (quick-add → router.push /product-picker)
├── LegendList (flat data with section headers + items)
│   ├── SectionHeader ("Encontrados")
│   │   └── CartItemRow (for each !inCart item)
│   ├── SectionHeader ("Carrinho")
│   │   └── CartItemRow (for each inCart item)
│   └── EmptyListState (when no items in cart)
├── ListFooter (fixed, not scrollable)
│   ├── TotalPanel (all items count + total cost)
│   └── CartPanel (picked items count + cart cost)
├── FAB "+" (opens product-picker)
└── ListSelector (Modal with list of carts)
```

### Data Flow

```
useCartStore
  ├── activeCartId → which cart is active
  ├── carts → all carts
  └── actions: setActiveCart, toggleInCart, updateQuantity, addItem

useProductStore
  └── products → lookup for product names/prices

app/index.tsx
  1. Read activeCartId → find active cart
  2. If no active cart → show EmptyListState ("no list selected")
  3. Split cart.items into listed (!inCart) and picked (inCart)
  4. Build flat data array: [sectionHeader, ...listedItems, sectionHeader, ...cartItems]
  5. Render LegendList with flat data
  6. Footer reads cart items to compute totals
```

### File Structure

```
components/
  shopping-list/
    ListHeader.tsx          — header bar
    ListFooter.tsx          — dual panel footer
    CartItemRow.tsx         — individual item row
    SectionHeader.tsx       — section divider
    EmptyListState.tsx      — empty state overlay
    ListSelector.tsx        — modal list picker
    list-utils.ts           — pure functions: splitSections, getCartTotals
app/
  index.tsx                 — main screen (rewrite)
__tests__/
  components/
    shopping-list/
      list-utils.test.ts    — unit tests for pure functions
      CartItemRow.test.tsx  — component test
      ListFooter.test.tsx   — component test
```

### Key Decisions

1. **LegendList flat data** — instead of `sections` prop, use flat array with mixed section headers and items (same pattern as `app/drawer/products.tsx`). This avoids LegendList sections API complexity.

2. **Footer fixed at bottom** — use `View` with `flex: 1` container, LegendList takes `flex: 1` scrollable area, footer sits below with fixed height. No absolute positioning needed.

3. **ListSelector as Modal** — cross-platform, avoids `Alert.prompt` (iOS-only). Contains LegendList of cart names with checkmark on active.

4. **Pure utility functions** — `splitSections` and `getCartTotals` in `list-utils.ts` as exported pure functions (testable independently).

5. **Price color indicator** — green left border when `currentPrice ≤ expectedPrice`, red when over, no border when no price data.

6. **Quantity controls in row** — +/- buttons inline in CartItemRow. Decrement at qty=1 removes item (with confirmation handled by the parent via removeItem).

### Styling Conventions

- Follow existing patterns from `app/cart-detail.tsx` and `app/drawer/products.tsx`
- Use `colors`, `spacing`, `borderRadius`, `fontSize`, `fontWeight` from constants
- Card style: `colors.surface` background, `borderRadius.md`, `spacing.md` padding
- FAB: absolute positioned, `colors.primary` background, shadow/elevation
