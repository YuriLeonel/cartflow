# Design — Phase R4 Polish

## 1. i18n Pluralization Polyfill

`@formatjs/intl-pluralrules` provides the `Intl.PluralRules` polyfill needed by i18next for proper pluralization in pt-BR. Without it, React Native may emit warnings about missing Intl APIs.

**Implementation:** Add import at top of `i18n/index.ts`, before i18next init.

```
import '@formatjs/intl-pluralrules/locale-data/pt-BR';
import '@formatjs/intl-pluralrules/polyfill';
```

Install via: `npx expo install @formatjs/intl-pluralrules`

## 2. LegendList recycleItems

`recycleItems` tells LegendList to recycle views for better memory performance. Currently only `app/index.tsx` has it. All other LegendList instances need it added:

| File | estimatedItemSize | recycleItems needed |
|------|-------------------|---------------------|
| `app/index.tsx` | 80 | Already set |
| `app/drawer/lists.tsx` | 72 | Add |
| `app/drawer/products.tsx` | 64 | Add |
| `app/cart-detail.tsx` | 80 | Add |
| `app/product-picker.tsx` | 64 | Add |
| `components/shopping-list/ListSelector.tsx` | 56 | Add |

## 3. CartSummary Type Cleanup

`CartSummary` type in `types/index.ts` is `Omit<Cart, 'items'>`. It's only used in `useCartStore.ts` migration (line 163) for migrating v0/v1 persisted state. The type is vestigial — the migration code can use an inline type instead.

**Decision:** Inline the type into the migration code, remove from `types/index.ts`.

**Migration compatibility:** The migration only runs once on first load for users with v0/v1 data. Inlining the type doesn't change runtime behavior.

Note: There's also a `CartSummary` React component in `cart-detail.tsx` (line 163) — this is a local function component, unrelated to the type. No conflict.

## 4. Product.barcode Documentation

Keep the field in `Product` interface. Add a JSDoc comment explaining it's reserved for future barcode scanning per the roadmap. No code changes needed.

## 5. Dead i18n Keys

The `tabs` section in `pt-BR.json` contains keys from the pre-drawer layout (home, lists, products, profile). These are no longer used by any code — verify with grep, then remove.

## 6. Lint Fix Strategy

Run `npm run format` (biome format --write) to auto-fix formatting issues. Then verify with `npm run lint`. The issues are:
- Import ordering in modal-rerender.test.tsx
- Line length / formatting in product-form.tsx, drawer/lists.tsx, drawer/products.tsx
- `any` type in modal-rerender.test.tsx (use `unknown`)

## 7. Test Mock Key Warnings

The LegendList mock in test files renders children without keys. Fix by using `props.keyExtractor` in the mock to assign keys to rendered items.

Files affected:
- `app/__tests__/ProductPicker.test.tsx`
- `app/__tests__/CartDetail.test.tsx`
- `app/drawer/__tests__/ListsScreen.test.tsx`
- `app/drawer/__tests__/ProductsScreen.test.tsx`
- `app/__tests__/HomeScreen.test.tsx` (if applicable)
