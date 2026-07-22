# Spec: Phase R1 — Navigation Refactor (Tabs to Drawer + Data Model)

**Status:** draft
**Created:** 2026-07-22
**Complexity:** High
**Estimated scope:** 12 tasks

---

## Goal

Replace the tab navigator with a drawer (sidebar) navigation. The home screen becomes the active shopping list. Add `inCart` field to CartItem for tracking "picked up" items. Structural refactor — no new UI features, just navigation reorganization and data model changes.

## Requirements

### Navigation Architecture

| ID | Requirement | Priority |
|----|-------------|----------|
| NAV-01 | Replace `(tabs)/_layout.tsx` with `drawer/_layout.tsx` using `Drawer` from `expo-router/drawer` | Must |
| NAV-02 | Move `app/(tabs)/index.tsx` to `app/index.tsx` (main shopping list, outside drawer) | Must |
| NAV-03 | Move `app/(tabs)/lists.tsx` to `app/drawer/lists.tsx` (inside drawer) | Must |
| NAV-04 | Move `app/(tabs)/products.tsx` to `app/drawer/products.tsx` (inside drawer) | Must |
| NAV-05 | Delete `app/(tabs)/profile.tsx` and remove profile tab | Must |
| NAV-06 | Delete `app/(tabs)/_layout.tsx` (old tab layout) | Must |
| NAV-07 | Update `app/_layout.tsx` root Stack to include drawer + modals | Must |
| NAV-08 | Install `@react-navigation/drawer` and `@react-navigation/native` (SDK 52 compatible) | Must |

### Data Model

| ID | Requirement | Priority |
|----|-------------|----------|
| DM-01 | Add `inCart: boolean` field to `CartItem` type in `types/index.ts` | Must |
| DM-02 | Add MMKV store migration (v2 → v3) for `inCart` field defaulting to `false` | Must |
| DM-03 | Add `toggleInCart(cartId, productId)` action to `useCartStore` | Must |
| DM-04 | Wire `setActiveCart(cartId)` to list selector (already exists in store) | Must |

### Target File Structure

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

## Acceptance Criteria

```
npm run lint       → 0 errors
npm run typecheck  → 0 errors
npm run test       → all tests pass (existing + new)
Drawer opens       → sidebar shows Lists and Products entries
Main screen        → renders empty list (no items yet)
```

## Technical Notes

- Expo Router `Drawer` layout for SDK 52 requires `@react-navigation/drawer`
- Already have `react-native-reanimated` and `react-native-gesture-handler` (drawer dependencies)
- `CartItem.inCart` defaults to `false` for existing persisted items via MMKV migration
- Modals (`cart-detail`, `product-form`, `product-picker`) stay at root Stack level, outside drawer
- The main screen (`app/index.tsx`) is NOT inside the drawer — it's the drawer's main content
- Existing tests in `app/(tabs)/__tests__/` need updating for new drawer structure

## Dependencies

- Phase 4 (completed) — all MVP features working
- `@react-navigation/drawer` — needs to be installed
- `@react-navigation/native` — needs to be installed
