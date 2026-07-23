# Phase R4 — Polish (Warning Fixes + Final QA)

## Goal

Fix all console warnings, clean up unused code, ensure full test coverage, and run final harness validation across the entire app.

## Requirement IDs

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R4-01 | Install `@formatjs/intl-pluralrules` polyfill | Package installed; i18n/index.ts imports polyfill; no Intl pluralization warnings |
| R4-02 | Fix LegendList warnings — add `recycleItems` to all LegendLists | Every `<LegendList>` component has `recycleItems` prop; no LegendList warnings in console |
| R4-03 | Remove unused `CartSummary` type | Type inlined into migration code in useCartStore.ts; removed from types/index.ts; no import reference remains; migration test still passes |
| R4-04 | Document `Product.barcode` as intentionally kept | JSDoc comment on barcode field explaining it's reserved for future barcode scanning |
| R4-05 | Remove dead `tabs` i18n keys | `tabs` section removed from pt-BR.json; no code references `tabs.*` keys |
| R4-06 | Fix lint errors | `npm run lint` → 0 errors |
| R4-07 | Fix test console warnings | MockLegendList in test files passes keys to children; no "unique key" warnings |
| R4-08 | Full harness validation | `npm run lint && npm run typecheck && npm run test` → all green |

## Non-Goals

- No new features beyond what's listed
- No UI changes — cosmetic only (code cleanup)
- No Performance profiling
- No E2E test suite creation

## Dependencies

- R2 (List UI) — complete
- R3 (Drawer Screens) — complete
