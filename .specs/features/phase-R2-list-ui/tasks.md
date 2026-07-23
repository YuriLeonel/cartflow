# Tasks — Phase R2 List UI

## Task 1: Add i18n keys for list UI
**Dependencies:** none
**Gate:** `npm run typecheck`

Add Portuguese translations for:
- `list.header.selectList` — "Selecionar lista"
- `list.header.quickAdd` — "Adicionar rápido"
- `list.sections.listed` — "Encontrados"
- `list.sections.cart` — "Carrinho"
- `list.footer.total` — "Total"
- `list.footer.picked` — "Pego"
- `list.footer.items` — "itens"
- `list.empty.noList` — "Nenhuma lista selecionada. Abra o menu e selecione uma lista."
- `list.empty.noItems` — "Sua lista está vazia. Toque em + para adicionar produtos!"
- `list.selector.title` — "Suas Listas"
- `list.selector.active` — "Selecionada"

## Task 2: Create list-utils.ts (pure functions)
**Dependencies:** none
**Gate:** `npm run typecheck && npm run test`

Create `components/shopping-list/list-utils.ts`:
- `splitSections(items: CartItem[]): { listed: CartItem[], picked: CartItem[] }` — split by inCart
- `getCartTotals(items: CartItem[], products: Product[]): { totalCount, listedCount, cartCount, totalCost, cartCost }` — compute all footer values
- `getDisplayPrice(item: CartItem, product?: Product): string` — resolve price display (currentPrice → expectedPrice → "Sem preço")
- `getPriceColor(item: CartItem, product?: Product): 'green' | 'red' | null` — color indicator

Create `__tests__/components/shopping-list/list-utils.test.ts` with unit tests.

## Task 3: Create SectionHeader component
**Dependencies:** none
**Gate:** `npm run typecheck`

Create `components/shopping-list/SectionHeader.tsx`:
- Props: `title: string`
- Renders bold section title text
- Matches existing category header style from products.tsx

## Task 4: Create CartItemRow component
**Dependencies:** Task 2, Task 3
**Gate:** `npm run typecheck && npm run test`

Create `components/shopping-list/CartItemRow.tsx`:
- Props: `cartId, item: CartItem, onToggle, onIncrement, onDecrement, onRemove`
- Checkbox (Pressable with Ionicons checkbox/checkbox-outline) → calls onToggle
- Product name (from useProductStore lookup)
- Quantity controls: -/qty/+ row
- Price display via getDisplayPrice
- Color indicator via getPriceColor (green/red left border)
- Memoized with React.memo

Create `__tests__/components/shopping-list/CartItemRow.test.tsx`:
- Renders product name
- Calls onToggle when checkbox tapped
- Calls onIncrement/onDecrement
- Shows correct price display

## Task 5: Create EmptyListState component
**Dependencies:** none
**Gate:** `npm run typecheck`

Create `components/shopping-list/EmptyListState.tsx`:
- Props: `message: string, showArrow?: boolean`
- Centered text with optional arrow icon pointing up-right (toward FAB position)

## Task 6: Create ListSelector modal
**Dependencies:** none
**Gate:** `npm run typecheck`

Create `components/shopping-list/ListSelector.tsx`:
- Props: `visible, carts: Cart[], activeCartId, onSelect, onClose`
- Modal with LegendList of cart names
- Checkmark icon on active cart
- Tap calls onSelect → onClose
- Empty state when no carts

## Task 7: Create ListHeader component
**Dependencies:** Task 6
**Gate:** `npm run typecheck`

Create `components/shopping-list/ListHeader.tsx`:
- Props: `cartName, onMenuPress, onSelectList, onQuickAdd`
- Row: hamburger icon | cart name (Pressable → opens selector) | quick-add icon
- Fixed at top, not scrollable

## Task 8: Create ListFooter component
**Dependencies:** Task 2
**Gate:** `npm run typecheck && npm run test`

Create `components/shopping-list/ListFooter.tsx`:
- Props: `totals: CartTotals` (from getCartTotals)
- Two panels side by side: Total | Cart
- Each panel shows count + cost
- Fixed at bottom, not scrollable
- Background: colors.surface

Create `__tests__/components/shopping-list/ListFooter.test.tsx`:
- Renders correct counts and costs
- Handles zero items

## Task 9: Rewrite app/index.tsx (main shopping list screen)
**Dependencies:** Tasks 1-8
**Gate:** `npm run typecheck && npm run test`

Rewrite `app/index.tsx`:
- Read activeCartId from useCartStore
- If no active cart → render EmptyListState with "no list selected" message
- If active cart with no items → render EmptyListState with "empty list" message + FAB
- If active cart with items → render:
  - ListHeader (hamburger opens drawer, list name, quick-add)
  - LegendList with flat data (section headers + CartItemRows)
  - ListFooter (fixed bottom)
  - FAB (absolute bottom-right)
- ListSelector modal (visible state)
- Wire toggleInCart, updateQuantity, removeItem to CartItemRow callbacks
- Wire setActiveCart to ListSelector onSelect

## Task 10: Add integration tests for main screen
**Dependencies:** Task 9
**Gate:** `npm run typecheck && npm run test`

Create `__tests__/app/index.test.tsx`:
- Shows empty state when no active cart
- Shows items split into Listed/Cart sections
- Footer renders with correct totals

## Gate Check (final)
```
npm run lint && npm run typecheck && npm run test
```
