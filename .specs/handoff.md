# Handoff

## Active Phase

**Next:** Phase R1 — Navigation Refactor (Tabs to Drawer + Data Model)

## What Was Completed

| Phase | Status | Date |
|-------|--------|------|
| 1 — Navigation & Context | ✅ | 2026-07-06 |
| 2 — Product Catalog | ✅ | 2026-07-10 |
| 3 — Shopping Lists | ✅ | 2026-07-22 |
| 4 — Pricing & Comparison | ✅ | 2026-07-22 |
| R1 — Navigation Refactor | ⏳ | — |
| R2 — List UI | ⏳ | — |
| R3 — Drawer Screens | ⏳ | — |
| R4 — Polish | ⏳ | — |

## Refinement Context

MVP core complete (4 phases, 116 tests). Now restructuring for better UX:

- Tabs → Drawer navigation (sidebar for Lists + Products)
- Home screen becomes the active shopping list
- New `inCart` field for tracking "picked up" items
- Full CRUD everywhere (products edit/delete, cross-platform list rename)
- Warning fixes (Intl API, LegendList)

## Key Decisions

- **Drawer**: Use `expo-router/drawer` with `@react-navigation/drawer` (SDK 52 compatible)
- **List selector**: Header dropdown/modal (not Alert.prompt) for cross-platform
- **inCart toggle**: Checkbox per item, moves item between "Listed" and "Cart" sections
- **Footer**: Dual panel showing total vs cart counts and costs
- **Product edit**: Reuse product-form.tsx with productId param for edit mode

## What's Next

Start Phase R1 with the loop orchestrator. Read `.specs/roadmap.md` for full phase details.
