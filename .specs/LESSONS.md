# LESSONS — auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Specify/Design)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation — do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 — TabLayout tests must mock Tabs to capture screen names, not render as null; otherwise tab count/name changes go undetected
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `app/(tabs)/__tests__/TabLayout.test.tsx` · harmful: 0
- features: fase-1-navegacao
- evidence: app/(tabs)/_layout.tsx:27-30 (Mutation 1) (app/(tabs)/__tests__/TabLayout.test.tsx)
- last seen: 2026-07-06T23:37:41Z

### L-002 — Tab navigator ACs (tab count, tap navigation, active highlight, state preservation) need explicit test assertions — smoke tests on mocked Tabs are insufficient
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `app/(tabs)/__tests__/` · harmful: 0
- features: fase-1-navegacao
- evidence: NAV-01, NAV-02, NAV-03, NAV-04 (app/(tabs)/__tests__/)
- last seen: 2026-07-06T23:37:42Z

### L-003 — When testing Expo Router tab layouts, mock Tabs.Screen to capture screen names and titles rather than mocking Tabs as a no-op. A 'renders without crashing' smoke test cannot detect missing or misconfigured tabs — always assert the expected count, names, and i18n titles.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `navigation testing` · harmful: 0
- features: fase-1-navegacao
- evidence: validation.md: Discrimination Sensor Mutation 1 (navigation testing)
- last seen: 2026-07-06T23:44:08Z

### L-004 — Mock @expo/vector-icons in screen tests — components using Ionicons crash in Jest without it
- signal: `test_failure` · recurrence: 2 feature(s) · scope: `screen tests` · harmful: 0
- features: fase-3-listas, fase-4-precos
- evidence: CartDetail.test.tsx, ProductPicker.test.tsx — Ionicons not available in test env
- last seen: 2026-07-22T00:00:00Z

### L-005 — Mock @legendapp/list LegendList in screen tests — native list deps not available in Jest
- signal: `test_failure` · recurrence: 2 feature(s) · scope: `screen tests` · harmful: 0
- features: fase-3-listas, fase-4-precos
- evidence: CartDetail.test.tsx, ProductPicker.test.tsx — LegendList needs mock
- last seen: 2026-07-22T00:00:00Z

### L-006 — Run npx expo customize after adding new Expo Router screen files — TS route types won't regenerate automatically
- signal: `type_error` · recurrence: 1 feature(s) · scope: `routing` · harmful: 0
- features: fase-3-listas
- evidence: TS complained about missing routes in typed href system until customize was run
- last seen: 2026-07-22T00:00:00Z

### L-007 — Empty-state tests must not permanently mutate shared store mocks — use beforeEach to reset mock state, otherwise mutations leak into subsequent tests causing false failures
- signal: `test_flake` · recurrence: 1 feature(s) · scope: `screen tests` · harmful: 0
- features: fase-4-precos
- evidence: CartDetail test — empty-state test permanently mutated useCartStore mock
- last seen: 2026-07-22T00:00:00Z

### L-008 — FAB on Android uses accessibilityLabel not text content — test with getByLabelText, not getByText
- signal: `test_failure` · recurrence: 1 feature(s) · scope: `screen tests` · harmful: 0
- features: fase-4-precos
- evidence: CartDetail FAB test — getByText returned null, getByLabelText worked
- last seen: 2026-07-22T00:00:00Z

## Quarantined (failed when applied — ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
